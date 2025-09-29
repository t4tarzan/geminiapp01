import React, { useEffect, useState } from 'react';
import type { Lesson } from '../types';
import { RaiseHandIcon, BackIcon, PlayIcon } from './icons';

interface VideoPlayerProps {
  lesson: Lesson;
  onRaiseHand: () => void;
  isPaused: boolean;
  onBack: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson, onRaiseHand, isPaused, onBack }) => {
  const [player, setPlayer] = useState<any>(null); // YT.Player instance

  useEffect(() => {
    let newPlayer: any = null;
    const playerId = `youtube-player-${lesson.id}`;

    const onYouTubeIframeAPIReady = () => {
      if (!document.getElementById(playerId)) return;
      newPlayer = new (window as any).YT.Player(playerId, {
        videoId: lesson.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            setPlayer(newPlayer);
          },
        },
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    return () => {
      player?.destroy();
      setPlayer(null);
      if ((window as any).onYouTubeIframeAPIReady === onYouTubeIframeAPIReady) {
        (window as any).onYouTubeIframeAPIReady = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.videoId, lesson.id]);

  useEffect(() => {
    if (player && typeof player.pauseVideo === 'function') {
      if (isPaused) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  }, [isPaused, player]);

  return (
    <div className="flex flex-col flex-grow w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <BackIcon className="w-5 h-5" />
          <span>Back to Lessons</span>
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-cyan-400">{lesson.title}</h2>
          <p className="text-gray-400">{lesson.grade} &bull; {lesson.subject}</p>
        </div>
      </div>
      <div className="relative w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-gray-700">
        <div id={`youtube-player-${lesson.id}`} className="w-full h-full" />
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <PlayIcon className="w-24 h-24 text-gray-400 mx-auto opacity-50" />
              <p className="text-2xl font-bold mt-4 text-gray-300">PAUSED</p>
              <p className="text-gray-400">AI Assistant is active.</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onRaiseHand}
          className="flex items-center space-x-3 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <RaiseHandIcon className="w-8 h-8" />
          <span className="text-xl">Raise Hand & Ask Question</span>
        </button>
      </div>
    </div>
  );
};
