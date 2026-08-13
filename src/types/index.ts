export enum LessonStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  NOT_MARKED = 'NOT_MARKED',
}

export interface Trainee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  licenseClass: string;
}

export interface Instructor {
  id: string;
  name: string;
  licenseNumber: string;
  email: string;
  phone: string;
  yearsExperience: number;
  specializations: string[];
  avatarUrl?: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: string;
  make: string;
  model: string;
  year: number;
  color: string;
}

export interface Attendance {
  lessonId: string;
  status: AttendanceStatus;
  timestamp: Date;
  comments?: string;
}

export interface Lesson {
  id: string;
  traineeId: string;
  trainee: Trainee;
  date: Date;
  startTime: string;
  endTime: string;
  instructorId: string;
  instructor: Instructor;
  vehicleId: string;
  vehicle: Vehicle;
  status: LessonStatus;
  attendance?: Attendance;
  notes?: string;
  location?: string;
  lessonNumber: number;
  totalLessons: number;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface ScheduleFilters {
  dateRange: DateRange;
  instructorId: string | null;
  status: LessonStatus | null;
  searchTerm: string;
}

export interface AttendanceForm {
  lessonId: string;
  status: AttendanceStatus | '';
  comments: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type SortDirection = 'asc' | 'desc';

export type SortableColumn = 'date' | 'traineeName' | 'instructorName' | 'status';

export interface SortConfig {
  column: SortableColumn;
  direction: SortDirection;
}

export type AppStatus = 'idle' | 'loading' | 'error' | 'empty';

export interface SnackbarMessage {
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}
