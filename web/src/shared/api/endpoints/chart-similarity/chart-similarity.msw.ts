/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Chart Pattern API
 * 차트 패턴 매칭을 위한 API 서버
 * OpenAPI spec version: 1.0.0
 */
import { faker } from '@faker-js/faker';

import { http, HttpResponse, delay } from 'msw';

import type { ChartSimilarityList } from '../../models';

export const getChartSimilarityLatestResponseMock = (
  overrideResponse: Partial<ChartSimilarityList> = {}
): ChartSimilarityList => ({
  similarities: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({
    end_time: `${faker.date.past().toISOString().split('.')[0]}Z`,
    price_data: faker.helpers.arrayElement([
      faker.helpers.arrayElement([
        Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({
          close: faker.number.int({ min: undefined, max: undefined }),
          high: faker.number.int({ min: undefined, max: undefined }),
          low: faker.number.int({ min: undefined, max: undefined }),
          open: faker.number.int({ min: undefined, max: undefined }),
          time: `${faker.date.past().toISOString().split('.')[0]}Z`,
          volume: faker.helpers.arrayElement([
            faker.helpers.arrayElement([faker.number.int({ min: undefined, max: undefined }), null]),
            undefined,
          ]),
        })),
        null,
      ]),
      undefined,
    ]),
    similarity: faker.number.int({ min: undefined, max: undefined }),
    start_time: `${faker.date.past().toISOString().split('.')[0]}Z`,
    symbol: faker.string.alpha(20),
    time: `${faker.date.past().toISOString().split('.')[0]}Z`,
  })),
  ...overrideResponse,
});

export const getChartSimilarityLatestMockHandler = (
  overrideResponse?:
    | ChartSimilarityList
    | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ChartSimilarityList> | ChartSimilarityList)
) => {
  return http.get('*/v1/chart-similarity/:symbol', async info => {
    await delay(1000);

    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getChartSimilarityLatestResponseMock()
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });
};
export const getChartSimilarityMock = () => [getChartSimilarityLatestMockHandler()];
