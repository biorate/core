import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { CorsBadOriginError } from './errors';

export function corsOriginHandler(
  origin: string,
  callback: (error: null | Error, origin: string) => void,
) {
  if (!origin) return callback(null, origin);
  const config = container.get<IConfig>(Types.Config);
  const regexp = new RegExp(
    config.get<string>(
      'allowedOrigin',
      config.get<string>('package.name').replace('-server', ''),
    ),
  );
  callback(regexp.test(origin) ? null : new CorsBadOriginError(origin), origin);
}
