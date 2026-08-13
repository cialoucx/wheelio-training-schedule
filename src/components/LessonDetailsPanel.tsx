import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import FiIcon from './FiIcon';
import StatusLabel from './StatusLabel';
import LessonFullRecord from './LessonFullRecord';
import { SectionLabel, SummaryCell } from './DetailList';
import { Lesson } from '../types';
import { formatDuration, formatRelativeDate, formatTimeRange } from '../utils/dateHelpers';
import { initials } from '../utils/text';
import { avatarTone } from '../utils/avatarTone';
import { attendanceStatusOf, courseProgress } from '../utils/lessonRules';
import { ATTENDANCE_STATUS, FONT, ICON, LESSON_STATUS, MOTION } from '../theme';

const TITLE_ID = 'lesson-details-title';
const RING_SIZE = 40;
const RING_THICKNESS = 3;

const CourseProgress: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const label = `Course progress — lesson ${lesson.lessonNumber} of ${lesson.totalLessons}`;
  const target = courseProgress(lesson) * 100;
  const [swept, setSwept] = useState(0);
  
  useEffect(() => {
    const frame = requestAnimationFrame(() => setSwept(target));
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <Tooltip title={label}>
      <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={RING_SIZE}
          thickness={RING_THICKNESS}
          aria-hidden
          sx={{ color: (theme) => alpha(theme.palette.text.primary, 0.14) }}
        />
        <CircularProgress
          variant="determinate"
          value={swept}
          size={RING_SIZE}
          thickness={RING_THICKNESS}
          aria-label={label}
          sx={{
            position: 'absolute',
            left: 0,
            color: 'text.primary',
            circle: {
              strokeLinecap: 'round',
              transition: `stroke-dashoffset ${MOTION.reveal}ms ${MOTION.ease}`,
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: FONT.label, fontWeight: 600, lineHeight: 1 }}>
            {lesson.lessonNumber}/{lesson.totalLessons}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

const NoteBlock: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <Box sx={{ minWidth: 0 }}>
    <SectionLabel icon={icon}>{title}</SectionLabel>
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  </Box>
);

interface LessonDetailsPanelProps {
  lesson: Lesson | null;
  open: boolean;
  onClose: () => void;
}

const LessonDetailsPanel: React.FC<LessonDetailsPanelProps> = ({ lesson, open, onClose }) => {
  const theme = useTheme();
  const [showFullRecord, setShowFullRecord] = useState(false);

  useEffect(() => {
    if (open) setShowFullRecord(false);
  }, [open, lesson?.id]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby={TITLE_ID}
      PaperProps={{ sx: { display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
    >
      {lesson && (
        <>
          <Box
            sx={{
              flexShrink: 0,
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  ...avatarTone(lesson.trainee.name, theme.palette.mode === 'dark'),
                }}
              >
                {initials(lesson.trainee.name)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" id={TITLE_ID} noWrap>
                  {lesson.trainee.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {lesson.trainee.licenseClass}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Close details"
              sx={{ flexShrink: 0 }}
            >
              <FiIcon name="cross" size={ICON.sm} />
            </IconButton>
          </Box>

          <Box
            sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', px: 3, py: 2.5 }}
          >
            <Typography variant="h6" component="p" sx={{ mb: 0.25 }}>
              {formatRelativeDate(lesson.date)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTimeRange(lesson.startTime, lesson.endTime)} ·{' '}
              {formatDuration(lesson.startTime, lesson.endTime)}
            </Typography>

            <Box
              sx={{
                mt: 2.5,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
                columnGap: 2,
                rowGap: 2.5,
              }}
            >
              <SummaryCell label="Status" icon="flag">
                <StatusLabel token={LESSON_STATUS[lesson.status]} variant="chip" />
              </SummaryCell>
              <SummaryCell label="Attendance" icon="user-check">
                <StatusLabel token={ATTENDANCE_STATUS[attendanceStatusOf(lesson)]} variant="text" />
              </SummaryCell>
              <SummaryCell label="Location" icon="marker">
                {lesson.location ?? '—'}
              </SummaryCell>
              <SummaryCell label="Instructor" icon="steering-wheel">
                {lesson.instructor.name}
              </SummaryCell>
              <SummaryCell label="Vehicle" icon="car">
                {`${lesson.vehicle.make} ${lesson.vehicle.model}`}
              </SummaryCell>
              <SummaryCell label="Registration" icon="id-badge">
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                  {lesson.vehicle.registrationNumber}
                </Typography>
              </SummaryCell>
            </Box>

            {/* The soft context — one metric and two pieces of prose — kept together
                on the same three-column rhythm as the summary grid above. */}
            <Box
              sx={{
                mt: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                columnGap: 2,
                rowGap: 2.5,
                alignItems: 'start',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <SectionLabel icon="road">Course progress</SectionLabel>
                <CourseProgress lesson={lesson} />
              </Box>

              {lesson.notes && (
                <NoteBlock title="Lesson notes" icon="document">
                  {lesson.notes}
                </NoteBlock>
              )}

              {lesson.attendance?.comments && (
                <NoteBlock title="Attendance notes" icon="comment">
                  {lesson.attendance.comments}
                </NoteBlock>
              )}
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Button
              fullWidth
              onClick={() => setShowFullRecord((shown) => !shown)}
              endIcon={<FiIcon name={showFullRecord ? 'angle-up' : 'angle-down'} size={ICON.sm} />}
              sx={{ justifyContent: 'space-between', color: 'text.secondary', px: 0 }}
            >
              {showFullRecord ? 'Hide full record' : 'Full record'}
            </Button>

            <Collapse in={showFullRecord} unmountOnExit>
              <LessonFullRecord lesson={lesson} />
            </Collapse>
          </Box>
        </>
      )}
    </Dialog>
  );
};

export default LessonDetailsPanel;
