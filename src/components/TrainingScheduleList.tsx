import React, { useCallback, useMemo } from 'react';
import { Alert, Box, Button, Snackbar, Typography, useTheme } from '@mui/material';

import FiIcon from './FiIcon';
import AppHeader from './AppHeader';
import FilterPanel from './FilterPanel';
import ScheduleTable from './ScheduleTable';
import ScheduleSummary from './ScheduleSummary';
import AttendanceModal from './AttendanceModal';
import LessonDetailsPanel from './LessonDetailsPanel';
import { useFilters } from '../hooks/useFilters';
import { useTrainingSchedule } from '../hooks/useTrainingSchedule';
import { usePagination } from '../hooks/usePagination';
import { useLessonDialogs } from '../hooks/useLessonDialogs';
import { useSnackbar } from '../hooks/useSnackbar';
import { summariseLessons } from '../utils/lessonSummary';
import { AttendanceForm } from '../types';
import { CONTENT_MAX_W, ICON, ramp } from '../theme';

interface TrainingScheduleListProps {
  colorMode?: 'light' | 'dark';
  onToggleColorMode?: () => void;
}

const TrainingScheduleList: React.FC<TrainingScheduleListProps> = ({
  colorMode = 'light',
  onToggleColorMode,
}) => {
  const theme = useTheme();
  const palette = ramp(theme.palette.mode === 'dark');

  const {
    filters,
    activeFilterCount,
    setDateRange,
    setInstructor,
    setStatus,
    setSearchTerm,
    resetFilters,
  } = useFilters();

  const {
    lessons,
    instructors,
    status,
    sortConfig,
    filteredCount,
    setSortConfig,
    submitAttendance,
    retryLoad,
  } = useTrainingSchedule(filters);

  const { page, rowsPerPage, pageItems, onPageChange, onRowsPerPageChange } = usePagination(
    lessons,
    filters,
  );

  const {
    selectedLesson,
    attendanceTarget,
    openDetails,
    closeDetails,
    openAttendance,
    closeAttendance,
  } = useLessonDialogs();

  const { snackbar, showSnackbar, dismissSnackbar } = useSnackbar();

  const handleAttendanceSubmit = useCallback(
    async (form: AttendanceForm) => {
      // Read before submitting — the target is cleared as soon as the dialog closes.
      const wasEditing = !!attendanceTarget?.attendance;

      await submitAttendance(form);
      closeAttendance();
      showSnackbar({
        message: wasEditing ? 'Attendance updated.' : 'Attendance recorded successfully.',
        severity: 'success',
      });
    },
    [attendanceTarget, submitAttendance, closeAttendance, showSnackbar],
  );

  // Derived from the filtered set, so the summary always describes the same
  // lessons the table is showing rather than a total that contradicts it.
  const summary = useMemo(() => summariseLessons(lessons), [lessons]);

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isEmpty = status === 'empty';

  return (
    <Box
      sx={{
        height: '100vh',
        '@supports (height: 100dvh)': { height: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      <AppHeader
        colorMode={colorMode}
        isRefreshing={isLoading}
        onRefresh={retryLoad}
        onToggleColorMode={onToggleColorMode}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: CONTENT_MAX_W,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          pt: 2,
        }}
      >
        {isError && (
          <Box
            role="alert"
            sx={{
              flexShrink: 0,
              mb: 2,
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              border: '1px solid',
              borderColor: 'error.main',
              borderRadius: 1,
              backgroundColor: palette.errorSurface,
            }}
          >
            <FiIcon name="exclamation" size={ICON.md} color={palette.error} />
            <Typography variant="body2" sx={{ flex: 1, minWidth: 180 }}>
              Couldn&rsquo;t load the schedule.
            </Typography>
            <Button size="small" variant="outlined" onClick={retryLoad}>
              Try again
            </Button>
          </Box>
        )}

        {!isError && <ScheduleSummary summary={summary} isLoading={isLoading} />}

        <FilterPanel
          filters={filters}
          instructors={instructors}
          activeFilterCount={activeFilterCount}
          onDateRangeChange={setDateRange}
          onInstructorChange={setInstructor}
          onStatusChange={setStatus}
          onSearchChange={setSearchTerm}
          onReset={resetFilters}
        />

        {/* Nothing loaded, so there is no table to head and nothing to paginate. */}
        {!isError && (
          <ScheduleTable
            lessons={pageItems}
            isLoading={isLoading}
            isEmpty={isEmpty}
            hasFilters={activeFilterCount > 0}
            sortConfig={sortConfig}
            page={page}
            rowsPerPage={rowsPerPage}
            rowCount={filteredCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            onSortChange={setSortConfig}
            onViewDetails={openDetails}
            onMarkAttendance={openAttendance}
            onResetFilters={resetFilters}
          />
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box
          component="footer"
          sx={{ flexShrink: 0, py: 1.25, display: 'flex', justifyContent: 'space-between', gap: 2 }}
        >
          <Typography variant="caption" color="text.disabled">
            Wheelio Training Systems
          </Typography>
          <Typography variant="caption" color="text.disabled" noWrap>
            Icons by{' '}
            <Box
              component="a"
              href="https://www.flaticon.com/uicons"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'inherit' }}
            >
              Flaticon UIcons
            </Box>
          </Typography>
        </Box>
      </Box>

      <AttendanceModal
        lesson={attendanceTarget}
        open={!!attendanceTarget}
        onClose={closeAttendance}
        onSubmit={handleAttendanceSubmit}
      />

      <LessonDetailsPanel
        lesson={selectedLesson}
        open={!!selectedLesson}
        onClose={closeDetails}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={dismissSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snackbar ? (
          <Alert onClose={dismissSnackbar} severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default TrainingScheduleList;
