import { SpanOptions } from '../types';

export const checkDetailedRequestFlags = (options?: SpanOptions) => {
  return (
    options?.captureBody !== undefined ||
    options?.captureHeaders !== undefined ||
    options?.captureQuery !== undefined ||
    options?.captureParams !== undefined ||
    options?.captureCookies !== undefined
  );
};

export const getRequestInfo = (args: any[], options?: SpanOptions) => {
  const capturedArgs: Record<string, unknown> = {};

  for (const arg of args) {
    if (options?.captureBody !== false && arg?.body) capturedArgs.body = arg.body;
    if (options?.captureHeaders !== false && arg?.headers)
      capturedArgs.headers = arg.headers;
    if (options?.captureQuery !== false && arg?.query) capturedArgs.query = arg.query;
    if (options?.captureParams !== false && arg?.params) capturedArgs.params = arg.params;
    if (options?.captureCookies !== false && arg?.cookies)
      capturedArgs.cookies = arg.cookies;

    if (!arg?.body && !arg?.headers && !arg?.query) capturedArgs.other = arg;
  }

  return capturedArgs;
};

export const checkDetailedResponseFlags = (options?: SpanOptions) => {
  return (
    options?.captureResponseBody !== undefined ||
    options?.captureResponseHeaders !== undefined ||
    options?.captureResponseStatusCode !== undefined
  );
};

export const getResponseInfo = (result: any, options?: SpanOptions) => {
  const capturedResult: Record<string, unknown> = {};

  if (options?.captureResponseBody !== false && result?.body)
    capturedResult.body = result.body;
  if (options?.captureResponseHeaders !== false && result?.headers)
    capturedResult.headers = result.headers;
  if (options?.captureResponseStatusCode !== false && result?.statusCode)
    capturedResult.statusCode = result.statusCode;

  if (!result?.body && !result?.headers && !result?.statusCode)
    capturedResult.data = result;

  return capturedResult;
};
