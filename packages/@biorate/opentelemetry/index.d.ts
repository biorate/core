declare module '@biorate/opentelemetry' {
  export * from '@opentelemetry/api';

  export const scope = (version?: string, name?: string) => any;

  export const span = (name?: string) => any;
}
