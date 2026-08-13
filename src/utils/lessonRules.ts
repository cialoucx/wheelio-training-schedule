import { AttendanceStatus, Lesson, LessonStatus } from '../types';

export const attendanceStatusOf = (lesson: Lesson): AttendanceStatus =>
  lesson.attendance?.status ?? AttendanceStatus.NOT_MARKED;

export const hasAttendance = (lesson: Lesson): boolean =>
  attendanceStatusOf(lesson) !== AttendanceStatus.NOT_MARKED;

export const canMarkAttendance = (lesson: Lesson): boolean =>
  lesson.status !== LessonStatus.CANCELLED;

export const courseProgress = (lesson: Lesson): number =>
  lesson.totalLessons > 0 ? lesson.lessonNumber / lesson.totalLessons : 0;
