import stringify from 'json-stringify-safe';
import { trace, SpanStatusCode, Tracer, Span } from '@opentelemetry/api';
import { OTELUndefinedTracerError } from './errors';
import { copyMetadata } from './utils';

const key = Symbol('tracer');

type SpanOptions = {
  captureRequest?: boolean; // общий флаг для всех аргументов
  captureBody?: boolean;
  captureHeaders?: boolean;
  captureQuery?: boolean;
  captureParams?: boolean;
  captureCookies?: boolean;

  captureResponse?: boolean; // общий флаг для всего результата
  captureResponseBody?: boolean;
  captureResponseHeaders?: boolean;
  captureResponseStatusCode?: boolean;
};

/** @description Class decorator that assigns an OpenTelemetry tracer to a class via metadata. */
export const scope = (version?: string, name?: string) => (Class: any) => {
  const tracer = trace.getTracer(name ?? Class.name, version);
  Reflect.defineMetadata(key, tracer, Class);
  return Class;
};

/** @description Method decorator that wraps a method in an OpenTelemetry span with attributes for class, method, arguments, and result. */
export const span =
  (props?: { name?: string; spanKind?: string }, options?: SpanOptions) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    const obj = {
      [propertyKey]: function (...args: any[]) {
        const tracer: Tracer = Reflect.getOwnMetadata(key, target.constructor);
        if (!tracer) throw new OTELUndefinedTracerError(target.constructor.name);
        return tracer.startActiveSpan(props?.name ?? propertyKey, (span) => {
          try {
            span.setAttribute('class', target.constructor.name);
            span.setAttribute('method', propertyKey);
            span.setAttribute('SpanKind', props?.spanKind ?? 'SERVER');
            setArgumentsWithOptions(span, options, args);
            const result = method.apply(this, args);
            if (result instanceof Promise)
              return result
                .then((result: unknown) => {
                  setResultWithOptions(span, result, options);
                  return result;
                })
                .catch((e: unknown) => {
                  span.recordException(<Error>e);
                  span.setStatus({ code: SpanStatusCode.ERROR });
                  throw e;
                })
                .finally(() => span.end());
            else span.setAttribute('result', stringify(result));
            span.end();
            return result;
          } catch (e) {
            span.recordException(<Error>e);
            span.setStatus({ code: SpanStatusCode.ERROR });
            span.end();
            throw e;
          }
        });
      },
    };
    descriptor.value = obj[propertyKey];
    copyMetadata(method, descriptor.value);
  };

const setArgumentsWithOptions = (span: Span, options?: SpanOptions, ...args: any[]) => {
  const shouldCaptureRequest = options?.captureRequest !== false;
  const hasDetailedRequestFlags =
    options?.captureBody !== undefined ||
    options?.captureHeaders !== undefined ||
    options?.captureQuery !== undefined ||
    options?.captureParams !== undefined ||
    options?.captureCookies !== undefined;

  if (shouldCaptureRequest && !hasDetailedRequestFlags) {
    span.setAttribute('arguments', stringify(args));
  } else if (hasDetailedRequestFlags) {
    const capturedArgs: Record<string, unknown> = {};

    for (const arg of args) {
      if (options?.captureBody !== false && arg?.body) capturedArgs.body = arg.body;
      if (options?.captureHeaders !== false && arg?.headers)
        capturedArgs.headers = arg.headers;
      if (options?.captureQuery !== false && arg?.query) capturedArgs.query = arg.query;
      if (options?.captureParams !== false && arg?.params)
        capturedArgs.params = arg.params;
      if (options?.captureCookies !== false && arg?.cookies)
        capturedArgs.cookies = arg.cookies;

      if (!arg?.body && !arg?.headers && !arg?.query) capturedArgs.other = arg;
    }

    span.setAttribute('arguments', stringify(capturedArgs));
  }
};

const setResultWithOptions = (span: Span, result: any, options?: SpanOptions) => {
  const shouldCaptureResponse = options?.captureResponse !== false;
  const hasDetailedResultFlags =
    options?.captureResponseBody !== undefined ||
    options?.captureResponseHeaders !== undefined ||
    options?.captureResponseStatusCode !== undefined;

  if (shouldCaptureResponse && !hasDetailedResultFlags) {
    span.setAttribute('result', stringify(result));
  } else if (hasDetailedResultFlags) {
    const capturedResult: Record<string, unknown> = {};

    if (options?.captureResponseBody !== false && result?.body)
      capturedResult.body = result.body;
    if (options?.captureResponseHeaders !== false && result?.headers)
      capturedResult.headers = result.headers;
    if (options?.captureResponseStatusCode !== false && result?.statusCode)
      capturedResult.statusCode = result.statusCode;

    if (!result?.body && !result?.headers && !result?.statusCode)
      capturedResult.data = result;

    span.setAttribute('result', stringify(capturedResult));
  }
};
