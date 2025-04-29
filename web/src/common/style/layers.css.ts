import { layer } from '@vanilla-extract/css';

// https://caniuse.com/css-cascade-layers
export const reset = layer('reset');
export const base = layer('base');
export const components = layer('components');
