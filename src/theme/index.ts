import { createTheme, Theme } from '@mui/material/styles';
import { FONT, MOTION, RADIUS, CONTROL_H, ramp } from './tokens';

export * from './tokens';
export * from './status';

export const buildTheme = (mode: 'light' | 'dark'): Theme => {
  const isDark = mode === 'dark';
  const c = ramp(isDark);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#fafafa' : '#18181b',
        contrastText: isDark ? '#09090b' : '#ffffff',
      },
      secondary: { main: c.textSecondary },
      success: { main: c.success },
      error: { main: c.error },
      warning: { main: c.warning },
      info: { main: c.info },
      background: { default: c.bg, paper: c.paper },
      text: {
        primary: c.text,
        secondary: c.textSecondary,
        disabled: c.textDisabled,
      },
      divider: c.border,
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        selected: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.06)',
      },
    },

    shape: { borderRadius: RADIUS.md },

    typography: {
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      h6:        { fontSize: FONT.title,   fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
      subtitle1: { fontSize: FONT.heading, fontWeight: 600, lineHeight: 1.35 },
      subtitle2: { fontSize: FONT.body,    fontWeight: 600, lineHeight: 1.4 },
      body1:     { fontSize: FONT.body,    lineHeight: 1.5 },
      body2:     { fontSize: FONT.body,    lineHeight: 1.5 },
      caption:   { fontSize: FONT.meta,    lineHeight: 1.45 },
      overline:  {
        fontSize: FONT.label,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
      },
      button: { fontSize: FONT.body, fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Anyone who has asked their OS to reduce motion gets none of it. This
          // is a single global opt-out rather than a guard repeated per component.
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
              scrollBehavior: 'auto !important',
            },
          },
          '@keyframes riseIn': {
            from: { opacity: 0, transform: 'translateY(6px)' },
            to: { opacity: 1, transform: 'none' },
          },
          body: { backgroundColor: c.bg, color: c.text },
          '*::-webkit-scrollbar': { width: 10, height: 10 },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: c.border,
            borderRadius: 99,
            border: `3px solid ${c.bg}`,
          },
          '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: { borderColor: c.border },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            minHeight: CONTROL_H,
            paddingInline: 14,
            transition: `background-color ${MOTION.fast}ms ${MOTION.ease}, border-color ${MOTION.fast}ms ${MOTION.ease}, color ${MOTION.fast}ms ${MOTION.ease}`,
          },
          sizeSmall: { minHeight: 30, paddingInline: 10, fontSize: FONT.meta },
          outlined: {
            borderColor: c.border,
            color: c.text,
            '&:hover': { borderColor: c.borderStrong, backgroundColor: c.subtle },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: RADIUS.md,
            color: c.textSecondary,
            transition: `background-color ${MOTION.fast}ms ${MOTION.ease}, color ${MOTION.fast}ms ${MOTION.ease}`,
            '&:hover': { color: c.text, backgroundColor: c.subtle },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: RADIUS.sm, height: 22, fontSize: FONT.meta, fontWeight: 500 },
          outlined: { borderColor: c.border },
        },
      },

      MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontSize: FONT.body,
            backgroundColor: c.bg,
            '& fieldset': {
              borderColor: c.border,
              transition: `border-color ${MOTION.fast}ms ${MOTION.ease}`,
            },
            '&:hover fieldset': { borderColor: c.borderStrong },
            '&.Mui-focused fieldset': { borderColor: c.text, borderWidth: 1 },
          },
        },
      },

      MuiInputLabel: { styleOverrides: { root: { fontSize: FONT.meta } } },
      MuiMenuItem:   { styleOverrides: { root: { fontSize: FONT.body, minHeight: 34 } } },
      MuiFormHelperText: { styleOverrides: { root: { fontSize: FONT.label, marginLeft: 2 } } },

      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: c.border, color: c.text, fontSize: FONT.body },
          head: {
            fontSize: FONT.label,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: c.textSecondary,
            backgroundColor: c.subtle,
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: `background-color ${MOTION.fast}ms ${MOTION.ease}`,
          },
        },
      },

      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            '&.Mui-active': { color: c.text },
            '&.Mui-active .MuiTableSortLabel-icon': { color: c.text },
          },
        },
      },

      MuiTablePagination: {
        styleOverrides: {
          root: { fontSize: FONT.meta, borderTop: `1px solid ${c.border}` },
          selectLabel: { fontSize: FONT.meta },
          displayedRows: { fontSize: FONT.meta },
        },
      },

      MuiDialog: {
        // Slower in than out: an arriving dialog should feel placed, a dismissed
        // one should get out of the way.
        defaultProps: { transitionDuration: { enter: MOTION.base, exit: MOTION.fast } },
        styleOverrides: {
          paper: {
            borderRadius: RADIUS.md,
            backgroundColor: c.paper,
            border: `1px solid ${c.border}`,
            boxShadow: isDark
              ? '0 8px 28px rgba(0, 0, 0, 0.6)'
              : '0 8px 28px rgba(0, 0, 0, 0.10)',
          },
        },
      },

      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(24, 24, 27, 0.28)',
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: { fontSize: FONT.label, borderRadius: RADIUS.sm },
        },
      },

      MuiAlert: { styleOverrides: { root: { fontSize: FONT.body, borderRadius: RADIUS.md } } },
      MuiDivider: { styleOverrides: { root: { borderColor: c.border } } },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontSize: FONT.label,
            fontWeight: 600,
            backgroundColor: c.subtle,
            color: c.textSecondary,
          },
        },
      },
    },
  });
};
