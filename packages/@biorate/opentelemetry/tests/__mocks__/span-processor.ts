import { vi } from 'vitest';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { Masquerade, CardMask, PhoneMask, EmailMask } from '@biorate/masquerade';

export const CARD = '4500-5435-3213-2323';
export const CARD_MASKED = '4500-54**-****-2323';
export const PHONE = '+79991231213';
export const PHONE_MASKED = '+*******1213';

Masquerade.configure({
  maskJSON2: {
    emailFields: ['email'],
  },
});

Masquerade.use(EmailMask).use(PhoneMask).use(CardMask);

export const makeSpan = (attributes: Record<string, unknown>) =>
  ({
    attributes,
    name: 'test-span',
  } as unknown as ReadableSpan);

export const makeDelegate = () => ({
  onStart: vi.fn(),
  onEnd: vi.fn(),
  shutdown: vi.fn(async () => {}),
  forceFlush: vi.fn(async () => {}),
});

export const makeExporter = () => {
  const state = { exported: [] as ReadableSpan[] };
  const exporter = {
    exported: state.exported,
    export(spans: ReadableSpan[], cb: (result: { code: number }) => void) {
      state.exported.push(...spans);
      cb({ code: 0 });
    },
    async shutdown() {
      return;
    },
    async forceFlush() {
      return;
    },
  };
  return exporter as SpanExporter & { exported: ReadableSpan[] };
};

const originalMode = process.env.OTEL_SPAN_PROCESSOR;

export const setSpanProcessorMode = (value?: string) => {
  if (value === undefined) delete process.env.OTEL_SPAN_PROCESSOR;
  else process.env.OTEL_SPAN_PROCESSOR = value;
};

export const restoreSpanProcessorMode = () => {
  if (originalMode === undefined) delete process.env.OTEL_SPAN_PROCESSOR;
  else process.env.OTEL_SPAN_PROCESSOR = originalMode;
};

const originalLimit = process.env.OTEL_SPAN_ATTR_MAX_LENGTH;

export const clearAttrMaxLength = () => {
  delete process.env.OTEL_SPAN_ATTR_MAX_LENGTH;
};

export const restoreAttrMaxLength = () => {
  if (originalLimit === undefined) delete process.env.OTEL_SPAN_ATTR_MAX_LENGTH;
  else process.env.OTEL_SPAN_ATTR_MAX_LENGTH = originalLimit;
};
