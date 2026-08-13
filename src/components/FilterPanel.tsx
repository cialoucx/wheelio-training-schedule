import React, { useCallback, useState } from 'react';
import {
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
  Box,
  Collapse,
  useMediaQuery,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import FiIcon from './FiIcon';
import { ScheduleFilters, LessonStatus, Instructor } from '../types';
import { ICON, LESSON_STATUS_OPTIONS } from '../theme';

interface FilterPanelProps {
  filters: ScheduleFilters;
  instructors: Instructor[];
  activeFilterCount: number;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  onInstructorChange: (id: string | null) => void;
  onStatusChange: (status: LessonStatus | null) => void;
  onSearchChange: (term: string) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = React.memo(
  ({
    filters,
    instructors,
    activeFilterCount,
    onDateRangeChange,
    onInstructorChange,
    onStatusChange,
    onSearchChange,
    onReset,
  }) => {
    // noSsr evaluates on the first render instead of after mount, so a phone
    // never paints the six-row desktop toolbar before collapsing it.
    const isCompact = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'), {
      noSsr: true,
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleStartDateChange = useCallback(
      (val: Dayjs | null) => onDateRangeChange(val ? val.toDate() : null, filters.dateRange.end),
      [filters.dateRange.end, onDateRangeChange],
    );

    const handleEndDateChange = useCallback(
      (val: Dayjs | null) => onDateRangeChange(filters.dateRange.start, val ? val.toDate() : null),
      [filters.dateRange.start, onDateRangeChange],
    );

    const { start, end } = filters.dateRange;
    const showingToday =
      !!start && !!end && dayjs(start).isSame(dayjs(), 'day') && dayjs(end).isSame(dayjs(), 'day');

    // Today is a shortcut into the existing date range, not a filter of its own —
    // so Reset clears it and the active-filter count already accounts for it.
    const handleToday = useCallback(() => {
      if (showingToday) {
        onDateRangeChange(null, null);
        return;
      }
      const today = dayjs().startOf('day').toDate();
      onDateRangeChange(today, today);
    }, [showingToday, onDateRangeChange]);

    const search = (
      <TextField
        label="Trainee name"
        fullWidth
        value={filters.searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FiIcon name="search" variant="rr" size={ICON.sm} />
            </InputAdornment>
          ),
          endAdornment: filters.searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <FiIcon name="cross" size={ICON.sm} />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    );

    const controls = (
      <>
        <TextField
          label="Instructor"
          select
          fullWidth
          value={filters.instructorId ?? ''}
          onChange={(e) => onInstructorChange(e.target.value || null)}
        >
          <MenuItem value="">All instructors</MenuItem>
          {instructors.map((ins) => (
            <MenuItem key={ins.id} value={ins.id}>
              {ins.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Status"
          select
          fullWidth
          value={filters.status ?? ''}
          onChange={(e) => onStatusChange((e.target.value as LessonStatus) || null)}
        >
          <MenuItem value="">All statuses</MenuItem>
          {LESSON_STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="From"
          value={filters.dateRange.start ? dayjs(filters.dateRange.start) : null}
          onChange={handleStartDateChange}
          maxDate={filters.dateRange.end ? dayjs(filters.dateRange.end) : undefined}
          slots={{ openPickerIcon: () => <FiIcon name="calendar" size={ICON.sm} /> }}
          slotProps={{ textField: { fullWidth: true }, field: { clearable: true } }}
        />

        <DatePicker
          label="To"
          value={filters.dateRange.end ? dayjs(filters.dateRange.end) : null}
          onChange={handleEndDateChange}
          minDate={filters.dateRange.start ? dayjs(filters.dateRange.start) : undefined}
          slots={{ openPickerIcon: () => <FiIcon name="calendar" size={ICON.sm} /> }}
          slotProps={{ textField: { fullWidth: true }, field: { clearable: true } }}
        />

        <Button
          variant={showingToday ? 'contained' : 'outlined'}
          onClick={handleToday}
          aria-pressed={showingToday}
          sx={{ justifySelf: 'stretch', whiteSpace: 'nowrap' }}
        >
          Today
        </Button>

        <Button
          variant="outlined"
          onClick={onReset}
          disabled={activeFilterCount === 0}
          startIcon={<FiIcon name="cross" size={ICON.sm} />}
          sx={{ justifySelf: { xs: 'stretch', md: 'end' }, whiteSpace: 'nowrap' }}
        >
          Clear filters
        </Button>
      </>
    );

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper variant="outlined" sx={{ flexShrink: 0, p: 1.25, mb: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr auto',
                sm: '1fr 1fr',
                md: '1.6fr 1.2fr 1fr 1fr 1fr auto auto',
              },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {search}

            {isCompact ? (
              <Button
                variant="outlined"
                onClick={() => setShowFilters((shown) => !shown)}
                aria-expanded={showFilters}
                endIcon={
                  <FiIcon name={showFilters ? 'angle-up' : 'angle-down'} size={ICON.sm} />
                }
                sx={{ whiteSpace: 'nowrap' }}
              >
                {activeFilterCount > 0 ? `Filters · ${activeFilterCount}` : 'Filters'}
              </Button>
            ) : (
              controls
            )}
          </Box>

          {isCompact && (
            <Collapse in={showFilters}>
              <Box sx={{ display: 'grid', gap: 1, pt: 1 }}>{controls}</Box>
            </Collapse>
          )}
        </Paper>
      </LocalizationProvider>
    );
  },
);

FilterPanel.displayName = 'FilterPanel';
export default FilterPanel;
