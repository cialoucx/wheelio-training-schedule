import { describe, expect, it } from 'vitest';

import { attendanceStatusOf, canMarkAttendance, courseProgress, hasAttendance } from './lessonRules';
import { AttendanceStatus, LessonStatus } from '../types';
import { makeAttendance, makeLesson } from '../test/factories';

describe('attendanceStatusOf', () => {
  it('falls back to NOT_MARKED when nothing is recorded', () => {
    expect(attendanceStatusOf(makeLesson())).toBe(AttendanceStatus.NOT_MARKED);
    expect(hasAttendance(makeLesson())).toBe(false);
  });

  it('reads the recorded status when one exists', () => {
    const lesson = makeLesson({ attendance: makeAttendance({ status: AttendanceStatus.LATE }) });

    expect(attendanceStatusOf(lesson)).toBe(AttendanceStatus.LATE);
    expect(hasAttendance(lesson)).toBe(true);
  });
});

describe('canMarkAttendance', () => {
  it('blocks only cancelled lessons', () => {
    expect(canMarkAttendance(makeLesson({ status: LessonStatus.CANCELLED }))).toBe(false);
    expect(canMarkAttendance(makeLesson({ status: LessonStatus.SCHEDULED }))).toBe(true);
    expect(canMarkAttendance(makeLesson({ status: LessonStatus.RESCHEDULED }))).toBe(true);
  });

  it('still allows marking a completed lesson, since attendance is recorded afterwards', () => {
    expect(canMarkAttendance(makeLesson({ status: LessonStatus.COMPLETED }))).toBe(true);
  });
});

describe('lesson status and attendance are independent', () => {
  it('represents a no-show as a completed lesson with absent attendance', () => {
    const noShow = makeLesson({
      status: LessonStatus.COMPLETED,
      attendance: makeAttendance({ status: AttendanceStatus.ABSENT }),
    });

    expect(noShow.status).toBe(LessonStatus.COMPLETED);
    expect(attendanceStatusOf(noShow)).toBe(AttendanceStatus.ABSENT);
    expect(canMarkAttendance(noShow)).toBe(true);
  });

  it('leaves a cancelled lesson with no attendance to record', () => {
    const cancelled = makeLesson({ status: LessonStatus.CANCELLED });

    expect(attendanceStatusOf(cancelled)).toBe(AttendanceStatus.NOT_MARKED);
  });
});

describe('courseProgress', () => {
  it('returns the completed fraction of the course', () => {
    expect(courseProgress(makeLesson({ lessonNumber: 5, totalLessons: 10 }))).toBe(0.5);
    expect(courseProgress(makeLesson({ lessonNumber: 10, totalLessons: 10 }))).toBe(1);
  });

  it('guards against dividing by zero', () => {
    expect(courseProgress(makeLesson({ lessonNumber: 1, totalLessons: 0 }))).toBe(0);
  });
});
