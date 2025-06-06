/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Chart Pattern API
 * 차트 패턴 매칭을 위한 API 서버
 * OpenAPI spec version: 1.0.0
 */
import { z as zod } from 'zod';

/**
 * 주어진 기간 동안의 차트 패턴과 유사한 패턴을 찾아 반환합니다.
 * @summary 차트 패턴 매칭 리스트 조회
 */
export const chartMatchingListBody = zod.object({
  endDate: zod.string().datetime({}).describe('종료 날짜 및 시간'),
  startDate: zod.string().datetime({}).describe('시작 날짜 및 시간'),
  symbol: zod.string().describe('종목 코드 (예: BTCUSDT)'),
  timeframe: zod
    .enum(['1', '3', '5', '15', '30', '60', '120', '180', '240', 'D', 'W'])
    .describe('시간 단위 (예: 5m, 1h, 1d)'),
});

export const chartMatchingListResponseItem = zod.object({
  data: zod
    .array(
      zod.object({
        x: zod.string().describe('날짜 및 시간'),
        y: zod.array(zod.number()).describe('[시가, 고가, 종가, 저가]'),
      })
    )
    .describe('차트 데이터'),
  similarity: zod.number().describe('유사도 점수 (0~1)'),
  symbol: zod.string().describe('종목 코드'),
});
export const chartMatchingListResponse = zod.array(chartMatchingListResponseItem);
