import { injectable, init } from '@biorate/inversion';
import { init as i18nInit, t as translate, use, Module, TOptionsBase } from 'i18next';

export * from 'i18next';

export function t(key: any | any[], options?: TOptionsBase) {
  return translate(key, options);
}
/**
 * @description
 * Internationalization library
 *
 * @example
 * ```ts
 * import { inject, container, Core } from '@biorate/inversion';
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
 *   @inject(I18n) public i18n: I18n;
 * }
 *
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
  protected abstract options: Record<string, unknown>;

  protected get middlewares(): Module[] {
    return [];
  }

  @init() protected async initialize() {
    for (const middleware of this.middlewares) use(middleware);
    await i18nInit(this.options);
  }
}
