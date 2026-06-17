import '../src/vitest/setup';
import { container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';

if (!container.isBound(Types.Config))
  container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
