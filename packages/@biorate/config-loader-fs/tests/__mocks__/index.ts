import { tmpdir } from 'os';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { path } from '@biorate/tools';
import { ConfigLoaderFs } from '../../src';

export const key = 'test';
export const value = 'Hello world!';
export const tmpDir = tmpdir();
export const tmpFile = path.create(tmpDir, 'config.tmp.json');

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoaderFs) public configLoaderFs: ConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<ConfigLoader>(Types.ConfigLoaderFs)
  .to(ConfigLoaderFs.root(__dirname))
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({ tmpDir });

export const root = container.get<Root>(Root);
