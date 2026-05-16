/** @description ConfigLoaderVault actions enum. */
export enum ConfigLoaderVaultActions {
  Merge = 'merge',
  Download = 'download',
}

/** @description ConfigLoaderVault option type. */
export type IConfigLoaderVaultOption = {
  action: ConfigLoaderVaultActions.Merge;
  path: string;
  connection: string;
  cache?: boolean;
  directory?: string;
  required?: boolean;
};
