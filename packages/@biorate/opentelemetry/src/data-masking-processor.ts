import { SimpleSpanProcessor, Span } from '@opentelemetry/sdk-trace-base';
import { Masquerade } from '@biorate/masquerade';

export class DataMaskingProcessor extends SimpleSpanProcessor {
  public onEnd(span: Span) {
    const args = span.attributes.arguments;
    const result = span.attributes.result;
    Object.assign(span.attributes, {
      arguments: typeof args === 'string' ? Masquerade.processString(args) : args,
      result: typeof result === 'string' ? Masquerade.processString(result) : result,
    });
    if (!Masquerade.maskdataEnabled) return void super.onEnd(span);
    const data = Masquerade.processJSON({
      arguments: JSON.parse(<string>args),
      result: JSON.parse(<string>result),
    });
    Object.assign(span.attributes, {
      arguments: JSON.stringify(data.arguments),
      result: JSON.stringify(data.result),
    });
    super.onEnd(span);
  }
}
