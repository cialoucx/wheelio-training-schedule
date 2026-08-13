import { AttendanceForm, ValidationError, AttendanceStatus } from '../types';

export const MAX_COMMENTS_LENGTH = 500;

export const validateAttendanceForm = (data: AttendanceForm): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.status || (data.status as string) === '') {
    errors.push({
      field: 'status',
      message: 'Please select an attendance status.',
    });
  }

  if (
    data.status &&
    (data.status as string) !== '' &&
    !Object.values(AttendanceStatus).includes(data.status as AttendanceStatus)
  ) {
    errors.push({
      field: 'status',
      message: 'Invalid attendance status value.',
    });
  }

  if (data.comments && data.comments.length > MAX_COMMENTS_LENGTH) {
    errors.push({
      field: 'comments',
      message: `Comments must not exceed ${MAX_COMMENTS_LENGTH} characters (currently ${data.comments.length}).`,
    });
  }

  return errors;
};

export const getFieldError = (
  errors: ValidationError[],
  field: string,
): string | undefined => errors.find((e) => e.field === field)?.message;
