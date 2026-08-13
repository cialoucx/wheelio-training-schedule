import { Lesson, ScheduleFilters, SortableColumn } from '../types';
import { isDateInRange } from './dateHelpers';

/** True when a lesson satisfies every active filter. Inactive filters match everything. */
export const matchesFilters = (lesson: Lesson, filters: ScheduleFilters): boolean => {
  const { dateRange, instructorId, status, searchTerm } = filters;

  if (!isDateInRange(lesson.date, dateRange.start, dateRange.end)) return false;
  if (instructorId && lesson.instructorId !== instructorId) return false;
  if (status && lesson.status !== status) return false;

  const term = searchTerm.trim().toLowerCase();
  if (!term) return true;

  return (
    lesson.trainee.name.toLowerCase().includes(term) ||
    lesson.trainee.email.toLowerCase().includes(term)
  );
};
export const compareLessons = (a: Lesson, b: Lesson, column: SortableColumn): number => {
  switch (column) {
    case 'date': {
      const byDate = a.date.getTime() - b.date.getTime();
      return byDate !== 0 ? byDate : a.startTime.localeCompare(b.startTime);
    }
    case 'traineeName':
      return a.trainee.name.localeCompare(b.trainee.name);
    case 'instructorName':
      return a.instructor.name.localeCompare(b.instructor.name);
    case 'status':
      return a.status.localeCompare(b.status);
  }
};
