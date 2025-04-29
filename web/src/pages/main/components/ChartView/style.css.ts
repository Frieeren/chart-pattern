import { style } from '@vanilla-extract/css';

export const chartViewSection = style({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: '#e0e0e0',
});

export const infoBox = style({
  padding: '8px 12px',
  borderRadius: '4px',
  marginTop: '8px',
  width: '100%',
  maxWidth: '300px',
  textAlign: 'center',
});

export const timeframeInfo = style([
  infoBox,
  {
    backgroundColor: '#000',
    color: '#fff',
  },
]);

export const symbolInfo = style([
  infoBox,
  {
    backgroundColor: '#000',
    color: '#fff',
  },
]);

export const noSymbolMessage = style([
  infoBox,
  {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    color: '#ff9800',
  },
]);
