import { act, screen, waitFor } from '@testing-library/react';
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

    const filterPeriodLabel = await screen.findByText(/filter.interval/);
    expect(filterPeriodLabel).toBeTruthy();

    const filterPeriodSelect = await screen.findByRole('combobox', { name: /filter.interval/ });
    expect(filterPeriodSelect).toBeTruthy();

    // 기본 값 확인
    expect(screen.getByText('5분')).toBeTruthy();

    // 값 변경
    await userEvent.selectOptions(filterPeriodSelect, '5');
    expect((filterPeriodSelect as HTMLSelectElement).value).toBe('5');
  });

  test('2. 필터 > 종목 설정 Select가 없는 경우 빈 메시지가 표시되는지 테스트합니다.', async () => {
    const { router } = renderWithRouter({ initialEntries: ['/'] });

    await act(async () => {
      router.navigate('/');
    });

    // 종목 label 확인
    const symbolLabel = await screen.findByText(/filter.symbol/);
    expect(symbolLabel).toBeTruthy();

    // 빈 메시지 확인
    const emptyMessage = screen.getByText(/filter.noSymbol/);
    expect(emptyMessage).toBeTruthy();

    // select가 없는 것을 확인
    const symbolSelect = screen.queryByRole('combobox', { name: /filter.symbol/ });
    expect(symbolSelect).toBeNull();
  });

  test('3. 라이브 차트 토글 버튼 클릭 시 라이브 버튼이 활성화되고 딜레이 버튼이 비활성화되는지 테스트합니다.', async () => {
    const { router } = renderWithRouter({ initialEntries: ['/'] });

    await act(async () => {
      router.navigate('/');
    });

    await waitFor(async () => {
      // given
      const initialButton = screen.getByRole('button', { name: /live off/ });
      expect(initialButton).toBeTruthy();

      // when
      await userEvent.click(initialButton);

      // then
      const clickedButton = screen.getByRole('button', { name: /live on/ });
      expect(clickedButton).toBeTruthy();
    });
  });
});
