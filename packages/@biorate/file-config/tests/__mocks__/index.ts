import { Core, injectable, inject, container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { FileConfig } from '../..';

@injectable()
class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
}

container.bind<IConfig>(Types.Config).to(FileConfig.root(__dirname)).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

export const root = container.get(Root);
