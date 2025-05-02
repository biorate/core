export enum UserRoles {
  Basic = 1 << 0,
  Admin = 1 << 1,
}

export interface ILocalesDTO {
  lang: string;
  namespace: string;
}

export interface ClientProviderPort {
  getLang(lang: string, namespace: string): Record<string, string>;

  setLang(data: Record<string, string>, lang: string, namespace: string): void;
}

export interface MetricsProviderPort {
  get(): Promise<string>;
}
