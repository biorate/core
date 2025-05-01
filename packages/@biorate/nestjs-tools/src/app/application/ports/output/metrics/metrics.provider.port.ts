export interface MetricsProviderPort {
  get(): Promise<string>;
}
