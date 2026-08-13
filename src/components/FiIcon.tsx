import React from 'react';

export type UIconStyle = 'rr' | 'br' | 'sr' | 'rs' | 'ss' | 'bs';

interface FiIconProps {
  name: string;
  variant?: UIconStyle;
  iconStyle?: UIconStyle;
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
  'aria-hidden'?: boolean;
}

const FiIcon: React.FC<FiIconProps> = ({
  name,
  variant = 'sr',
  iconStyle,
  size = '1em',
  color,
  style,
  className = '',
  'aria-hidden': ariaHidden = true,
}) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  const activeVariant = iconStyle || variant;

  return (
    <i
      className={`fi fi-${activeVariant}-${name} ${className}`.trim()}
      aria-hidden={ariaHidden}
      style={{
        fontSize: sizeValue,
        ...(color ? { color } : {}),
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
        ...style,
      }}
    />
  );
};

export default FiIcon;
