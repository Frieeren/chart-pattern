import type { ChartItem, FilterOption, SymbolOption } from '../types/domain';

export const SAMPLE_SYMBOLS: SymbolOption[] = [
  { id: 'btc', name: '비트코인', code: 'BTCUSD' },
  { id: 'eth', name: '이더리움', code: 'ETHUSD' },
  { id: 'xrp', name: '리플', code: 'XRPUSD' },
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
  { value: '1', label: '1분' },
  { value: '5', label: '5분' },
  { value: '15', label: '15분' },
  { value: '30', label: '30분' },
  { value: '60', label: '1시간' },
  { value: '120', label: '2시간' },
  { value: '180', label: '3시간' },
  { value: '240', label: '4시간' },
  { value: 'D', label: '일봉' },
  { value: 'W', label: '주봉' },
];

export const DEFAULT_INTERVAL = INTERVAL_OPTIONS.length > 0 ? INTERVAL_OPTIONS[0].value : null;

export const DEFAULT_SYMBOL = SYMBOL_OPTIONS.length > 0 ? SYMBOL_OPTIONS[0].value : null;
