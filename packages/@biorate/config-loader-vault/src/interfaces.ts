export enum ConfigLoaderVaultActions {
  Merge = 'merge',
  Download = 'download',
}

export type IConfigLoaderVaultOption = {
  action: ConfigLoaderVaultActions.Download | ConfigLoaderVaultActions.Merge;
  path: string;
  connection: string;
  cache?: boolean;
};
