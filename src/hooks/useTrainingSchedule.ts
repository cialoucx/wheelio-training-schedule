import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Lesson,
  Instructor,
  ScheduleFilters,
  SortConfig,
  AttendanceForm,
  AttendanceStatus,
  AppStatus,
} from '../types';
import { fetchLessons, fetchInstructors, updateAttendance } from '../services/scheduleService';
import { compareLessons, matchesFilters } from '../utils/lessonQuery';
import { validateAttendanceForm } from '../utils/validation';

const INITIAL_SORT: SortConfig = { column: 'date', direction: 'asc' };

interface UseTrainingScheduleReturn {
  lessons: Lesson[];
  instructors: Instructor[];
  status: AppStatus;
  sortConfig: SortConfig;
  filteredCount: number;
  setSortConfig: (config: SortConfig) => void;
  submitAttendance: (form: AttendanceForm) => Promise<void>;
  retryLoad: () => void;
}

export const useTrainingSchedule = (filters: ScheduleFilters): UseTrainingScheduleReturn => {
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [status, setStatus] = useState<AppStatus>('loading');
  const [sortConfig, setSortConfig] = useState<SortConfig>(INITIAL_SORT);
  const abandonInFlight = useRef<(() => void) | null>(null);

  const loadData = useCallback((isRetry = false) => {
    abandonInFlight.current?.();

    let abandoned = false;
    abandonInFlight.current = () => {
      abandoned = true;
    };

    setStatus('loading');
    setAllLessons([]);

    Promise.all([fetchLessons({ isRetry }), fetchInstructors()])
      .then(([lessonData, instructorData]) => {
        if (abandoned) return;
        setAllLessons(lessonData);
        setInstructors(instructorData);
        setStatus('idle');
      })
      .catch(() => {
        if (abandoned) return;
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    loadData();
    return () => abandonInFlight.current?.();
  }, [loadData]);

  const filteredAndSorted = useMemo<Lesson[]>(() => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    return allLessons
      .filter((lesson) => matchesFilters(lesson, filters))
      .sort((a, b) => compareLessons(a, b, sortConfig.column) * direction);
  }, [allLessons, filters, sortConfig]);

  const appStatus = useMemo<AppStatus>(() => {
    if (status === 'loading' || status === 'error') return status;
    return filteredAndSorted.length === 0 ? 'empty' : 'idle';
  }, [status, filteredAndSorted]);

  const submitAttendance = useCallback(async (form: AttendanceForm): Promise<void> => {
    const errors = validateAttendanceForm(form);
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }

    const saved = await updateAttendance({
      lessonId: form.lessonId,
      status: form.status as AttendanceStatus,
      comments: form.comments,
    });

    setAllLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === saved.lessonId ? { ...lesson, attendance: saved } : lesson,
      ),
    );
  }, []);

  const retryLoad = useCallback(() => {
    loadData(true);
  }, [loadData]);

  return {
    lessons: filteredAndSorted,
    instructors,
    status: appStatus,
    sortConfig,
    filteredCount: filteredAndSorted.length,
    setSortConfig,
    submitAttendance,
    retryLoad,
  };
};
