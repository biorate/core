declare module '@biorate/opentelemetry' {
  export * from '@opentelemetry/api';

  export function scope(version?: string, name?: string): any;

  export function span(name?: string): any;
}
