import stringify from 'json-stringify-safe';
import { trace, SpanStatusCode, Tracer, Span } from '@opentelemetry/api';
import { OTELUndefinedTracerError } from './errors';
import { copyMetadata } from './utils';
import { SpanOptions } from './types';
import {
  checkDetailedRequestFlags,
  checkDetailedResponseFlags,
  getRequestInfo,
  getResponseInfo,
} from './helpers';

const key = Symbol('tracer');

/** @description Class decorator that assigns an OpenTelemetry tracer to a class via metadata. */
export const scope = (version?: string, name?: string) => (Class: any) => {
  const tracer = trace.getTracer(name ?? Class.name, version);
  Reflect.defineMetadata(key, tracer, Class);
  return Class;
};

/** @description Method decorator that wraps a method in an OpenTelemetry span with attributes for class, method, arguments, and result. */
export const span =
  (props?: { name?: string; spanKind?: string; options?: SpanOptions }) =>
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
            setArgumentsWithOptions(span, props?.options, ...args);
            const result = method.apply(this, args);
            if (result instanceof Promise)
              return result
                .then((result: unknown) => {
                  setResultWithOptions(span, result, props?.options);
                  return result;
                })
                .catch((e: unknown) => {
                  span.recordException(<Error>e);
                  span.setStatus({ code: SpanStatusCode.ERROR });
                  throw e;
                })
                .finally(() => span.end());
            else {
              setResultWithOptions(span, result, props?.options);
              span.end();
            }
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
  const hasDetailedRequestFlags = checkDetailedRequestFlags(options);

  if (shouldCaptureRequest && !hasDetailedRequestFlags) {
    span.setAttribute('arguments', stringify(args));
  } else if (hasDetailedRequestFlags) {
    span.setAttribute('arguments', stringify(getRequestInfo(args, options)));
  }
};

const setResultWithOptions = (span: Span, result: any, options?: SpanOptions) => {
  const shouldCaptureResponse = options?.captureResponse !== false;
  const hasDetailedResultFlags = checkDetailedResponseFlags(options);

  if (shouldCaptureResponse && !hasDetailedResultFlags) {
    span.setAttribute('result', stringify(result));
  } else if (hasDetailedResultFlags) {
    span.setAttribute('result', stringify(getResponseInfo(result, options)));
  }
};
