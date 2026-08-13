import { describe, expect, it } from 'vitest';

import { compareLessons, matchesFilters } from './lessonQuery';
import { LessonStatus } from '../types';
import { makeInstructor, makeLesson, makeTrainee, noFilters } from '../test/factories';

const AUG_13 = new Date('2026-08-13T00:00:00');
const AUG_15 = new Date('2026-08-15T00:00:00');
const AUG_20 = new Date('2026-08-20T00:00:00');

describe('matchesFilters', () => {
  it('matches every lesson when no filter is active', () => {
    expect(matchesFilters(makeLesson(), noFilters())).toBe(true);
  });

  it('includes lessons on both ends of the date range', () => {
    const range = noFilters({ dateRange: { start: AUG_13, end: AUG_20 } });

    expect(matchesFilters(makeLesson({ date: AUG_13 }), range)).toBe(true);
    expect(matchesFilters(makeLesson({ date: AUG_20 }), range)).toBe(true);
    expect(matchesFilters(makeLesson({ date: AUG_15 }), range)).toBe(true);
  });

  it('excludes lessons outside the date range', () => {
    const range = noFilters({ dateRange: { start: AUG_15, end: AUG_20 } });

    expect(matchesFilters(makeLesson({ date: AUG_13 }), range)).toBe(false);
  });

  it('treats an open-ended range as a single bound', () => {
    const from = noFilters({ dateRange: { start: AUG_15, end: null } });
    const until = noFilters({ dateRange: { start: null, end: AUG_15 } });

    expect(matchesFilters(makeLesson({ date: AUG_20 }), from)).toBe(true);
    expect(matchesFilters(makeLesson({ date: AUG_13 }), from)).toBe(false);
    expect(matchesFilters(makeLesson({ date: AUG_13 }), until)).toBe(true);
    expect(matchesFilters(makeLesson({ date: AUG_20 }), until)).toBe(false);
  });

  it('filters by instructor and lesson status', () => {
    const lesson = makeLesson({ instructorId: 'in-1', status: LessonStatus.COMPLETED });

    expect(matchesFilters(lesson, noFilters({ instructorId: 'in-1' }))).toBe(true);
    expect(matchesFilters(lesson, noFilters({ instructorId: 'in-2' }))).toBe(false);
    expect(matchesFilters(lesson, noFilters({ status: LessonStatus.COMPLETED }))).toBe(true);
    expect(matchesFilters(lesson, noFilters({ status: LessonStatus.CANCELLED }))).toBe(false);
  });

  it('searches trainee name and email, case-insensitively', () => {
    const lesson = makeLesson({
      trainee: makeTrainee({ name: 'Alex Thompson', email: 'alex.t@email.com' }),
    });

    expect(matchesFilters(lesson, noFilters({ searchTerm: 'THOMP' }))).toBe(true);
    expect(matchesFilters(lesson, noFilters({ searchTerm: 'alex.t@' }))).toBe(true);
    expect(matchesFilters(lesson, noFilters({ searchTerm: 'zzz' }))).toBe(false);
  });

  it('does not search the instructor name', () => {
    const lesson = makeLesson({ instructor: makeInstructor({ name: 'James Anderson' }) });

    expect(matchesFilters(lesson, noFilters({ searchTerm: 'James' }))).toBe(false);
  });

  it('ignores a whitespace-only search term', () => {
    expect(matchesFilters(makeLesson(), noFilters({ searchTerm: '   ' }))).toBe(true);
  });

  it('combines active filters with AND', () => {
    const lesson = makeLesson({
      date: AUG_15,
      instructorId: 'in-1',
      status: LessonStatus.COMPLETED,
    });
    const filters = noFilters({
      dateRange: { start: AUG_13, end: AUG_20 },
      instructorId: 'in-1',
      status: LessonStatus.COMPLETED,
      searchTerm: 'alex',
    });

    expect(matchesFilters(lesson, filters)).toBe(true);
    // One failing clause is enough to reject the lesson.
    expect(matchesFilters(lesson, { ...filters, instructorId: 'in-2' })).toBe(false);
  });
});

describe('compareLessons', () => {
  it('orders by date ascending', () => {
    const early = makeLesson({ date: AUG_13 });
    const late = makeLesson({ date: AUG_20 });

    expect(compareLessons(early, late, 'date')).toBeLessThan(0);
    expect(compareLessons(late, early, 'date')).toBeGreaterThan(0);
  });

  it('breaks a same-day tie on start time', () => {
    const morning = makeLesson({ date: AUG_13, startTime: '09:00' });
    const afternoon = makeLesson({ date: AUG_13, startTime: '14:00' });

    expect(compareLessons(morning, afternoon, 'date')).toBeLessThan(0);
  });

  it('orders by trainee and instructor name', () => {
    const alex = makeLesson({ trainee: makeTrainee({ name: 'Alex Thompson' }) });
    const zoe = makeLesson({ trainee: makeTrainee({ name: 'Zoe Baker' }) });
    const anderson = makeLesson({ instructor: makeInstructor({ name: 'Anderson' }) });
    const rivera = makeLesson({ instructor: makeInstructor({ name: 'Rivera' }) });

    expect(compareLessons(alex, zoe, 'traineeName')).toBeLessThan(0);
    expect(compareLessons(anderson, rivera, 'instructorName')).toBeLessThan(0);
  });

  it('orders lesson status alphabetically, as documented', () => {
    const cancelled = makeLesson({ status: LessonStatus.CANCELLED });
    const scheduled = makeLesson({ status: LessonStatus.SCHEDULED });

    expect(compareLessons(cancelled, scheduled, 'status')).toBeLessThan(0);
  });

  it('reports equality as zero so sorting stays stable', () => {
    expect(compareLessons(makeLesson(), makeLesson(), 'date')).toBe(0);
    expect(compareLessons(makeLesson(), makeLesson(), 'traineeName')).toBe(0);
  });
});
