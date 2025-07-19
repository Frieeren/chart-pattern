import * as Sentry from '@sentry/react';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { BadRequestError, InternetServerError, NotFoundError } from '../exception/APIError';
import { BaseError } from '../exception/BaseError';

const baseURL = import.meta.env.DEV ? 'http://localhost:8000/' : import.meta.env.VITE_API_BASE_URL;
const TIMEOUT = 60000;

const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUT,
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      const message =
        typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string'
          ? data.message
          : 'An error occurred';

      switch (status) {
        case 400:
          throw new BadRequestError(message || 'Bad Request');
        case 404:
          throw new NotFoundError(message || 'Not Found');
        case 500:
          throw new InternetServerError(message || 'Internal Server Error');
        default:
          throw new BaseError(status, message || 'An error occurred');
      }
    }
    return error;
  }
);

export const httpClient = <T>(axiosConfig: AxiosRequestConfig): Promise<T> => {
  const promise = instance(axiosConfig)
    .then((response: AxiosResponse<T>) => response.data)
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setFingerprint([axiosConfig.method, error.response?.status, axiosConfig.url]);
        scope.setContext('response', error.response);
        scope.setLevel('fatal');
        scope.setTag('source', 'api');

        Sentry.captureException(error);
      });

      if (error instanceof BaseError) {
        throw error;
      }
      throw new Error(`Request failed: ${(error as Error).message}`);
    });

  return promise;
};
