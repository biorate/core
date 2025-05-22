export * from './ports';

export enum UserRoles {
  Basic = 1 << 0,
  Admin = 1 << 1,
}

export interface ILocalesDTO {
  lang: string;
  namespace: string;
}
