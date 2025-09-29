
import React from 'react';
import type { Lesson } from '../types';

interface VideoListProps {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
}

export const VideoList: React.FC<VideoListProps> = ({ lessons, onSelectLesson }) => {
  if (lessons.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-800/50 rounded-lg p-8 text-center border-2 border-dashed border-gray-700">
        <p className="text-gray-400">Please select a grade, subject, and title to see available lessons.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
          <img src={`https://picsum.photos/seed/${lesson.id}/400/225`} alt={lesson.title} className="w-full h-40 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-1">{lesson.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{lesson.grade} &bull; {lesson.subject}</p>
            <button
              onClick={() => onSelectLesson(lesson)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Start Lesson
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
