import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import FiIcon from './FiIcon';
import AttendanceStatusPicker from './AttendanceStatusPicker';
import { AttendanceForm, AttendanceStatus, Lesson, ValidationError } from '../types';
import { formatDate, formatTimeRange } from '../utils/dateHelpers';
import { initials } from '../utils/text';
import { avatarTone } from '../utils/avatarTone';
import { getFieldError, MAX_COMMENTS_LENGTH, validateAttendanceForm } from '../utils/validation';
import { ICON } from '../theme';

const COMMENT_WARN_AT = 60;

const EMPTY_FORM: AttendanceForm = { lessonId: '', status: '', comments: '' };

interface AttendanceModalProps {
  lesson: Lesson | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (form: AttendanceForm) => Promise<void>;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ lesson, open, onClose, onSubmit }) => {
  const theme = useTheme();
  const [form, setForm] = useState<AttendanceForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!lesson) return;

    setForm({
      lessonId: lesson.id,
      status: lesson.attendance?.status ?? '',
      comments: lesson.attendance?.comments ?? '',
    });
    setErrors([]);
    setSubmitError(null);
  }, [lesson]);

  const handleStatusChange = useCallback((status: AttendanceStatus) => {
    setForm((prev) => ({ ...prev, status }));
    setErrors((prev) => prev.filter((error) => error.field !== 'status'));
  }, []);

  const handleCommentsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const comments = event.target.value;
    const tooLong = comments.length > MAX_COMMENTS_LENGTH;

    setForm((prev) => ({ ...prev, comments }));
    setErrors((prev) => [
      ...prev.filter((error) => error.field !== 'comments'),
      ...(tooLong ? [{ field: 'comments', message: `Max ${MAX_COMMENTS_LENGTH} characters` }] : []),
    ]);
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateAttendanceForm(form);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(form);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }, [form, onSubmit]);

  const handleClose = useCallback(() => {
    if (!submitting) onClose();
  }, [submitting, onClose]);

  if (!lesson) return null;

  const statusError = getFieldError(errors, 'status');
  const commentsError = getFieldError(errors, 'comments');
  const charactersLeft = MAX_COMMENTS_LENGTH - form.comments.length;
  const isEditing = !!lesson.attendance;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      {submitting && (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
      )}

      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1">
            {isEditing ? 'Edit attendance' : 'Mark attendance'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(lesson.date)} · {formatTimeRange(lesson.startTime, lesson.endTime)}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} disabled={submitting} aria-label="Close">
          <FiIcon name="cross" size={ICON.sm} />
        </IconButton>
      </Box>

      <Box sx={{ px: 2.5, py: 2.5, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              ...avatarTone(lesson.trainee.name, theme.palette.mode === 'dark'),
            }}
          >
            {initials(lesson.trainee.name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {lesson.trainee.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap display="block">
              Lesson {lesson.lessonNumber} of {lesson.totalLessons}
            </Typography>
          </Box>
        </Box>

        <TextField
          label="Instructor"
          value={lesson.instructor.name}
          fullWidth
          InputProps={{ readOnly: true }}
          sx={{ mb: 3 }}
        />

        <FormControl error={!!statusError} sx={{ width: '100%', mb: 3 }}>
          <FormLabel sx={{ mb: 1.25, fontWeight: 600, '&.Mui-focused': { color: 'text.primary' } }}>
            <Typography variant="body2" component="span" fontWeight={600}>
              Attendance
            </Typography>
          </FormLabel>

          <AttendanceStatusPicker value={form.status} onChange={handleStatusChange} />

          {statusError && <FormHelperText sx={{ mt: 0.75 }}>{statusError}</FormHelperText>}
        </FormControl>

        <TextField
          label="Comments"
          multiline
          rows={4}
          fullWidth
          value={form.comments}
          onChange={handleCommentsChange}
          error={!!commentsError}
          helperText={
            commentsError ??
            (charactersLeft <= COMMENT_WARN_AT ? `${charactersLeft} characters left` : ' ')
          }
          placeholder="Optional — anything worth noting about this lesson"
          inputProps={{ maxLength: MAX_COMMENTS_LENGTH + 10 }}
        />

        {submitError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {submitError}
          </Alert>
        )}
      </Box>

      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button onClick={handleClose} disabled={submitting} variant="outlined">
          Cancel
        </Button>
        {/* Stays enabled with no status selected: pressing Save is what raises the validation message. */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={ICON.sm} color="inherit" /> : undefined}
        >
          {submitting ? 'Saving…' : 'Save'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AttendanceModal;
