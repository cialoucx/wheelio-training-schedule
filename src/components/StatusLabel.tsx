import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { StatusToken } from '../theme';

/** Resolves a token path like `success.main` against the live palette. */
const paletteColor = (theme: Theme, path: string): string =>
  path
    .split('.')
    .reduce<unknown>(
      (value, key) => (value as Record<string, unknown> | undefined)?.[key],
      theme.palette,
    ) as string;

export interface StatusLabelProps {
  token: StatusToken;
  
  variant: 'chip' | 'text';
}

const StatusLabel: React.FC<StatusLabelProps> = ({ token, variant }) => {

  const color = token.color === 'text.disabled' ? 'text.secondary' : token.color;

  if (variant === 'text') {
    return (
      <Typography variant="body2" fontWeight={600} color={color} noWrap>
        {token.label}
      </Typography>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.375,
        borderRadius: 99,
        maxWidth: '100%',
        color,
       
        backgroundColor: (theme) => alpha(paletteColor(theme, color), 0.07),
      }}
    >
      <Typography variant="caption" fontWeight={600} noWrap>
        {token.label}
      </Typography>
    </Box>
  );
};

export default StatusLabel;
