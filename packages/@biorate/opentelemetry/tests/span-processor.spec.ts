import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  BasicTracerProvider,
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import {
  CARD,
  CARD_MASKED,
  PHONE,
  PHONE_MASKED,
  makeSpan,
  makeDelegate,
  makeExporter,
  clearAttrMaxLength,
  restoreAttrMaxLength,
  setSpanProcessorMode,
  restoreSpanProcessorMode,
} from './__mocks__/span-processor';
import { truncateAttributes, DataMaskingProcessor } from '../src/data-masking-processor';
import { resolveSpanProcessorMode } from '../src/utils';

describe('@biorate/opentelemetry / data-masking-processor', () => {
  beforeEach(clearAttrMaxLength);

  afterEach(restoreAttrMaxLength);

  describe('truncateAttributes', () => {
    it('should truncate strings longer than the default cap of 2048', () => {
      const attributes = { long: 'x'.repeat(3000) };
      const result = truncateAttributes(attributes);
      expect(result.long).toHaveLength(2048);
    });

    it('should respect OTEL_SPAN_ATTR_MAX_LENGTH env', () => {
      process.env.OTEL_SPAN_ATTR_MAX_LENGTH = '10';
      const result = truncateAttributes({ long: 'x'.repeat(100) });
      expect(result.long).toHaveLength(10);
    });

    it('should fall back to the default cap on invalid env', () => {
      process.env.OTEL_SPAN_ATTR_MAX_LENGTH = 'abc';
      const result = truncateAttributes({ long: 'x'.repeat(3000) });
      expect(result.long).toHaveLength(2048);
    });

    it('should leave strings shorter than the cap unchanged', () => {
      const result = truncateAttributes({ short: 'hello' });
      expect(result.short).toBe('hello');
    });

    it('should accept non-primitive attribute objects without casts (consumer scenario)', () => {
      const result = truncateAttributes(
        <never>{ num: 1, obj: { a: 1 }, long: 'x'.repeat(30) },
        10,
      );
      expect(result.num).toBe(1);
      expect(result.obj).toEqual({ a: 1 });
      expect(result.long).toHaveLength(10);
    });

    it('should not touch non-string attributes', () => {
      const attributes = { num: 42, obj: { a: 1 }, long: 'x'.repeat(3000) };
      const result = truncateAttributes(<never>attributes);
      expect(result.num).toBe(42);
      expect(result.obj).toEqual({ a: 1 });
      expect(result.long).toHaveLength(2048);
    });
  });

  describe('DataMaskingProcessor', () => {
    it('should mask phone and card attributes in onEnd', () => {
      const delegate = makeDelegate();
      const processor = new DataMaskingProcessor(delegate);
      const span = makeSpan({ phone: PHONE, card: CARD });

      processor.onEnd(span);

      expect(delegate.onEnd).toHaveBeenCalledOnce();
      expect(span.attributes.phone).toBe(PHONE_MASKED);
      expect(span.attributes.card).toBe(CARD_MASKED);
    });

    it('should mask before truncating long attributes', () => {
      process.env.OTEL_SPAN_ATTR_MAX_LENGTH = '2048';
      const delegate = makeDelegate();
      const processor = new DataMaskingProcessor(delegate);
      const long = `${CARD} ${'x'.repeat(3000)}`;
      const span = makeSpan({ long });

      processor.onEnd(span);

      const value = span.attributes.long as string;
      expect(value).toHaveLength(2048);
      expect(value.startsWith(CARD_MASKED)).toBe(true);
      expect(value).not.toContain('4500543532132323');
      expect(value).not.toContain(CARD);
    });

    it('should proxy onStart, shutdown and forceFlush to the delegate', async () => {
      const delegate = makeDelegate();
      const processor = new DataMaskingProcessor(delegate);
      const span = makeSpan({});

      processor.onStart(span as never, {} as never);
      await processor.shutdown();
      await processor.forceFlush();

      expect(delegate.onStart).toHaveBeenCalledWith(span, {});
      expect(delegate.shutdown).toHaveBeenCalledTimes(1);
      expect(delegate.forceFlush).toHaveBeenCalledTimes(1);
      expect(delegate.onEnd).not.toHaveBeenCalled();
    });
  });

  describe('span processor modes via sdk-trace-base', () => {
    let exporter: ReturnType<typeof makeExporter>;

    beforeEach(() => {
      exporter = makeExporter();
    });

    it('SimpleSpanProcessor mode should export synchronously after span.end()', () => {
      const provider = new BasicTracerProvider({
        spanProcessors: [new DataMaskingProcessor(new SimpleSpanProcessor(exporter))],
      });
      const tracer = provider.getTracer('test');
      const span = tracer.startSpan('simple-mode');
      span.setAttribute('card', CARD);
      span.end();

      expect(exporter.exported).toHaveLength(1);
      expect(exporter.exported[0].attributes.card).toBe(CARD_MASKED);
      provider.shutdown().catch(() => {});
    });

    it('BatchSpanProcessor mode should export only after forceFlush', async () => {
      const processor = new DataMaskingProcessor(new BatchSpanProcessor(exporter));
      const provider = new BasicTracerProvider({ spanProcessors: [processor] });
      const tracer = provider.getTracer('test');
      const span = tracer.startSpan('batch-mode');
      span.setAttribute('card', CARD);
      span.setAttribute('long', 'y'.repeat(3000));
      span.end();

      expect(exporter.exported).toHaveLength(0);

      await processor.forceFlush();

      expect(exporter.exported).toHaveLength(1);
      const attributes = exporter.exported[0].attributes;
      expect(attributes.card).toBe(CARD_MASKED);
      expect(attributes.long).toHaveLength(2048);
      await provider.shutdown().catch(() => {});
    });
  });

  describe('resolveSpanProcessorMode', () => {
    afterEach(restoreSpanProcessorMode);

    it('should resolve valid modes as-is', () => {
      setSpanProcessorMode('batch');
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('batch');
      setSpanProcessorMode('simple');
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('simple');
      setSpanProcessorMode('console');
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('console');
    });

    it('should normalise case and surrounding whitespace', () => {
      setSpanProcessorMode('SIMPLE');
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('simple');
      setSpanProcessorMode(' batch ');
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('batch');
      setSpanProcessorMode('Console');
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('console');
    });

    it('should fall back to batch on undefined, empty or unknown values', () => {
      setSpanProcessorMode(undefined);
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('batch');
      setSpanProcessorMode('');
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('batch');
      setSpanProcessorMode('garbage');
      expect(resolveSpanProcessorMode(process.env.OTEL_SPAN_PROCESSOR)).toBe('batch');
    });
  });
});
