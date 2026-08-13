import React from 'react';
import { Box } from '@mui/material';
import wheelMark from '../assets/wheel-mark.png';

const WheelLogo: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <Box
    role="img"
    aria-label="Wheelio"
    sx={{
      width: size,
      height: size,
      flexShrink: 0,
      backgroundColor: 'text.primary',
      maskImage: `url(${wheelMark})`,
      WebkitMaskImage: `url(${wheelMark})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
);

export default WheelLogo;
