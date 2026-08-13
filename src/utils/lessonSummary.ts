import { Lesson, LessonStatus } from '../types';
import { canMarkAttendance, hasAttendance } from './lessonRules';

export interface LessonSummary {
  total: number;
  upcoming: number;
  completed: number;
  pendingAttendance: number;
}
export const summariseLessons = (lessons: Lesson[]): LessonSummary => {
  let upcoming = 0;
  let completed = 0;
  let pendingAttendance = 0;

  for (const lesson of lessons) {
    if (lesson.status === LessonStatus.SCHEDULED || lesson.status === LessonStatus.RESCHEDULED) {
      upcoming += 1;
    }
    if (lesson.status === LessonStatus.COMPLETED) {
      completed += 1;
    }
    if (canMarkAttendance(lesson) && !hasAttendance(lesson)) {
      pendingAttendance += 1;
    }
  }

  return { total: lessons.length, upcoming, completed, pendingAttendance };
};
