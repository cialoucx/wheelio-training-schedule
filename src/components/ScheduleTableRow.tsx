import React, { useCallback } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import FiIcon from './FiIcon';
import StatusLabel from './StatusLabel';
import { Lesson } from '../types';
import { formatDisplayDate, formatTimeRange } from '../utils/dateHelpers';
import { initials } from '../utils/text';
import { avatarTone } from '../utils/avatarTone';
import { attendanceStatusOf, canMarkAttendance, hasAttendance } from '../utils/lessonRules';
import { ATTENDANCE_STATUS, ICON, LESSON_STATUS } from '../theme';

const CANCELLED_HINT = 'This lesson was cancelled — there is no attendance to record';

interface ScheduleTableRowProps {
  lesson: Lesson;
  onViewDetails: (lesson: Lesson) => void;
  onMarkAttendance: (lesson: Lesson) => void;
}

const ScheduleTableRow: React.FC<ScheduleTableRowProps> = React.memo(
  ({ lesson, onViewDetails, onMarkAttendance }) => {
    const theme = useTheme();
    const tone = avatarTone(lesson.trainee.name, theme.palette.mode === 'dark');
    const canMark = canMarkAttendance(lesson);
    const isMarked = hasAttendance(lesson);
    const actionLabel = isMarked ? 'Edit' : 'Mark';

    const handleView = useCallback(() => onViewDetails(lesson), [lesson, onViewDetails]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onViewDetails(lesson);
        }
      },
      [lesson, onViewDetails],
    );

    return (
      <TableRow
        hover
        tabIndex={0}
        onClick={handleView}
        onKeyDown={handleKeyDown}
        aria-label={`Lesson details for ${lesson.trainee.name}`}
        sx={{
          cursor: 'pointer',
          '&:last-child td': { borderBottom: 0 },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'text.primary',
            outlineOffset: '-2px',
          },
        }}
      >
        <TableCell sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar sx={{ width: 26, height: 26, ...tone }}>
              {initials(lesson.trainee.name)}
            </Avatar>
            <Typography variant="body2" fontWeight={600} noWrap>
              {lesson.trainee.name}
            </Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ py: 1 }}>
          <Typography variant="body2" noWrap>
            {formatDisplayDate(lesson.date)}
          </Typography>
        </TableCell>

        <TableCell sx={{ py: 1 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {formatTimeRange(lesson.startTime, lesson.endTime)}
          </Typography>
        </TableCell>

        <TableCell sx={{ py: 1 }}>
          <Typography variant="body2" noWrap>
            {lesson.instructor.name}
          </Typography>
        </TableCell>

        <TableCell sx={{ py: 1 }}>
          <Typography variant="body2" noWrap>
            {lesson.vehicle.make} {lesson.vehicle.model}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {lesson.vehicle.registrationNumber}
          </Typography>
        </TableCell>

        <TableCell sx={{ py: 1 }}>
          <StatusLabel token={LESSON_STATUS[lesson.status]} variant="chip" />
        </TableCell>

        <TableCell sx={{ py: 1 }}>
          <StatusLabel token={ATTENDANCE_STATUS[attendanceStatusOf(lesson)]} variant="text" />
        </TableCell>

        <TableCell align="right" sx={{ py: 1 }} onClick={(e) => e.stopPropagation()}>
          {/* Wrapped in a span so the tooltip still fires while the button is disabled. */}
          <Tooltip title={canMark ? `${actionLabel} attendance` : CANCELLED_HINT}>
            <span>
              <IconButton
                size="small"
                disabled={!canMark}
                onClick={() => onMarkAttendance(lesson)}
                aria-label={`${actionLabel} attendance for ${lesson.trainee.name}`}
              >
                <FiIcon name="pencil" variant="rr" size={ICON.md} />
              </IconButton>
            </span>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  },
);

ScheduleTableRow.displayName = 'ScheduleTableRow';
export default ScheduleTableRow;
