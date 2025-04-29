import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'grid',
  gridTemplateColumns: '1fr 300px',
  gridTemplateRows: 'auto 1fr',
  gap: '16px',
  padding: '16px',
  height: '100vh',
  boxSizing: 'border-box',
  backgroundColor: '#121212',
});

const area = style({
  backgroundColor: '#1e1e1e',
  border: '1px solid #2e2e2e',
  borderRadius: '8px',
});

export const filterArea = style([
  area,
  {
    gridColumn: '1 / 2',
    gridRow: '1 / 2',
  }
]);

export const chartArea = style([
  area,
  {
    gridColumn: '1 / 2',
    gridRow: '2 / 3',
  }
]);

export const listArea = style([
  area,
  {
    gridColumn: '2 / 3',
    gridRow: '1 / 3',
  }
]);

export const errorMessage = style({
  color: '#d32f2f',
  backgroundColor: 'rgba(211, 47, 47, 0.1)',
  padding: '8px 12px',
  borderRadius: '4px',
  fontSize: '14px',
  marginTop: '8px',
});