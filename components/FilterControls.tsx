
import React from 'react';
import type { Grade, Subject } from '../types';
import { GRADES, SUBJECTS } from '../constants';

interface FilterControlsProps {
  selectedGrade: Grade | null;
  onGradeChange: (grade: Grade | null) => void;
  selectedSubject: Subject | null;
  onSubjectChange: (subject: Subject | null) => void;
  selectedTitle: string | null;
  onTitleChange: (title: string | null) => void;
  availableTitles: string[];
}

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }> = ({ children, ...props }) => (
    <select {...props} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow">
        {children}
    </select>
);

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedGrade,
  onGradeChange,
  selectedSubject,
  onSubjectChange,
  selectedTitle,
  onTitleChange,
  availableTitles,
}) => {
  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-cyan-400">Find Your Lesson</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="grade-select" className="block text-sm font-medium mb-1 text-gray-300">Grade</label>
          <Select id="grade-select" value={selectedGrade || ''} onChange={(e) => { onGradeChange(e.target.value as Grade); onSubjectChange(null); onTitleChange(null); }}>
            <option value="" disabled>Select a grade</option>
            {GRADES.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
          </Select>
        </div>
        <div>
          <label htmlFor="subject-select" className="block text-sm font-medium mb-1 text-gray-300">Subject</label>
          <Select id="subject-select" value={selectedSubject || ''} onChange={(e) => { onSubjectChange(e.target.value as Subject); onTitleChange(null); }} disabled={!selectedGrade}>
            <option value="" disabled>Select a subject</option>
            {SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
          </Select>
        </div>
        <div>
          <label htmlFor="title-select" className="block text-sm font-medium mb-1 text-gray-300">Title</label>
          <Select id="title-select" value={selectedTitle || ''} onChange={(e) => onTitleChange(e.target.value)} disabled={!selectedSubject}>
            <option value="" disabled>Select a title</option>
            {availableTitles.map((title) => <option key={title} value={title}>{title}</option>)}
          </Select>
        </div>
      </div>
    </div>
  );
};
