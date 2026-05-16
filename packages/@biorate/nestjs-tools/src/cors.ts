import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { CorsBadOriginError } from './errors';

/**
 * @description
 * CORS origin validation handler. In non-debug environments, the origin must match
 * the `ALLOWED_ORIGIN` config regexp (defaults to the package name without `-server`).
 *
 * @example
 * ```ts
 * import { corsOriginHandler } from '@biorate/nestjs-tools';
 *
 * app.enableCors({ origin: corsOriginHandler });
 * ```
 */
export function corsOriginHandler(
  origin: string,
  callback: (error: null | Error, origin: string) => void,
) {
  if (!origin) return callback(null, origin);
  const config = container.get<IConfig>(Types.Config);
  if (config.get<string>('ENV') === 'debug') return callback(null, origin);
  const regexp = new RegExp(
    config.get<string>(
      'ALLOWED_ORIGIN',
      config.get<string>('package.name').replace('-server', ''),
    ),
  );
  callback(regexp.test(origin) ? null : new CorsBadOriginError(origin), origin);
}
