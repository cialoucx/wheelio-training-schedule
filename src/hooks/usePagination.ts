import React, { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_ROWS_PER_PAGE = 10;

interface UsePaginationReturn<T> {
  page: number;
  rowsPerPage: number;
  pageItems: T[];
  onPageChange: (event: unknown, nextPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const usePagination = <T,>(items: T[], resetKey: unknown): UsePaginationReturn<T> => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  useEffect(() => {
    setPage(0);
  }, [resetKey]);

  const pageCount = Math.max(1, Math.ceil(items.length / rowsPerPage));
  const safePage = Math.min(page, pageCount - 1);

  const pageItems = useMemo(
    () => items.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage),
    [items, safePage, rowsPerPage],
  );

  const onPageChange = useCallback((_: unknown, nextPage: number) => setPage(nextPage), []);

  const onRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return { page: safePage, rowsPerPage, pageItems, onPageChange, onRowsPerPageChange };
};
