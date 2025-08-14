import { style } from '@vanilla-extract/css';

export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  border: 0,
  padding: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});
