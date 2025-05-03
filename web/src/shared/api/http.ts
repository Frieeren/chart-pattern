import ky, { HTTPError } from 'ky';
import { BadRequestError, InternetServerError, NotFoundError } from '../exception/APIError';
import { BaseError } from '../exception/BaseError';

const baseURL = 'http://localhost:3000';
const TIMEOUT = 60000;

type HttpRequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface HttpRequestOptions {
  method?: HttpRequestMethod;
  json?: any;
  searchParams?: Record<string, string | string[] | undefined>;
  headers?: Record<string, string | undefined>;
}

const instance = ky.create({
  prefixUrl: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUT,
  hooks: {
    beforeError: [
      async error => {
        if (error instanceof HTTPError) {
          const { response } = error;
          const status = response.status;

          let data: unknown;
          try {
            data = await response.json();
          } catch (e) {
            return error;
          }

          const message = typeof data === 'object' && data !== null && 'message' in data ? String(data.message) : null;

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
      },
    ],
  },
});

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const jsonParseAvailable = contentType && /json/.test(contentType);

  return (jsonParseAvailable ? await response.json() : await response.text()) as T;
};

export const http = async <T>(url: string, options: HttpRequestOptions = {}): Promise<T> => {
  const kyOptions: Record<string, unknown> = {};

  if (options.method) {
    kyOptions.method = options.method;
  }

  if (options.headers) {
    kyOptions.headers = options.headers;
  }

  if (options.searchParams) {
    kyOptions.searchParams = options.searchParams;
  }

  if (options.json) {
    kyOptions.json = options.json;
  }

  try {
    const response = await instance(url, kyOptions);
    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof HTTPError || error instanceof BaseError) {
      throw error;
    }
    throw new Error(`Request failed: ${(error as Error).message}`);
  }
};

http.get = async <T>(path: string, options?: Omit<HttpRequestOptions, 'method' | 'json'>): Promise<T> => {
  return http<T>(path, { ...options, method: 'GET' });
};

http.post = async <T>(path: string, json?: any, options?: Omit<HttpRequestOptions, 'method' | 'json'>): Promise<T> => {
  return http<T>(path, { ...options, method: 'POST', json });
};

http.patch = async <T>(path: string, json?: any, options?: Omit<HttpRequestOptions, 'method' | 'json'>): Promise<T> => {
  return http<T>(path, { ...options, method: 'PATCH', json });
};

http.put = async <T>(path: string, json?: any, options?: Omit<HttpRequestOptions, 'method' | 'json'>): Promise<T> => {
  return http<T>(path, { ...options, method: 'PUT', json });
};

http.delete = async <T>(path: string, options?: Omit<HttpRequestOptions, 'method' | 'json'>): Promise<T> => {
  return http<T>(path, { ...options, method: 'DELETE' });
};
