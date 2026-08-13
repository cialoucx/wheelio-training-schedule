import { SortableColumn } from '../types';

export type { SortableColumn };

export interface ColumnDef {
  key: string;
  label: string;
  sortKey?: SortableColumn;
  width?: number;
  align?: 'left' | 'right';
}

export const SCHEDULE_COLUMNS: ColumnDef[] = [
  { key: 'trainee', label: 'Trainee', sortKey: 'traineeName', width: 200 },
  { key: 'date', label: 'Lesson date', sortKey: 'date', width: 130 },
  { key: 'time', label: 'Lesson time', width: 150 },
  { key: 'instructor', label: 'Instructor', sortKey: 'instructorName', width: 150 },
  { key: 'vehicle', label: 'Vehicle', width: 150 },
  { key: 'status', label: 'Status', sortKey: 'status', width: 130 },
  { key: 'attendance', label: 'Attendance', width: 130 },
  { key: 'actions', label: '', width: 72, align: 'right' },
];
