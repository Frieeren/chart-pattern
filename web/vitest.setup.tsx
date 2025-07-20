import React from 'react';
import { vi } from 'vitest';

/** https://react.i18next.com/misc/testing  */
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (i18nKey: string) => i18nKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

/** react-apexcharts mocking(https://github.com/apexcharts/react-apexcharts/issues/425) */
vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="mocked-chart" />,
}));

vi.mock('apexcharts', () => ({
  default: vi.fn(),
}));
