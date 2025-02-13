export enum ConfigLoaderVaultActions {
  Merge = 'merge',
  Download = 'download',
}

export type IConfigLoaderVaultOption = {
  action: ConfigLoaderVaultActions.Merge;
  path: string;
  connection: string;
  cache?: boolean;
  directory?: string;
  required?: boolean;
};
