import { useCallback, useState } from 'react';
import { SnackbarMessage } from '../types';

interface UseSnackbarReturn {
  snackbar: SnackbarMessage | null;
  showSnackbar: (message: SnackbarMessage) => void;
  dismissSnackbar: () => void;
}

export const useSnackbar = (): UseSnackbarReturn => {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const showSnackbar = useCallback((message: SnackbarMessage) => setSnackbar(message), []);
  const dismissSnackbar = useCallback(() => setSnackbar(null), []);

  return { snackbar, showSnackbar, dismissSnackbar };
};
