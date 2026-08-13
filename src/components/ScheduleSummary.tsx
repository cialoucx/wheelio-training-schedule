import React from 'react';
import { Box, Paper, Skeleton, Typography, alpha, useTheme } from '@mui/material';

import FiIcon from './FiIcon';
import { LessonSummary } from '../utils/lessonSummary';
import { ICON, MOTION, RADIUS, Ramp, ramp } from '../theme';

interface StatDef {
  key: keyof LessonSummary;
  label: string;
  icon: string;
  hint: string;

  tone: (c: Ramp) => string;
}

const STATS: StatDef[] = [
  {
    key: 'total',
    label: 'Lessons',
    icon: 'calendar',
    hint: 'In the current view',
    tone: (c) => c.info,
  },
  {
    key: 'upcoming',
    label: 'Upcoming',
    icon: 'clock',
    hint: 'Scheduled or rescheduled',
    tone: (c) => c.accent,
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: 'check',
    hint: 'Lesson has taken place',
    tone: (c) => c.success,
  },
  {
    key: 'pendingAttendance',
    label: 'Pending attendance',
    icon: 'edit',
    hint: 'Not yet marked',
    tone: (c) => c.warning,
  },
];

interface ScheduleSummaryProps {
  summary: LessonSummary;
  isLoading: boolean;
}

const ScheduleSummary: React.FC<ScheduleSummaryProps> = React.memo(({ summary, isLoading }) => {
  const theme = useTheme();
  const palette = ramp(theme.palette.mode === 'dark');

  return (
    <Box
      sx={{
        flexShrink: 0,
        mb: 2,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 1,
      }}
    >
      {STATS.map((stat, index) => {
        const tone = stat.tone(palette);

        return (
          <Paper
            key={stat.key}
            variant="outlined"
            sx={{
              px: 1.75,
              py: 1.5,
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              
              animation: `riseIn ${MOTION.base}ms ${MOTION.ease} both`,
              animationDelay: `${index * 40}ms`,
              transition: `border-color ${MOTION.fast}ms ${MOTION.ease}`,
              '&:hover': { borderColor: 'text.disabled' },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 38,
                height: 38,
                borderRadius: `${RADIUS.md}px`,
                display: 'grid',
                placeItems: 'center',
                color: tone,
                backgroundColor: alpha(tone, 0.12),
              }}
            >
              <FiIcon name={stat.icon} variant="rr" size={ICON.md} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" color="text.secondary" noWrap display="block">
                {stat.label}
              </Typography>

              {isLoading ? (
                <Skeleton animation="wave" width={28} height={24} />
              ) : (
                <Typography variant="h6" component="p" sx={{ lineHeight: 1.25 }}>
                  {summary[stat.key]}
                </Typography>
              )}

              <Typography variant="caption" color="text.disabled" noWrap display="block">
                {stat.hint}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
});

ScheduleSummary.displayName = 'ScheduleSummary';
export default ScheduleSummary;
