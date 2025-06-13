import { keyframes, style } from '@vanilla-extract/css';

export const chartListSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
  overflowY: 'auto',
  height: '100%',
  color: '#e0e0e0',
});

export const chartListHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const chartListTitle = style({
  fontSize: 14,
  fontWeight: 600,
});

export const chartCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: 12,
  borderRadius: '8px',
  border: '1px solid #333333',
  backgroundColor: '#252525',
  transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
  position: 'relative',
  ':hover': {
    transform: 'translateY(-2px)',
  },
});

export const chartCardHeader = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  position: 'absolute',
  bottom: 12,
  left: 12,
});

export const chartCardTitle = style({
  margin: 0,
  fontSize: 12,
  fontWeight: '500',
});

export const emptyMessage = style({
  textAlign: 'center',
  padding: '16px',
  color: '#666',
});

const shimmer = keyframes({
  '0%': { backgroundPosition: '-1000px 0' },
  '100%': { backgroundPosition: '1000px 0' },
});

export const chartCardSkeleton = style({
  height: 160,
  animation: `${shimmer} 2s infinite linear`,
  background: 'linear-gradient(to right, #333333 4%, #444444 25%, #333333 36%)',
  backgroundSize: '1000px 100%',
});

export const chartCardChartWrapper = style({
  height: 160,
});
