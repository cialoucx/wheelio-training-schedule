import React from 'react';
import { Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';

import FiIcon from './FiIcon';
import WheelLogo from './WheelLogo';
import { CONTENT_MAX_W, CONTROL_H, ICON } from '../theme';

const iconButtonSx = {
  width: CONTROL_H,
  height: CONTROL_H,
  border: '1px solid',
  borderColor: 'divider',
} as const;

interface AppHeaderProps {
  colorMode: 'light' | 'dark';
  isRefreshing: boolean;
  onRefresh: () => void;
  onToggleColorMode?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  colorMode,
  isRefreshing,
  onRefresh,
  onToggleColorMode,
}) => (
  <Box
    component="header"
    sx={{
      flexShrink: 0,
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Box
      sx={{
        maxWidth: CONTENT_MAX_W,
        width: '100%',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <WheelLogo size={30} />
        <Typography variant="h6" component="h1">
          Wheelio
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
        <Typography
          variant="subtitle1"
          color="text.secondary"
          noWrap
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          Training Schedule
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Tooltip title="Refresh schedule">
          <span>
            <IconButton
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh schedule"
              sx={iconButtonSx}
            >
              <FiIcon name="rotate-right" size={ICON.md} />
            </IconButton>
          </span>
        </Tooltip>

        {onToggleColorMode && (
          <Tooltip title={colorMode === 'light' ? 'Switch to dark' : 'Switch to light'}>
            <IconButton
              onClick={onToggleColorMode}
              aria-label="Toggle colour mode"
              sx={iconButtonSx}
            >
              <FiIcon name={colorMode === 'light' ? 'moon' : 'sun'} size={ICON.md} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  </Box>
);

export default AppHeader;
