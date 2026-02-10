import { SimpleSpanProcessor, Span } from '@opentelemetry/sdk-trace-base';
import { Masquerade } from '@biorate/masquerade';

export class DataMaskingProcessor extends SimpleSpanProcessor {
  public onEnd(span: Span) {
    for (const field in span.attributes)
      if (typeof span.attributes[field] === 'string')
        span.attributes[field] = Masquerade.processString(span.attributes[field]);
    if (Masquerade.maskdataEnabled) {
      const args: Record<string, unknown> = JSON.parse(<string>span.attributes.arguments);
      const res: Record<string, unknown> = JSON.parse(<string>span.attributes.result);
      const json = { ...span.attributes, arguments: args, result: res };
      const attr = Masquerade.processJSON(json);
      const attributes = {
        ...attr,
        arguments: JSON.stringify(attr.arguments),
        result: JSON.stringify(attr.result),
      };
      Object.assign(span.attributes, attributes);
    }
    super.onEnd(span);
  }
}
