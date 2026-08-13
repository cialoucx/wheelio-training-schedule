import {
  Attendance,
  AttendanceStatus,
  Instructor,
  Lesson,
  LessonStatus,
  ScheduleFilters,
  Trainee,
  Vehicle,
} from '../types';

const TRAINEE: Trainee = {
  id: 'tr-1',
  name: 'Alex Thompson',
  email: 'alex.t@email.com',
  phone: '+1 (555) 300-1001',
  licenseClass: 'Class B',
};

const INSTRUCTOR: Instructor = {
  id: 'in-1',
  name: 'James Anderson',
  email: 'james.a@wheelio.com',
  phone: '+1 (555) 400-2001',
  licenseNumber: 'LIC-JA-2019',
  yearsExperience: 12,
  specializations: ['Highway'],
};

const VEHICLE: Vehicle = {
  id: 've-1',
  make: 'Toyota',
  model: 'Corolla',
  year: 2023,
  registrationNumber: 'DRV-001',
  type: 'Sedan',
  color: 'White',
};

export const makeLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  id: 'les-001',
  traineeId: TRAINEE.id,
  trainee: TRAINEE,
  instructorId: INSTRUCTOR.id,
  instructor: INSTRUCTOR,
  vehicleId: VEHICLE.id,
  vehicle: VEHICLE,
  date: new Date('2026-08-13T00:00:00'),
  startTime: '09:00',
  endTime: '10:00',
  status: LessonStatus.SCHEDULED,
  lessonNumber: 1,
  totalLessons: 10,
  ...overrides,
});

export const makeTrainee = (overrides: Partial<Trainee> = {}): Trainee => ({
  ...TRAINEE,
  ...overrides,
});

export const makeInstructor = (overrides: Partial<Instructor> = {}): Instructor => ({
  ...INSTRUCTOR,
  ...overrides,
});

export const makeAttendance = (overrides: Partial<Attendance> = {}): Attendance => ({
  lessonId: 'les-001',
  status: AttendanceStatus.PRESENT,
  timestamp: new Date('2026-08-13T10:05:00'),
  ...overrides,
});

/** No filter active — every lesson matches. */
export const noFilters = (overrides: Partial<ScheduleFilters> = {}): ScheduleFilters => ({
  dateRange: { start: null, end: null },
  instructorId: null,
  status: null,
  searchTerm: '',
  ...overrides,
});
