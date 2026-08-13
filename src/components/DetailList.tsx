import React from 'react';
import { Box, Typography } from '@mui/material';

import FiIcon from './FiIcon';
import { ICON } from '../theme';

/**
 * Category icons match their label's weight — solid rather than outline, at the
 * label's own colour — so the pair reads as one unit. Solid is used rather than
 * the bold-stroke set because solid/rounded is already loaded; bold would add a
 * 350KB font for a stroke-width difference.
 */
const LabelIcon: React.FC<{ name: string }> = ({ name }) => (
  <FiIcon name={name} variant="sr" size={ICON.sm} style={{ flexShrink: 0 }} />
);

const labelSx = { display: 'flex', alignItems: 'center', gap: 0.75 } as const;

export const SectionLabel: React.FC<{ icon?: string; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <Typography variant="overline" color="text.primary" sx={{ ...labelSx, mb: 1 }}>
    {icon && <LabelIcon name={icon} />}
    {children}
  </Typography>
);

const Value: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  typeof children === 'string' ? (
    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
      {children}
    </Typography>
  ) : (
    <>{children}</>
  );

export const SummaryCell: React.FC<{
  label: string;
  icon?: string;
  children: React.ReactNode;
}> = ({ label, icon, children }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography variant="overline" color="text.primary" sx={{ ...labelSx, mb: 0.5 }}>
      {icon && <LabelIcon name={icon} />}
      {label}
    </Typography>
    <Value>{children}</Value>
  </Box>
);

export const DetailGroup: React.FC<{
  title: string;
  icon?: string;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <Box sx={{ minWidth: 0 }}>
    <SectionLabel icon={icon}>{title}</SectionLabel>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '96px minmax(0, 1fr)',
        columnGap: 1.25,
        rowGap: 1,
        alignItems: 'baseline',
      }}
    >
      {children}
    </Box>
  </Box>
);

export const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box sx={{ minWidth: 0 }}>
      <Value>{value}</Value>
    </Box>
  </>
);
