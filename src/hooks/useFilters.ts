import { useState, useCallback, useMemo } from 'react';
import { ScheduleFilters, LessonStatus } from '../types';

const INITIAL_FILTERS: ScheduleFilters = {
  dateRange: { start: null, end: null },
  instructorId: null,
  status: null,
  searchTerm: '',
};

interface UseFiltersReturn {
  filters: ScheduleFilters;
  activeFilterCount: number;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setInstructor: (id: string | null) => void;
  setStatus: (status: LessonStatus | null) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
}

export const useFilters = (): UseFiltersReturn => {
  const [filters, setFilters] = useState<ScheduleFilters>(INITIAL_FILTERS);

  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilters((prev) => ({ ...prev, dateRange: { start, end } }));
  }, []);

  const setInstructor = useCallback((id: string | null) => {
    setFilters((prev) => ({ ...prev, instructorId: id }));
  }, []);

  const setStatus = useCallback((status: LessonStatus | null) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.instructorId) count++;
    if (filters.status) count++;
    if (filters.searchTerm.trim()) count++;
    return count;
  }, [filters]);

  return {
    filters,
    activeFilterCount,
    setDateRange,
    setInstructor,
    setStatus,
    setSearchTerm,
    resetFilters,
  };
};