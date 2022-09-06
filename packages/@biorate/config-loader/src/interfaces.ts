export interface IConfigLoader {}

export interface IConfigLoaderItem {
  process(): Promise<void>;
}
