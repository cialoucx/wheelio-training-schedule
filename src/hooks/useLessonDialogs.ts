import { useCallback, useState } from 'react';
import { Lesson } from '../types';

interface UseLessonDialogsReturn {
  selectedLesson: Lesson | null;
  attendanceTarget: Lesson | null;
  openDetails: (lesson: Lesson) => void;
  closeDetails: () => void;
  openAttendance: (lesson: Lesson) => void;
  closeAttendance: () => void;
}

export const useLessonDialogs = (): UseLessonDialogsReturn => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [attendanceTarget, setAttendanceTarget] = useState<Lesson | null>(null);

  const openDetails = useCallback((lesson: Lesson) => setSelectedLesson(lesson), []);
  const closeDetails = useCallback(() => setSelectedLesson(null), []);
  const openAttendance = useCallback((lesson: Lesson) => setAttendanceTarget(lesson), []);
  const closeAttendance = useCallback(() => setAttendanceTarget(null), []);

  return {
    selectedLesson,
    attendanceTarget,
    openDetails,
    closeDetails,
    openAttendance,
    closeAttendance,
  };
};
