import { globalStyle } from '@vanilla-extract/css';

import * as layers from './layers.css.ts';

// https://gist.github.com/shun-shobon/8254ad7eab692c9e22c3a0f5421f9b54

/**
 * 'display' 속성만 제외한 모든 "User-Agent-StyleSheet" 스타일을 제거합니다.
 * - "symbol *" 부분은 Firefox에서 발생하는 SVG 스프라이트 버그를 해결하기 위한 것입니다.
 * - "html" 요소는 제외되며, 그렇지 않으면 Chrome에서 CSS 하이픈(hyphens) 속성이 망가지는 버그가 발생합니다.
 *   (https://github.com/elad2412/the-new-css-reset/issues/36).
 */
globalStyle('*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *))', {
  '@layer': {
    [layers.reset]: {
      all: 'unset',
      display: 'revert',
    },
  },
});

/**
 * 기본 box-sizing border-box로 설정
 */
globalStyle('*, *::before, *::after', {
  '@layer': {
    [layers.reset]: {
      boxSizing: 'border-box',
    },
  },
});

/**
 * 모바일 사파리에서 가로 모드로 전환할 때 글꼴 크기가 자동으로 커지는 현상을 방지
 */
globalStyle('html', {
  '@layer': {
    [layers.reset]: {
      MozTextSizeAdjust: 'none',
      WebkitTextSizeAdjust: 'none',
      textSizeAdjust: 'none',
    },
  },
});

/**
 * a 태그와 button 태그에 pointer 재적용
 */
globalStyle('a, button', {
  '@layer': {
    [layers.reset]: {
      cursor: 'pointer',
    },
  },
});

/**
 * 리스트 스타일 제거 (불릿/넘버)
 */
globalStyle('ol, ul, menu, summary', {
  '@layer': {
    [layers.reset]: {
      listStyle: 'none',
    },
  },
});

/**
 * 이미지 요소가 컨테이너의 크기를 넘지 않도록 설정
 */
globalStyle('img', {
  '@layer': {
    [layers.reset]: {
      maxInlineSize: '100%',
      maxBlockSize: '100%',
    },
  },
});

/**
 * 테이블 셀 사이의 기본 간격을 제거
 */
globalStyle('table', {
  '@layer': {
    [layers.reset]: {
      borderCollapse: 'collapse',
    },
  },
});

/**
 * 사파리 브라우저에서 user-select:none을 적용할 때 발생할 수 있는 문제를 방지하고, 텍스트 입력 요소가 정상적으로 동작
 * doesn't working
 */
globalStyle('input, textarea', {
  '@layer': {
    [layers.reset]: {
      WebkitUserSelect: 'auto',
    },
  },
});

/**
 * 사파리 브라우저에서 textarea 요소의 white-space 속성을 기본값으로 되돌리기 위해 사용됩니다.
 */
globalStyle('textarea', {
  '@layer': {
    [layers.reset]: {
      whiteSpace: 'revert',
    },
  },
});

/**
 * meter 태그 사용을 위한 최소한의 스타일 설정
 */
globalStyle('meter', {
  '@layer': {
    [layers.reset]: {
      WebkitAppearance: 'revert',
      appearance: 'revert',
    },
  },
});

/**
 * pre 태그의 브라우저 기본 스타일을 복원, box-sizing border-box 설정
 */
globalStyle(':where(pre)', {
  '@layer': {
    [layers.reset]: {
      all: 'revert',
      boxSizing: 'border-box',
    },
  },
});

/**
 * input의 placeholder의 컬러를 지정하지 않음
 */
globalStyle('::placeholder', {
  '@layer': {
    [layers.reset]: {
      color: 'unset',
    },
  },
});

/**
 * hidden 속성을 가진 요소의 display none을 적용
 */
globalStyle(':where([hidden])', {
  '@layer': {
    [layers.reset]: {
      display: 'none',
    },
  },
});

/**
 * contenteditable 요소의 편집 기능이 제대로 동작하도록 설정
 * Revert for bug in Chromium browsers
 *
 */
globalStyle(':where([contenteditable]:not([contenteditable="false"]))', {
  // @ts-expect-error: -webkit-line-break is a non-standard property
  '@layer': {
    [layers.reset]: {
      MozUserModify: 'read-write',
      WebkitUserModify: 'read-write',
      overflowWrap: 'break-word',
      WebkitLineBreak: 'after-white-space',
      WebkitUserSelect: 'auto',
    },
  },
});

/**
 * draggable 속성이 있는 요소에서 드래그 기능이 제대로 작동하도록 설정
 */
globalStyle(':where([draggable="true"])', {
  '@layer': {
    [layers.reset]: {
      // @ts-expect-error: -webkit-user-drag is a non-standard property
      WebkitUserDrag: 'element',
    },
  },
});

/**
 * modal의 기본 동작 복원
 */
globalStyle(':where(dialog:modal)', {
  '@layer': {
    [layers.reset]: {
      all: 'revert',
      boxSizing: 'border-box',
    },
  },
});
