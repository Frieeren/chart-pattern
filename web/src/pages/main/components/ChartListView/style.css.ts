import { style } from '@vanilla-extract/css';

export const chartListSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
  overflowY: 'auto',
  height: '100%',
  color: '#e0e0e0',
});

export const chartCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '12px 12px 0 12px',
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
  position: 'absolute',
  top: '12px',
  left: '12px',
});

export const chartCardTitle = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: '500',
});

export const emptyMessage = style({
  textAlign: 'center',
  padding: '16px',
  color: '#666',
});
