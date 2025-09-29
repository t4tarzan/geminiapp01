
export enum Grade {
  GRADE_5 = '5th Grade',
  GRADE_6 = '6th Grade',
  GRADE_7 = '7th Grade',
  GRADE_8 = '8th Grade',
}

export enum Subject {
  MATH = 'Mathematics',
  SCIENCE = 'Science',
  HISTORY = 'History',
}

export interface Lesson {
  id: number;
  grade: Grade;
  subject: Subject;
  title: string;
  videoId: string;
  transcript: string;
}
