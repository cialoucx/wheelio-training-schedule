import { LessonStatus, AttendanceStatus } from '../types';

export interface StatusToken {
  label: string;
  color: string;
}

export const LESSON_STATUS: Record<LessonStatus, StatusToken> = {
  [LessonStatus.SCHEDULED]:   { label: 'Scheduled',   color: 'text.disabled' },
  [LessonStatus.COMPLETED]:   { label: 'Completed',   color: 'success.main' },
  [LessonStatus.CANCELLED]:   { label: 'Cancelled',   color: 'error.main' },
  [LessonStatus.RESCHEDULED]: { label: 'Rescheduled', color: 'warning.main' },
};

export const ATTENDANCE_STATUS: Record<AttendanceStatus, StatusToken> = {
  [AttendanceStatus.PRESENT]:    { label: 'Present',    color: 'success.main' },
  [AttendanceStatus.ABSENT]:     { label: 'Absent',     color: 'error.main' },
  [AttendanceStatus.LATE]:       { label: 'Late',       color: 'warning.main' },
  [AttendanceStatus.NOT_MARKED]: { label: 'Pending', color: 'text.disabled' },
};

export const LESSON_STATUS_OPTIONS = Object.entries(LESSON_STATUS).map(
  ([value, token]) => ({ value: value as LessonStatus, ...token }),
);

export const ATTENDANCE_OPTIONS = [
  AttendanceStatus.PRESENT,
  AttendanceStatus.ABSENT,
  AttendanceStatus.LATE,
].map((value) => ({ value, ...ATTENDANCE_STATUS[value] }));
