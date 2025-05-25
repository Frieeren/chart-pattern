import type { ChartItem, FilterOption, SymbolOption } from '../types/domain';

export const SAMPLE_SYMBOLS: SymbolOption[] = [
  { id: 'btc', name: '비트코인', code: 'BTCUSDT' },
  { id: 'eth', name: '이더리움', code: 'ETHUSDT' },
  { id: 'xrp', name: '리플', code: 'XRPUSDT' },
];

export const SYMBOL_OPTIONS: FilterOption[] = SAMPLE_SYMBOLS.map(symbol => ({
  value: symbol.id,
  label: `${symbol.name} (${symbol.code})`,
}));

export const SAMPLE_CHARTS: ChartItem[] = [
  { id: 'btc', name: '비트코인' },
  { id: 'eth', name: '이더리움' },
  { id: 'xrp', name: '리플' },
];

export const INTERVAL_OPTIONS: FilterOption[] = [
  { value: '5', label: '5분' }, // 5분봉(최대 5분봉까지 제한)
];

export const DEFAULT_INTERVAL = INTERVAL_OPTIONS.length > 0 ? INTERVAL_OPTIONS[0].value : null;

export const DEFAULT_SYMBOL = SYMBOL_OPTIONS.length > 0 ? SYMBOL_OPTIONS[0].value : null;
