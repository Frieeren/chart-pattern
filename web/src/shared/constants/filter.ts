import type { ChartItem, FilterOption, SymbolOption } from '../types/domain';

export const SAMPLE_SYMBOLS: SymbolOption[] = [
  { id: 'btc', name: '비트코인', code: 'BTC-KRW' },
  { id: 'eth', name: '이더리움', code: 'ETH-KRW' },
  { id: 'xrp', name: '리플', code: 'XRP-KRW' },
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

export const TIMEFRAME_OPTIONS: FilterOption[] = [
  { value: '5m', label: '5분' },
  { value: '15m', label: '15분' },
  { value: '30m', label: '30분' },
  { value: '1h', label: '1시간' },
  { value: '4h', label: '4시간' },
  { value: '6h', label: '6시간' },
  { value: '12h', label: '12시간' },
  { value: '24h', label: '일봉' },
];

export const DEFAULT_TIMEFRAME = '1h';

export const DEFAULT_SYMBOL = SYMBOL_OPTIONS.length > 0 ? SYMBOL_OPTIONS[0].value : null;
