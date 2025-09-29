import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Lesson } from '../types';
// FIX: The 'LiveSession' type is not exported from the '@google/genai' package.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { MicIcon, CloseIcon, UserIcon, BotIcon, PlayIcon, LinkIcon } from './icons';

interface VoiceAssistantProps {
  lesson: Lesson;
  onClose: () => void;
}

interface WebSource {
  uri: string;
  title: string;
}

interface Transcript {
  source: 'user' | 'bot';
  text: string;
  sources?: WebSource[];
}

// FIX: Define a local interface for the live session object as it is not exported.
interface LiveSession {
  close: () => void;
  sendRealtimeInput: (input: { media: Blob }) => void;
}

// Audio encoding/decoding utilities
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ lesson, onClose }) => {
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'SPEAKING' | 'ERROR' | 'AWAITING_CONFIRMATION'>('IDLE');
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');
  const groundingChunksRef = useRef<any[]>([]);
  const turnCompleteRef = useRef(false);

  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const handleClose = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let inputAudioContext: AudioContext | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;
    
    const initializeAssistant = async () => {
        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY environment variable not set");
            }

            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStatus('LISTENING');
            
            inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        const source = inputAudioContext!.createMediaStreamSource(stream!);
                        scriptProcessor = inputAudioContext!.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle transcriptions
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }

                        // Handle grounding metadata
                        // FIX: Property 'candidates' does not exist on type 'LiveServerContent'. Grounding metadata should be associated with the model's turn.
                        const chunks = (message.serverContent as any)?.groundingMetadata?.groundingChunks;
                        if (chunks) {
                            groundingChunksRef.current.push(...chunks);
                        }

                        if (message.serverContent?.turnComplete) {
                            if (currentInputTranscriptionRef.current) {
                                setTranscripts(prev => [...prev, { source: 'user', text: currentInputTranscriptionRef.current }]);
                            }
                            if (currentOutputTranscriptionRef.current) {
                                const sources = groundingChunksRef.current
                                    .map(chunk => chunk.web)
                                    .filter(Boolean)
                                    // Deduplicate based on URI
                                    .filter((source, index, self) => 
                                        index === self.findIndex((s) => s.uri === source.uri)
                                    );
                                    
                                setTranscripts(prev => [...prev, { source: 'bot', text: currentOutputTranscriptionRef.current, sources }]);
                            }
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                            groundingChunksRef.current = [];
                            turnCompleteRef.current = true;
                            if (audioSourcesRef.current.size === 0) {
                                setStatus('AWAITING_CONFIRMATION');
                            }
                        }

                        // Handle audio playback
                        const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64EncodedAudioString && outputAudioContextRef.current) {
                            setStatus('SPEAKING');
                            nextStartTimeRef.current = Math.max(
                                nextStartTimeRef.current,
                                outputAudioContextRef.current.currentTime,
                            );
                            const audioBuffer = await decodeAudioData(
                                decode(base64EncodedAudioString),
                                outputAudioContextRef.current,
                                24000, 1
                            );
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            source.addEventListener('ended', () => {
                                audioSourcesRef.current.delete(source);
                                if (audioSourcesRef.current.size === 0) {
                                    if(turnCompleteRef.current) {
                                        setStatus('AWAITING_CONFIRMATION');
                                    } else {
                                        setStatus('LISTENING');
                                    }
                                }
                            });

                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Gemini Live API Error:', e);
                        setStatus('ERROR');
                    },
                    onclose: () => {
                        // Cleanup
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: `You are a friendly and helpful teaching assistant for a ${lesson.grade} student. The student is watching a video titled '${lesson.title}' about '${lesson.subject}'. The transcript of the video is: "${lesson.transcript}". Your task is to clarify any doubts the student has. Start by greeting them warmly. Answer their question concisely based on the video's context, but use your general knowledge and perform a web search to provide a more complete and interesting answer that is age-appropriate. If you use web search, your answer will be grounded in the search results. Always keep your explanation simple and engaging for a child.`,
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                    tools: [{googleSearch: {}}]
                },
            });
        } catch (error) {
            console.error('Failed to initialize voice assistant:', error);
            setStatus('ERROR');
        }
    };
    
    initializeAssistant();

    return () => {
        // Cleanup function
        stream?.getTracks().forEach(track => track.stop());
        inputAudioContext?.close();
        outputAudioContextRef.current?.close();
        if(sessionPromiseRef.current) {
           sessionPromiseRef.current.then(session => session.close());
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson]);
  

  const getStatusIndicator = () => {
    switch(status) {
        case 'LISTENING':
            return (
                <div className="flex flex-col items-center">
                    <MicIcon className="w-16 h-16 text-cyan-400 animate-pulse" />
                    <p className="mt-4 text-lg">Listening...</p>
                    <p className="text-sm text-gray-400">Ask me anything about "{lesson.title}"</p>
                </div>
            );
        case 'SPEAKING':
             return (
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16">
                        <BotIcon className="w-16 h-16 text-cyan-400" />
                        <span className="absolute top-0 right-0 h-4 w-4 bg-green-400 rounded-full animate-ping"></span>
                        <span className="absolute top-0 right-0 h-4 w-4 bg-green-400 rounded-full"></span>
                    </div>
                    <p className="mt-4 text-lg">Answering your question...</p>
                </div>
            );
        case 'AWAITING_CONFIRMATION':
            return (
                <div className="flex flex-col items-center text-center">
                    <p className="text-lg mb-4 text-gray-300">Is your doubt cleared?</p>
                    <button
                        onClick={handleClose}
                        className="flex items-center space-x-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                        <PlayIcon className="w-6 h-6" />
                        <span className="text-xl">Yes, Resume Video</span>
                    </button>
                </div>
            );
        case 'ERROR':
            return (
                <div className="flex flex-col items-center text-red-400">
                    <p>Sorry, an error occurred. Please try again.</p>
                </div>
            );
        default:
             return (
                <div className="flex flex-col items-center">
                    <p>Initializing...</p>
                </div>
            );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-cyan-400">AI Assistant</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {transcripts.map((t, i) => (
                <div key={i} className={`flex items-start gap-3 ${t.source === 'user' ? 'justify-end' : ''}`}>
                    {t.source === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center"><BotIcon className="w-5 h-5 text-gray-900"/></div>}
                    <div className={`max-w-md p-3 rounded-xl ${t.source === 'user' ? 'bg-gray-700' : 'bg-gray-700/50'}`}>
                        <p className="text-white">{t.text}</p>
                        {t.sources && t.sources.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-gray-600">
                                <h4 className="text-xs font-semibold text-gray-400 mb-1">Sources:</h4>
                                <ul className="space-y-1">
                                {t.sources.map((source, index) => (
                                    <li key={index}>
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1.5 break-all">
                                        <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                        <span>{source.title || new URL(source.uri).hostname}</span>
                                    </a>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {t.source === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><UserIcon className="w-5 h-5 text-white"/></div>}
                </div>
            ))}
        </div>

        <div className="pt-6 border-t border-gray-700 flex items-center justify-center min-h-[120px]">
            {getStatusIndicator()}
        </div>
      </div>
    </div>
  );
};
