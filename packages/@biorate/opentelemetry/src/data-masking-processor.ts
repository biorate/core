import { SpanProcessor, Span, ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { Context } from '@opentelemetry/api';
import { Masquerade } from '@biorate/masquerade';
import { deepJsonParse, truncateAttributes } from './utils';

export { truncateAttributes } from './utils';

/** @description Span processor that masks sensitive data in span attributes before exporting. */
export class DataMaskingProcessor implements SpanProcessor {
  /** @description Wraps an inner span processor, applying masking and truncation on the way out. */
  public constructor(private readonly delegate: SpanProcessor) {}

  /** @description Delegates span start to the inner processor. */
  public onStart(span: Span, parentContext: Context) {
    this.delegate.onStart(span, parentContext);
  }

  /** @description Masks sensitive data, truncates long attributes, then delegates to the inner onEnd. */
  public onEnd(span: ReadableSpan) {
    for (const field in span.attributes)
      if (typeof span.attributes[field] === 'string')
        span.attributes[field] = Masquerade.processString(span.attributes[field]);
    if (Masquerade.maskdataEnabled) {
      let attributes: Record<string, unknown> = deepJsonParse(span.attributes);
      attributes = Masquerade.processJSON(attributes);
      Object.assign(span.attributes, attributes);
    }
    truncateAttributes(span.attributes);
    this.delegate.onEnd(span);
  }

  /** @description Delegates shutdown to the inner processor. */
  public shutdown() {
    return this.delegate.shutdown();
  }

  /** @description Delegates forceFlush to the inner processor. */
  public forceFlush() {
    return this.delegate.forceFlush();
  }
}
