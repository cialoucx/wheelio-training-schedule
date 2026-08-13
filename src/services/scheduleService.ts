import { Lesson, Instructor, Attendance, AttendanceStatus } from '../types';
import { MOCK_LESSONS, INSTRUCTORS } from '../data/mockData';

const READ_LATENCY_MS = 800;
const WRITE_LATENCY_MS = 600;

const SIMULATE_PARAM = 'simulate';

const simulateError =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get(SIMULATE_PARAM) === 'error';

const delay = <T,>(value: T, ms: number): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const hydrate = (lesson: Lesson): Lesson => ({
  ...lesson,
  date: new Date(lesson.date),
  attendance: lesson.attendance
    ? { ...lesson.attendance, timestamp: new Date(lesson.attendance.timestamp) }
    : undefined,
});

export const fetchLessons = ({ isRetry = false } = {}): Promise<Lesson[]> =>
  new Promise<Lesson[]>((resolve, reject) => {
    setTimeout(() => {
      if (simulateError && !isRetry) {
        reject(new Error('Unable to reach the scheduling service.'));
        return;
      }
      resolve(MOCK_LESSONS.map(hydrate));
    }, READ_LATENCY_MS);
  });

export const fetchInstructors = (): Promise<Instructor[]> =>
  delay(INSTRUCTORS, READ_LATENCY_MS);

export interface UpdateAttendancePayload {
  lessonId: string;
  status: AttendanceStatus;
  comments?: string;
}


export const updateAttendance = ({
  lessonId,
  status,
  comments,
}: UpdateAttendancePayload): Promise<Attendance> =>
  delay(
    {
      lessonId,
      status,
      comments: comments?.trim() || undefined,
      timestamp: new Date(),
    },
    WRITE_LATENCY_MS,
  );
