import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { renderWithRouter } from '../renderWithRouter';

/** react-apexcharts mocking(https://github.com/apexcharts/react-apexcharts/issues/425) */
vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="mocked-chart" />,
}));

vi.mock('apexcharts', () => ({
  default: vi.fn(),
}));

describe('Main 페이지', () => {
  test('1. 필터 > 기간 설정 Select를 클릭하였을 때 문구가 잘 변경되는지 테스트합니다.', async () => {
    const { router } = renderWithRouter({ initialEntries: ['/'] });

    await act(async () => {
      router.navigate('/');
    });

    const filterPeriodLabel = await screen.findByText(/기간 설정/);
    expect(filterPeriodLabel).toBeTruthy();

    const filterPeriodSelect = await screen.findByRole('combobox', { name: /기간 설정/ });
    expect(filterPeriodSelect).toBeTruthy();

    // 기본 값 확인
    expect(screen.getByText('5분')).toBeTruthy();

    // 값 변경
    await userEvent.selectOptions(filterPeriodSelect, '1');
    expect((filterPeriodSelect as HTMLSelectElement).value).toBe('1');
  });

  test('2. 필터 > 종목 설정 Select를 클릭하였을 때 문구가 잘 변경되는지 테스트합니다.', async () => {
    const { router } = renderWithRouter({ initialEntries: ['/'] });

    await act(async () => {
      router.navigate('/');
    });

    const filterPeriodLabel = await screen.findByText(/종목 설정/);
    expect(filterPeriodLabel).toBeTruthy();

    const filterPeriodSelect = await screen.findByRole('combobox', { name: /종목 설정/ });
    expect(filterPeriodSelect).toBeTruthy();

    // 기본 값 확인
    expect(screen.getByText('종목 선택')).toBeTruthy();

    // 값 변경
    await userEvent.selectOptions(filterPeriodSelect, 'eth');
    expect((filterPeriodSelect as HTMLSelectElement).value).toBe('eth');
  });
});
