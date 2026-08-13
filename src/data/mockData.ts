import {
  Lesson,
  LessonStatus,
  AttendanceStatus,
  Trainee,
  Instructor,
  Vehicle,
} from '../types';

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'ins-001',
    name: 'James Anderson',
    licenseNumber: 'LIC-JA-2019',
    email: 'j.anderson@drivepro.com',
    phone: '+1 (555) 201-3344',
    yearsExperience: 12,
    specializations: ['Highway', 'Defensive Driving'],
  },
  {
    id: 'ins-002',
    name: 'Sarah Mitchell',
    licenseNumber: 'LIC-SM-2021',
    email: 's.mitchell@drivepro.com',
    phone: '+1 (555) 207-8821',
    yearsExperience: 8,
    specializations: ['Urban Driving', 'Parallel Parking'],
  },
  {
    id: 'ins-003',
    name: 'Carlos Rivera',
    licenseNumber: 'LIC-CR-2017',
    email: 'c.rivera@drivepro.com',
    phone: '+1 (555) 213-5590',
    yearsExperience: 15,
    specializations: ['Night Driving', 'Highway', 'Advanced Maneuvers'],
  },
  {
    id: 'ins-004',
    name: 'Emily Chen',
    licenseNumber: 'LIC-EC-2022',
    email: 'e.chen@drivepro.com',
    phone: '+1 (555) 219-6672',
    yearsExperience: 5,
    specializations: ['City Driving', 'First-Time Drivers'],
  },
];

export const VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    registrationNumber: 'DRV-001',
    type: 'Sedan',
    make: 'Toyota',
    model: 'Corolla',
    year: 2023,
    color: 'White',
  },
  {
    id: 'veh-002',
    registrationNumber: 'DRV-002',
    type: 'SUV',
    make: 'Honda',
    model: 'CR-V',
    year: 2022,
    color: 'Silver',
  },
  {
    id: 'veh-003',
    registrationNumber: 'DRV-003',
    type: 'Sedan',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2023,
    color: 'Blue',
  },
  {
    id: 'veh-004',
    registrationNumber: 'DRV-004',
    type: 'Hatchback',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2022,
    color: 'Red',
  },
];

const TRAINEES: Trainee[] = [
  { id: 'trn-001', name: 'Alex Thompson', email: 'alex.t@email.com', phone: '+1 (555) 300-1001', licenseClass: 'Class B' },
  { id: 'trn-002', name: 'Mia Johnson', email: 'mia.j@email.com', phone: '+1 (555) 300-1002', licenseClass: 'Class B' },
  { id: 'trn-003', name: 'Liam Garcia', email: 'liam.g@email.com', phone: '+1 (555) 300-1003', licenseClass: 'Class A' },
  { id: 'trn-004', name: 'Sophia Brown', email: 'sophia.b@email.com', phone: '+1 (555) 300-1004', licenseClass: 'Class B' },
  { id: 'trn-005', name: 'Noah Davis', email: 'noah.d@email.com', phone: '+1 (555) 300-1005', licenseClass: 'Class B' },
  { id: 'trn-006', name: 'Isabella Martinez', email: 'isabella.m@email.com', phone: '+1 (555) 300-1006', licenseClass: 'Class A' },
  { id: 'trn-007', name: 'Ethan Wilson', email: 'ethan.w@email.com', phone: '+1 (555) 300-1007', licenseClass: 'Class B' },
  { id: 'trn-008', name: 'Olivia Taylor', email: 'olivia.t@email.com', phone: '+1 (555) 300-1008', licenseClass: 'Class B' },
  { id: 'trn-009', name: 'Lucas Moore', email: 'lucas.m@email.com', phone: '+1 (555) 300-1009', licenseClass: 'Class A' },
  { id: 'trn-010', name: 'Emma Anderson', email: 'emma.a@email.com', phone: '+1 (555) 300-1010', licenseClass: 'Class B' },
];

function makeLesson(
  id: string,
  traineeIdx: number,
  instructorIdx: number,
  vehicleIdx: number,
  daysOffset: number,
  startTime: string,
  endTime: string,
  status: LessonStatus,
  lessonNum: number,
  totalLessons: number,
  notes?: string,
  location?: string,
  attendanceStatus?: AttendanceStatus,
): Lesson {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(0, 0, 0, 0);

  const trainee = TRAINEES[traineeIdx];
  const instructor = INSTRUCTORS[instructorIdx];
  const vehicle = VEHICLES[vehicleIdx];

  const ATTENDANCE_COMMENTS: Record<AttendanceStatus, string | undefined> = {
    [AttendanceStatus.PRESENT]: 'Good session overall.',
    [AttendanceStatus.LATE]: 'Arrived 15 minutes late; session shortened.',
    [AttendanceStatus.ABSENT]: 'No-show. Trainee gave no advance notice.',
    [AttendanceStatus.NOT_MARKED]: undefined,
  };

  const attendance = attendanceStatus
    ? {
        lessonId: id,
        status: attendanceStatus,
        timestamp: new Date(date.getTime() + 2 * 3600 * 1000),
        comments: ATTENDANCE_COMMENTS[attendanceStatus],
      }
    : undefined;

  return {
    id,
    traineeId: trainee.id,
    trainee,
    date,
    startTime,
    endTime,
    instructorId: instructor.id,
    instructor,
    vehicleId: vehicle.id,
    vehicle,
    status,
    attendance,
    notes,
    location: location ?? 'Main Training Ground',
    lessonNumber: lessonNum,
    totalLessons,
  };
}

export const MOCK_LESSONS: Lesson[] = [
  makeLesson('les-001', 0, 0, 0, -7,  '09:00', '10:00', LessonStatus.COMPLETED, 1, 10, 'First lesson – familiarisation.', 'Main Training Ground', AttendanceStatus.PRESENT),
  makeLesson('les-002', 1, 1, 1, -6,  '10:30', '11:30', LessonStatus.COMPLETED, 2, 8,  'Clutch control focus.', 'City Circuit', AttendanceStatus.PRESENT),
  makeLesson('les-003', 2, 2, 2, -5,  '14:00', '15:00', LessonStatus.CANCELLED, 3, 12, 'Cancelled – weather.', 'Highway Route A'),
  makeLesson('les-004', 3, 3, 3, -4,  '08:00', '09:00', LessonStatus.COMPLETED, 1, 10, undefined, 'Residential Zone', AttendanceStatus.ABSENT),
  makeLesson('les-005', 4, 0, 0, -3,  '11:00', '12:00', LessonStatus.COMPLETED, 5, 10, 'Highway merging practice.', 'Highway Route B', AttendanceStatus.PRESENT),
  makeLesson('les-006', 5, 1, 1, -2,  '13:00', '14:00', LessonStatus.COMPLETED, 4, 8,  'Roundabout mastery.', 'City Circuit', AttendanceStatus.LATE),
  makeLesson('les-007', 6, 2, 2, -1,  '15:30', '16:30', LessonStatus.COMPLETED, 7, 12, 'Night driving simulation.', 'Main Training Ground', AttendanceStatus.PRESENT),
  makeLesson('les-008', 7, 3, 3,  0,  '09:00', '10:00', LessonStatus.SCHEDULED, 2, 10, undefined, 'Residential Zone'),
  makeLesson('les-009', 8, 0, 0,  0,  '11:00', '12:00', LessonStatus.SCHEDULED, 6, 12, 'Advanced maneuvers.', 'Highway Route A'),
  makeLesson('les-010', 9, 1, 1,  0,  '14:00', '15:00', LessonStatus.SCHEDULED, 3, 8,  'Parking drills.', 'City Circuit'),
  makeLesson('les-011', 0, 2, 2,  1,  '09:30', '10:30', LessonStatus.SCHEDULED, 2, 10, undefined, 'Main Training Ground'),
  makeLesson('les-012', 1, 3, 3,  1,  '13:00', '14:00', LessonStatus.SCHEDULED, 3, 8,  'Mirror, signal, manoeuvre.', 'Residential Zone'),
  makeLesson('les-013', 2, 0, 0,  2,  '10:00', '11:00', LessonStatus.SCHEDULED, 4, 12, undefined, 'Highway Route B'),
  makeLesson('les-014', 3, 1, 1,  2,  '15:00', '16:00', LessonStatus.SCHEDULED, 2, 10, 'Reverse parking.', 'City Circuit'),
  makeLesson('les-015', 4, 2, 2,  3,  '08:30', '09:30', LessonStatus.SCHEDULED, 6, 10, undefined, 'Main Training Ground'),
  makeLesson('les-016', 5, 3, 3,  3,  '11:30', '12:30', LessonStatus.RESCHEDULED, 5, 8, 'Originally Mon – moved to Thu.', 'Residential Zone'),
  makeLesson('les-017', 6, 0, 0,  5,  '14:00', '15:00', LessonStatus.SCHEDULED, 8, 12, undefined, 'Highway Route A'),
  makeLesson('les-018', 7, 1, 1,  5,  '09:00', '10:00', LessonStatus.SCHEDULED, 3, 10, 'Emergency braking session.', 'Main Training Ground'),
  makeLesson('les-019', 8, 2, 2,  7,  '16:00', '17:00', LessonStatus.SCHEDULED, 7, 12, undefined, 'City Circuit'),
  makeLesson('les-020', 9, 3, 3,  7,  '10:00', '11:00', LessonStatus.SCHEDULED, 4, 8,  'Pre-test mock drive.', 'Highway Route B'),
];
