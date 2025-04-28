import ky, { HTTPError } from "ky";
import { BaseError } from "../exception/BaseError";
import { BadRequestError, InternetServerError, NotFoundError } from "../exception/APIError";

const baseURL = "http://localhost:3000";
const TIMEOUT = 60000;

type HttpRequestMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';

interface HttpRequestOptions {
  json?: unknown;
  searchParams?: Record<string, string | string[] | undefined>;
  headers?: Record<string, string | undefined>;
}

export class Http {
  private instance = ky.create({
    prefixUrl: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: TIMEOUT,
    hooks: {
      beforeError: [
        async (error) => {
          if (error instanceof HTTPError) {
            const { response } = error;
            const status = response.status;

            let data: unknown;
            try {
              data = await response.json();
            } catch (e) {
              return error;
            }
            
            const message = 
              typeof data === "object" && data !== null && "message" in data ? String(data.message) : null;
            
            switch (status) {
              case 400:
                throw new BadRequestError(message || "Bad Request");
              case 404:
                throw new NotFoundError(message || "Not Found");
              case 500:
                throw new InternetServerError(message || "Internal Server Error");
              default:
                throw new BaseError(status, message || "An error occurred");
            }
          }
          
          return error;
        }
      ]
    }
  });

  async get<T>(path: string, options?: Omit<HttpRequestOptions, 'json'>): Promise<T> {
    return this.request<T>('get', path, options);
  }

  async post<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('post', path, options);
  }

  async patch<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('patch', path, options);
  }

  async put<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('put', path, options);
  }

  async delete<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('delete', path, options);
  }

  private async request<T>(method: HttpRequestMethod, path: string, options?: HttpRequestOptions): Promise<T> {
    const kyOptions = this.parseRequestOptions(options);
    
    try {
      const response = await this.instance[method](path, kyOptions);
      return await response.json<T>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      if (error instanceof BaseError) {
        throw error;
      }
      throw new Error(`Request failed: ${(error as Error).message}`);
    }
  }

  private parseRequestOptions(options?: HttpRequestOptions): Record<string, unknown> {
    if (!options) return {};
    
    const result: Record<string, unknown> = {};
    
    if (options.json !== undefined) {
      result.json = options.json;
    }
    
    if (options.searchParams) {
      result.searchParams = options.searchParams;
    }
    
    if (options.headers) {
      result.headers = options.headers;
    }
    
    return result;
  }
}

export const http = new Http();