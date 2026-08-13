import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import TrainingScheduleList from './components/TrainingScheduleList';
import { buildTheme } from './theme';

type ColorMode = 'light' | 'dark';

const STORAGE_KEY = 'wheelio.colorMode';

const initialColorMode = (): ColorMode => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const App: React.FC = () => {
  const [colorMode, setColorMode] = useState<ColorMode>(initialColorMode);
  const theme = useMemo(() => buildTheme(colorMode), [colorMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, colorMode);
  }, [colorMode]);

  const toggleColorMode = useCallback(
    () => setColorMode((m) => (m === 'light' ? 'dark' : 'light')),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TrainingScheduleList colorMode={colorMode} onToggleColorMode={toggleColorMode} />
    </ThemeProvider>
  );
};

export default App;
