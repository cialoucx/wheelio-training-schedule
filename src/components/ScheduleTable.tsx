import React, { useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';

import FiIcon from './FiIcon';
import ScheduleTableRow from './ScheduleTableRow';
import { ColumnDef, SCHEDULE_COLUMNS, SortableColumn } from './scheduleColumns';
import { Lesson, SortConfig } from '../types';
import { ICON } from '../theme';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const TableSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {SCHEDULE_COLUMNS.map((col, colIndex) => (
          <TableCell key={col.key} sx={{ py: 1.25 }}>
            {col.key !== 'actions' && (
              <Skeleton animation="wave" height={16} width={colIndex === 0 ? '75%' : '60%'} />
            )}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const EmptyState: React.FC<{ hasFilters: boolean; onReset: () => void }> = ({
  hasFilters,
  onReset,
}) => (
  <Box sx={{ py: 9, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
    <Box sx={{ color: 'text.disabled', display: 'flex', mb: 0.5 }}>
      <FiIcon name="calendar" variant="rr" size={ICON.xl} />
    </Box>
    <Typography variant="subtitle1">
      {hasFilters ? 'No lessons match these filters' : 'No lessons scheduled'}
    </Typography>
    <Typography variant="caption" color="text.secondary" align="center" maxWidth={320}>
      {hasFilters
        ? 'Try widening the date range, or clear the filters to see the full schedule.'
        : 'Lessons will appear here once they are booked.'}
    </Typography>
    {hasFilters && (
      <Button variant="outlined" size="small" onClick={onReset} sx={{ mt: 1.5 }}>
        Clear filters
      </Button>
    )}
  </Box>
);

const HeaderCell: React.FC<{
  column: ColumnDef;
  sortConfig: SortConfig;
  onSort: (key: SortableColumn) => void;
}> = ({ column, sortConfig, onSort }) => {
  const isActive = sortConfig.column === column.sortKey;

  return (
    <TableCell
      align={column.align ?? 'left'}
      sx={{ width: column.width, minWidth: column.width }}
    >
      {column.sortKey ? (
        <TableSortLabel
          active={isActive}
          direction={isActive ? sortConfig.direction : 'asc'}
          onClick={() => onSort(column.sortKey as SortableColumn)}
        >
          {column.label}
        </TableSortLabel>
      ) : (
        column.label
      )}
    </TableCell>
  );
};

interface ScheduleTableProps {
  lessons: Lesson[];
  isLoading: boolean;
  isEmpty: boolean;
  hasFilters: boolean;
  sortConfig: SortConfig;
  page: number;
  rowsPerPage: number;
  rowCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (config: SortConfig) => void;
  onViewDetails: (lesson: Lesson) => void;
  onMarkAttendance: (lesson: Lesson) => void;
  onResetFilters: () => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = React.memo(
  ({
    lessons,
    isLoading,
    isEmpty,
    hasFilters,
    sortConfig,
    page,
    rowsPerPage,
    rowCount,
    onPageChange,
    onRowsPerPageChange,
    onSortChange,
    onViewDetails,
    onMarkAttendance,
    onResetFilters,
  }) => {
    const lastRowCount = useRef(rowsPerPage);

    useEffect(() => {
      if (!isLoading && lessons.length > 0) lastRowCount.current = lessons.length;
    }, [isLoading, lessons.length]);

    const handleSort = useCallback(
      (sortKey: SortableColumn) => {
        const isAscending = sortConfig.column === sortKey && sortConfig.direction === 'asc';
        onSortChange({ column: sortKey, direction: isAscending ? 'desc' : 'asc' });
      },
      [sortConfig, onSortChange],
    );

    return (
      <Paper
        variant="outlined"
        sx={{
          flex: '0 1 auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TableContainer sx={{ flex: '0 1 auto', minHeight: 0, overflowY: 'auto' }}>
          <Table stickyHeader size="small" aria-label="Training schedule">
            <TableHead>
              <TableRow>
                {SCHEDULE_COLUMNS.map((column) => (
                  <HeaderCell
                    key={column.key}
                    column={column}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading && <TableSkeleton rows={Math.min(rowsPerPage, lastRowCount.current)} />}

              {!isLoading && isEmpty && (
                <TableRow>
                  <TableCell colSpan={SCHEDULE_COLUMNS.length} sx={{ border: 0, p: 0 }}>
                    <EmptyState hasFilters={hasFilters} onReset={onResetFilters} />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isEmpty &&
                lessons.map((lesson) => (
                  <ScheduleTableRow
                    key={lesson.id}
                    lesson={lesson}
                    onViewDetails={onViewDetails}
                    onMarkAttendance={onMarkAttendance}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!isEmpty && !isLoading && (
          <TablePagination
            component="div"
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            count={rowCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage="Rows"
          />
        )}
      </Paper>
    );
  },
);

ScheduleTable.displayName = 'ScheduleTable';
export default ScheduleTable;
