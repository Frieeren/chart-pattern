import ky, { HTTPError } from "ky";
import {
  BadRequestError,
  InternetServerError,
  NotFoundError,
} from "../exception/APIError";
import { BaseError } from "../exception/BaseError";

const baseURL = "http://localhost:8000";
const TIMEOUT = 60000;

export interface ErrorType<Error> {
  name: string;
  message: string;
  response?: {
    status: number;
    data: Error;
  };
}

const instance = ky.create({
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
            typeof data === "object" && data !== null && "message" in data
              ? String(data.message)
              : null;

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
      },
    ],
  },
});

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type");
  const jsonParseAvailable = contentType && /json/.test(contentType);

  return (
    jsonParseAvailable ? await response.json() : await response.text()
  ) as T;
};

export const http = <T>(
  config: RequestInit & {
    url: string;
    params?: Record<string, string | string[] | undefined>;
    data?: any;
    json?: any;
  }
): Promise<T> => {
  const kyOptions: Record<string, unknown> = {};

  if (config.method) {
    kyOptions.method = config.method;
  }

  if (config.headers) {
    if (config.headers instanceof Headers) {
      const headerObj: Record<string, string> = {};
      config.headers.forEach((value, key) => {
        headerObj[key] = value;
      });
      kyOptions.headers = headerObj;
    } else {
      kyOptions.headers = config.headers;
    }
  }

  if (config.params) {
    kyOptions.searchParams = config.params;
  }

  if (config.data) {
    kyOptions.json = config.data;
  } else if (config.json) {
    kyOptions.json = config.json;
  } else if (config.body && typeof config.body === "string") {
    try {
      kyOptions.json = JSON.parse(config.body);
    } catch {
      kyOptions.body = config.body;
    }
  }

  const promise = instance(config.url, kyOptions)
    .then((response) => parseResponse<T>(response))
    .catch((error) => {
      if (error instanceof HTTPError || error instanceof BaseError) {
        throw error;
      }
      throw new Error(`Request failed: ${(error as Error).message}`);
    });

  // @ts-ignore
  promise.cancel = () => {
    console.warn(
      "Cancel requested but ky does not support native cancellation"
    );
  };

  return promise;
};
