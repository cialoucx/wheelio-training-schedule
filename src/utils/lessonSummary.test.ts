import { describe, expect, it } from 'vitest';

import { summariseLessons } from './lessonSummary';
import { AttendanceStatus, LessonStatus } from '../types';
import { makeAttendance, makeLesson } from '../test/factories';

describe('summariseLessons', () => {
  it('returns zeros for an empty list', () => {
    expect(summariseLessons([])).toEqual({
      total: 0,
      upcoming: 0,
      completed: 0,
      pendingAttendance: 0,
    });
  });

  it('counts scheduled and rescheduled lessons as upcoming', () => {
    const lessons = [
      makeLesson({ status: LessonStatus.SCHEDULED }),
      makeLesson({ status: LessonStatus.RESCHEDULED }),
      makeLesson({ status: LessonStatus.COMPLETED }),
      makeLesson({ status: LessonStatus.CANCELLED }),
    ];

    expect(summariseLessons(lessons).upcoming).toBe(2);
  });

  it('counts only completed lessons as completed', () => {
    const lessons = [
      makeLesson({ status: LessonStatus.COMPLETED }),
      makeLesson({ status: LessonStatus.COMPLETED }),
      makeLesson({ status: LessonStatus.SCHEDULED }),
    ];

    expect(summariseLessons(lessons).completed).toBe(2);
  });

  it('counts an unmarked, markable lesson as pending attendance', () => {
    const lessons = [
      makeLesson({ status: LessonStatus.SCHEDULED }),
      makeLesson({ status: LessonStatus.COMPLETED }),
    ];

    expect(summariseLessons(lessons).pendingAttendance).toBe(2);
  });

  it('excludes cancelled lessons from pending attendance', () => {
    const lessons = [
      makeLesson({ status: LessonStatus.CANCELLED }),
      makeLesson({ status: LessonStatus.SCHEDULED }),
    ];

    expect(summariseLessons(lessons).pendingAttendance).toBe(1);
  });

  it('excludes already-marked lessons from pending attendance', () => {
    const lessons = [
      makeLesson({
        status: LessonStatus.COMPLETED,
        attendance: makeAttendance({ status: AttendanceStatus.PRESENT }),
      }),
      makeLesson({
        status: LessonStatus.COMPLETED,
        attendance: makeAttendance({ status: AttendanceStatus.ABSENT }),
      }),
      makeLesson({ status: LessonStatus.COMPLETED }),
    ];

    expect(summariseLessons(lessons).pendingAttendance).toBe(1);
  });

  it('counts an absent record as marked, not pending', () => {
    const noShow = makeLesson({
      status: LessonStatus.COMPLETED,
      attendance: makeAttendance({ status: AttendanceStatus.ABSENT }),
    });

    expect(summariseLessons([noShow]).pendingAttendance).toBe(0);
  });

  it('reports total as the size of the list it was given', () => {
    const lessons = [
      makeLesson({ status: LessonStatus.CANCELLED }),
      makeLesson({ status: LessonStatus.COMPLETED }),
      makeLesson({ status: LessonStatus.SCHEDULED }),
    ];

    // Categories overlap the total rather than partitioning it: a cancelled
    // lesson is counted in none of the other three.
    const summary = summariseLessons(lessons);
    expect(summary.total).toBe(3);
    expect(summary.upcoming + summary.completed).toBe(2);
  });
});
