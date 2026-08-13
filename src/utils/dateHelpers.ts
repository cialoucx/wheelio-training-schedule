import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const formatDate = (date: Date): string =>
  dayjs(date).format('ddd, D MMM YYYY');

export const formatDisplayDate = (date: Date): string =>
  dayjs(date).format('D MMM YYYY');

export const formatTime = (time: string): string =>
  dayjs(`2000-01-01 ${time}`).format('h:mm A');

export const formatTimeRange = (start: string, end: string): string =>
  `${formatTime(start)} – ${formatTime(end)}`;

export const formatRelativeDate = (date: Date): string => {
  const today = dayjs().startOf('day');
  const target = dayjs(date).startOf('day');
  const diff = target.diff(today, 'day');

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return formatDate(date);
};

export const isDateInRange = (
  date: Date,
  start: Date | null,
  end: Date | null,
): boolean => {
  const d = dayjs(date).startOf('day');
  if (start && end) return d.isBetween(dayjs(start).startOf('day'), dayjs(end).startOf('day'), 'day', '[]');
  if (start) return !d.isBefore(dayjs(start).startOf('day'), 'day');
  if (end)   return !d.isAfter(dayjs(end).startOf('day'), 'day');
  return true;
};

export const formatDuration = (startTime: string, endTime: string): string => {
  const start = dayjs(`2000-01-01 ${startTime}`);
  const end = dayjs(`2000-01-01 ${endTime}`);
  const mins = end.diff(start, 'minute');
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
};
