import { readFileSync } from 'fs';
import { container, Core, inject, Types } from '@biorate/inversion';
import { Config, IConfig } from '@biorate/config';
import { path } from '@biorate/tools';
import { Masquerade, EmailMask, CardMask, PhoneMask } from '../../src';

export const text = readFileSync(
  path.create(process.cwd(), 'tests/__mocks__', 'fixture.txt'),
  'utf-8',
);

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;

  @inject(Types.Masquerade) public masquerade: Masquerade;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();

container.bind<Masquerade>(Types.Masquerade).to(Masquerade).inSingletonScope();

Masquerade.configure({ maskJSON2: { emailFields: ['email'] } });

// Masquerade.use(CardMask).use(PhoneMask).use(EmailMask);
Masquerade.use(PhoneMask);
