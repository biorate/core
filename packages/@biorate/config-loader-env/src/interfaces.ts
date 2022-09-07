import { IConfig } from '@biorate/config';

export interface IConfigLoader {
  load(Loader: ILoaderConstructor): Promise<void>;
}

export type ILoader = {
  process(config: IConfig): Promise<void>;
};

export interface ILoaderConstructor {
  new (): ILoader;
}
