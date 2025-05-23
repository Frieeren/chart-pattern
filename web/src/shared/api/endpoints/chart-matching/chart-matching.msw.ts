/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Chart Pattern API
 * 차트 패턴 매칭을 위한 API 서버
 * OpenAPI spec version: 1.0.0
 */
import { faker } from '@faker-js/faker';

import { http, HttpResponse, delay } from 'msw';

import type { ChartMatchingResponse } from '../../models';

export const getChartMatchingListResponseMock = (): ChartMatchingResponse[] =>
  Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({
    data: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({
      x: faker.string.alpha(20),
      y: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() =>
        faker.number.int({ min: undefined, max: undefined })
      ),
    })),
    similarity: faker.number.int({ min: undefined, max: undefined }),
    symbol: faker.string.alpha(20),
  }));

export const getChartMatchingListMockHandler = (
  overrideResponse?:
    | ChartMatchingResponse[]
    | ((
        info: Parameters<Parameters<typeof http.post>[1]>[0]
      ) => Promise<ChartMatchingResponse[]> | ChartMatchingResponse[])
) => {
  return http.post('*/v1/chart_matching_list', async info => {
    await delay(1000);

    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getChartMatchingListResponseMock()
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });
};
export const getChartMatchingMock = () => [getChartMatchingListMockHandler()];
