import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '../renderWithRouter';

describe('Main 페이지', () => {
  test('1. 필터 > 기간 설정의 기본값(5분)이 Select에 표시되는지 테스트합니다.', async () => {
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
    const symbolSelect = screen.getByRole('combobox', { name: /filter.symbol/ }) as HTMLSelectElement;
    const firstOption = symbolSelect.options[0];
    expect(firstOption.value).toBe('');
    expect(firstOption.textContent).toMatch(/filter.empty/);
  });
});
