import { injectable, inject, init, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import {
  init as i18nInit,
  t as translate,
  use,
  TOptionsBase,
  Module,
  Newable,
  NewableModule,
} from 'i18next';

export * from 'i18next';

/**
 * @description
 * Translate function override, because of a typescript strange behavior
 */
export function t(key: any | any[], options?: TOptionsBase) {
  return translate(key, options);
}
/**
 * @description
 * Internationalization library
 *
 * @example
 * ```ts
 * import { inject, container, Core, Types } from '@biorate/inversion';
 * import { Config, IConfig } from '@biorate/config';
 * import { I18n as I18nCommon, t } from '@biorate/i18n';
 *
 * class I18n extends I18nCommon {
 *   protected options = {
 *     fallbackLng: 'ru',
 *     lng: 'ru',
 *     debug: false,
 *     resources: {
 *       ru: {
 *         translation: {
 *           'Привет мир': 'Привет мир!',
 *         },
 *       },
 *       en: {
 *         translation: {
 *           'Привет мир': 'Hello world!',
 *         },
 *       },
 *     },
 *   };
 * }
 *
 * export class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *   @inject(I18n) public i18n: I18n;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<I18n>(I18n).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   console.log(t`Привет мир`); // Привет мир!
 *   console.log(t(`Привет мир`, { lng: 'en' })); // Hello world!
 * })();
 * ```
 */
@injectable()
export abstract class I18n {
  @inject(Types.Config) public config: IConfig;

  protected abstract options: Record<string, unknown>;

  protected get middlewares(): (NewableModule<Module> | Newable<Module> | Module)[] {
    return [];
  }

  public get languages() {
    return this?.options?.supportedLngs ?? [];
  }

  @init() protected async initialize() {
    for (const middleware of this.middlewares) use(middleware);
    await i18nInit(this.options);
  }
}
