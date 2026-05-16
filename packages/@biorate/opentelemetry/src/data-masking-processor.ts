import { SimpleSpanProcessor, Span } from '@opentelemetry/sdk-trace-base';
import { Masquerade } from '@biorate/masquerade';
import { deepJsonParse } from './utils';

/** @description Span processor that masks sensitive data in span attributes before exporting. */
export class DataMaskingProcessor extends SimpleSpanProcessor {
  /** @description Masks sensitive data in span attributes and delegates to parent onEnd. */
  public onEnd(span: Span) {
    for (const field in span.attributes)
      if (typeof span.attributes[field] === 'string')
        span.attributes[field] = Masquerade.processString(span.attributes[field]);
    if (Masquerade.maskdataEnabled) {
      let attributes: Record<string, unknown> = deepJsonParse(span.attributes);
      attributes = Masquerade.processJSON(attributes);
      Object.assign(span.attributes, attributes);
    }
    super.onEnd(span);
  }
}
