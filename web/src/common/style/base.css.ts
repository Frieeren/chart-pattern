import { globalStyle } from "@vanilla-extract/css";
import * as layers from "./layers.css.ts";

/**
 * 프로젝트 기본 스타일
 */
globalStyle(':root', {
  '@layer': {
    [layers.base]: {
      fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
      colorScheme: 'light dark',
      fontSynthesis: 'none',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    }
  }
});