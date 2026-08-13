import React from 'react';
import { Box, Typography } from '@mui/material';
import { AttendanceStatus } from '../types';
import { ATTENDANCE_OPTIONS, RADIUS } from '../theme';

interface AttendanceStatusPickerProps {
  value: AttendanceStatus | '';
  onChange: (value: AttendanceStatus) => void;
}

const AttendanceStatusPicker: React.FC<AttendanceStatusPickerProps> = ({ value, onChange }) => (
  <Box sx={{ display: 'flex', gap: 1 }} role="radiogroup" aria-label="Attendance status">
    {ATTENDANCE_OPTIONS.map((option) => {
      const selected = value === option.value;

      return (
        <Box
          key={option.value}
          role="radio"
          tabIndex={0}
          aria-checked={selected}
          onClick={() => onChange(option.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onChange(option.value);
            }
          }}
          sx={{
            flex: 1,
            py: 1.25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.75,
            cursor: 'pointer',
            borderRadius: `${RADIUS.md}px`,
            border: '1px solid',
            borderColor: selected ? 'text.primary' : 'divider',
            backgroundColor: selected ? 'action.selected' : 'transparent',
            transition: 'border-color 0.15s, background-color 0.15s',
            '&:hover': { borderColor: 'text.secondary' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'text.primary' },
          }}
        >
          {/* The label carries the colour, matching how attendance reads everywhere else. */}
          <Typography
            variant="body2"
            fontWeight={600}
            color={option.color}
            sx={{ opacity: selected ? 1 : 0.6, transition: 'opacity 0.15s' }}
          >
            {option.label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

export default AttendanceStatusPicker;
