/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Chart Pattern API
 * 차트 패턴 매칭을 위한 API 서버
 * OpenAPI spec version: 1.0.0
 */
import { z as zod } from 'zod';

/**
 * 심볼별 최신 차트 유사도 결과 리스트를 반환합니다.
 * @summary 차트 유사도 결과 조회
 */
export const chartSimilarityLatestParams = zod.object({
  symbol: zod.string().describe('심볼 (예: BTCUSDT, ETHUSDT, ..)'),
});

export const chartSimilarityLatestResponse = zod.object({
  similarities: zod
    .array(
      zod.object({
        symbol: zod.string().describe('심볼 (예: BTCUSDT, ETHUSDT 등)'),
        time: zod.string().datetime({}),
        start_time: zod.string().datetime({}),
        end_time: zod.string().datetime({}),
        similarity: zod.number(),
        price_data: zod
          .array(
            zod.object({
              time: zod.string().datetime({}),
              open: zod.number(),
              high: zod.number(),
              low: zod.number(),
              close: zod.number(),
              volume: zod.number().or(zod.null()).optional(),
            })
          )
          .or(zod.null())
          .optional(),
      })
    )
    .describe('차트 유사도 결과 리스트'),
});
