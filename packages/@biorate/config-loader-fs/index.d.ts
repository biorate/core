import { ConfigLoader } from '@biorate/config-loader';

declare module '@biorate/config-loader-fs' {
  export class ConfigLoaderFs extends ConfigLoader {
    /**
     * @description Root path
     */
    private static rootPath: string;
    /**
     * @description Change application root method (process.cwd() by default)
     */
    public static root(path: string): ConfigLoaderFs;
    /**
     * @description Load file
     */
    protected load(file: string, namespace?: string): Promise<void>;
    /**
     * @description Initialize
     */
    protected initialize(): Promise<void>;
  }
}
