import { describe, expect, it } from 'vitest';

import { MAX_COMMENTS_LENGTH, getFieldError, validateAttendanceForm } from './validation';
import { AttendanceForm, AttendanceStatus } from '../types';

const form = (overrides: Partial<AttendanceForm> = {}): AttendanceForm => ({
  lessonId: 'les-001',
  status: AttendanceStatus.PRESENT,
  comments: '',
  ...overrides,
});

describe('validateAttendanceForm', () => {
  it('accepts a valid form', () => {
    expect(validateAttendanceForm(form())).toEqual([]);
  });

  it('requires a status, with the exact wording the UI shows', () => {
    const errors = validateAttendanceForm(form({ status: '' }));

    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('status');
    expect(errors[0].message).toBe('Please select an attendance status.');
  });

  it('rejects a status outside the enum', () => {
    const errors = validateAttendanceForm(form({ status: 'MAYBE' as AttendanceStatus }));

    expect(getFieldError(errors, 'status')).toBe('Invalid attendance status value.');
  });

  it('accepts every real attendance status', () => {
    for (const status of Object.values(AttendanceStatus)) {
      expect(validateAttendanceForm(form({ status }))).toEqual([]);
    }
  });

  it('treats comments as optional', () => {
    expect(validateAttendanceForm(form({ comments: '' }))).toEqual([]);
  });

  it('allows comments of exactly the maximum length', () => {
    const comments = 'x'.repeat(MAX_COMMENTS_LENGTH);

    expect(validateAttendanceForm(form({ comments }))).toEqual([]);
  });

  it('rejects comments one character over the maximum', () => {
    const comments = 'x'.repeat(MAX_COMMENTS_LENGTH + 1);

    expect(getFieldError(validateAttendanceForm(form({ comments })), 'comments')).toContain(
      `must not exceed ${MAX_COMMENTS_LENGTH}`,
    );
  });

  it('reports status and comment problems together', () => {
    const errors = validateAttendanceForm(
      form({ status: '', comments: 'x'.repeat(MAX_COMMENTS_LENGTH + 1) }),
    );

    expect(errors).toHaveLength(2);
  });
});

describe('getFieldError', () => {
  it('returns undefined when the field has no error', () => {
    expect(getFieldError([], 'status')).toBeUndefined();
  });
});
