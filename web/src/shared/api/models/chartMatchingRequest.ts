/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Chart Pattern API
 * 차트 패턴 매칭을 위한 API 서버
 * OpenAPI spec version: 1.0.0
 */
import type { ChartMatchingRequestTimeframe } from './chartMatchingRequestTimeframe';

export interface ChartMatchingRequest {
  /** 종료 날짜 및 시간 */
  endDate: string;
  /** 시작 날짜 및 시간 */
  startDate: string;
  /** 종목 코드 (예: BTCUSDT) */
  symbol: string;
  /** 시간 단위 (예: 5m, 1h, 1d) */
  timeframe: ChartMatchingRequestTimeframe;
}
