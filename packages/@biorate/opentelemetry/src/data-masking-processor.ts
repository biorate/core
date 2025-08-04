import { SimpleSpanProcessor, Span } from '@opentelemetry/sdk-trace-base';
import { mask } from '@biorate/masquerade';

export class DataMaskingProcessor extends SimpleSpanProcessor {
  public onEnd(span: Span) {
    const data = mask.processJSON({
      ...span.attributes,
      arguments: JSON.parse(<string>span.attributes.arguments),
      result: JSON.parse(<string>span.attributes.result),
    });
    Object.assign(span.attributes, {
      ...data,
      arguments: JSON.stringify(data.arguments),
      result: JSON.stringify(data.result),
    });
    super.onEnd(span);
  }
}
