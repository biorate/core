import { trace, SpanStatusCode, Tracer } from '@opentelemetry/api';
import { OTELUndefinedTracerError } from './errors';
import { copyMetadata, attrStringify } from './utils';

const key = Symbol('tracer');

/** @description Class decorator that assigns an OpenTelemetry tracer to a class via metadata. */
export const scope = (version?: string, name?: string) => (Class: any) => {
  const tracer = trace.getTracer(name ?? Class.name, version);
  Reflect.defineMetadata(key, tracer, Class);
  return Class;
};

/** @description Method decorator that wraps a method in an OpenTelemetry span with attributes for class, method, arguments, and result. */
export const span =
  (props?: { name?: string; spanKind?: string; exclude?: string[] }) =>
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
            const argsStr = attrStringify('arguments', args, props?.exclude);
            if (argsStr !== undefined) span.setAttribute('arguments', argsStr);
            span.setAttribute('SpanKind', props?.spanKind ?? 'SERVER');
            const result = method.apply(this, args);
            if (result instanceof Promise)
              return result
                .then((result: unknown) => {
                  const resultStr = attrStringify('result', result, props?.exclude);
                  if (resultStr !== undefined)
                    span.setAttribute('result', resultStr);
                  return result;
                })
                .catch((e: unknown) => {
                  span.recordException(<Error>e);
                  span.setStatus({ code: SpanStatusCode.ERROR });
                  throw e;
                })
                .finally(() => span.end());
            const resultStr = attrStringify('result', result, props?.exclude);
            if (resultStr !== undefined) span.setAttribute('result', resultStr);
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
