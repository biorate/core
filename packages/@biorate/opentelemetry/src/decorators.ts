import { trace, SpanStatusCode, Tracer } from '@opentelemetry/api';
import { OTELUndefinedTracerError } from './errors';

const key = Symbol('tracer');

export const scope = (version?: string, name?: string) => (Class: any) => {
  const tracer = trace.getTracer(name ?? Class.name, version);
  Reflect.defineMetadata(key, tracer, Class);
  return Class;
};

export const span =
  (name?: string) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const tracer: Tracer = Reflect.getOwnMetadata(key, target.constructor);
      if (!tracer) throw new OTELUndefinedTracerError(target.constructor.name);
      return tracer.startActiveSpan(name ?? propertyKey, (span) => {
        try {
          span.setAttribute('class', target.constructor.name);
          span.setAttribute('method', propertyKey);
          span.setAttribute('arguments', JSON.stringify(args));
          const result = method.apply(this, args);
          if (result instanceof Promise)
            return result
              .then((result: unknown) => {
                span.setAttribute('result', JSON.stringify(result));
                return result;
              })
              .catch((e: unknown) => {
                span.recordException(<Error>e);
                span.setStatus({ code: SpanStatusCode.ERROR });
                throw e;
              })
              .finally(() => span.end());
          else span.setAttribute('result', JSON.stringify(result));
          return result;
        } catch (e) {
          span.recordException(<Error>e);
          span.setStatus({ code: SpanStatusCode.ERROR });
          throw e;
        } finally {
          span.end();
        }
      });
    };
  };
