export interface ClientProviderPort {
  getLang(lang: string, namespace: string): Record<string, string>;

  setLang(data: Record<string, string>, lang: string, namespace: string): void;
}
