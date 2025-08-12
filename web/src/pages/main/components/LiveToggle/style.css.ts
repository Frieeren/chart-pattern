import { keyframes, style } from '@vanilla-extract/css';

export const toggleContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const toggleButton = style({
  position: 'relative',
  width: '80px',
  height: '32px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: '600',
  color: '#9ca3af',

  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export const toggleButtonActive = style({
  backgroundColor: 'rgba(74, 222, 128, 0.2)',
  borderColor: '#4ade80',
  color: '#4ade80',

  ':hover': {
    backgroundColor: 'rgba(74, 222, 128, 0.3)',
  },
});

const pulse = keyframes({
  '0%': { backgroundPosition: '-1000px 0' },
  '100%': { backgroundPosition: '1000px 0' },
});

export const liveDot = style({
  width: '6px',
  height: '6px',
  backgroundColor: '#4ade80',
  borderRadius: '50%',
  marginRight: '4px',
  animation: `${pulse} 2s infinite`,
});
