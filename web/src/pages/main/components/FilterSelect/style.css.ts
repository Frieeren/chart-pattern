import { style } from '@vanilla-extract/css';

export const filterSection = style({
  padding: '16px',
  color: '#e0e0e0',
});

export const filterTitle = style({
  margin: '0 0 16px',
  fontSize: '18px',
  fontWeight: '600',
});

export const filterItem = style({
  marginBottom: '16px',
});

export const filterLabel = style({
  display: 'block',
  marginBottom: '8px',
  fontWeight: '500',
});

export const filterSelect = style({
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
  fontSize: '14px',
  ':focus': {
    outline: '2px solid #3f51b5',
    outlineOffset: '1px',
  },
});

export const errorMessage = style({
  color: '#d32f2f',
  fontSize: '12px',
  marginTop: '4px',
  fontWeight: '500',
});

export const emptyMessage = style({
  color: '#757575',
  fontSize: '14px',
  padding: '8px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  textAlign: 'center',
});
