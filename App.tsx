
import React, { useState, useMemo } from 'react';
import { FilterControls } from './components/FilterControls';
import { VideoList } from './components/VideoList';
import { VideoPlayer } from './components/VideoPlayer';
import { VoiceAssistant } from './components/VoiceAssistant';
import { LESSONS } from './constants';
import type { Lesson } from './types';
import { Grade, Subject } from './types';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isAssistantVisible, setAssistantVisible] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const filteredLessons = useMemo(() => {
    if (!selectedGrade || !selectedSubject || !selectedTitle) {
      return [];
    }
    return LESSONS.filter(
      (lesson) =>
        lesson.grade === selectedGrade &&
        lesson.subject === selectedSubject &&
        lesson.title.toLowerCase().includes(selectedTitle.toLowerCase())
    );
  }, [selectedGrade, selectedSubject, selectedTitle]);

  const uniqueTitles = useMemo(() => {
    if (!selectedGrade || !selectedSubject) return [];
    const titles = LESSONS.filter(
      (lesson) => lesson.grade === selectedGrade && lesson.subject === selectedSubject
    ).map((lesson) => lesson.title);
    return [...new Set(titles)];
  }, [selectedGrade, selectedSubject]);

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleRaiseHand = () => {
    setIsPaused(true);
    setAssistantVisible(true);
  };

  const handleCloseAssistant = () => {
    setAssistantVisible(false);
    setIsPaused(false);
  };
  
  const handleBack = () => {
    setCurrentLesson(null);
    setIsPaused(false);
    setAssistantVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <header className="p-4 border-b border-gray-700 shadow-lg bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <LogoIcon />
            <h1 className="text-2xl font-bold tracking-tight text-cyan-400">AI Learning Companion</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
        {isAssistantVisible && currentLesson && (
          <VoiceAssistant
            lesson={currentLesson}
            onClose={handleCloseAssistant}
          />
        )}

        {currentLesson ? (
          <VideoPlayer
            lesson={currentLesson}
            onRaiseHand={handleRaiseHand}
            isPaused={isPaused}
            onBack={handleBack}
          />
        ) : (
          <>
            <FilterControls
              selectedGrade={selectedGrade}
              onGradeChange={setSelectedGrade}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              selectedTitle={selectedTitle}
              onTitleChange={setSelectedTitle}
              availableTitles={uniqueTitles}
            />
            <VideoList
              lessons={filteredLessons}
              onSelectLesson={handleSelectLesson}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
