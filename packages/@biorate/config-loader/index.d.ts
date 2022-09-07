import { IConfig } from '@biorate/config';
import { IConfigLoader, ILoaderConstructor } from './src';

declare module '@biorate/config-loader' {
  export abstract class BaseConfigLoader implements IConfigLoader {
    /**
     * @description Config dependency
     */
    protected readonly config: IConfig;
    /**
     * @description List of loaders
     */
    protected abstract readonly loaders: ILoaderConstructor[];
    /**
     * @description Load loader
     */
    public load(Loader: ILoaderConstructor): Promise<void>;
    /**
     * @description Initialize
     */
    protected initialize(): Promise<void>;
  }
}
