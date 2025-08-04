import type { JsonMask2Configs } from 'maskdata';

declare module '@biorate/masquerade' {
  // Объявление класса внутри модуля
  class Mask {
    protected config?: JsonMask2Configs;

    /**
     * Проверяет, включена ли маскировка
     */
    readonly enabled: boolean;

    /**
     * Настраивает параметры маскировки
     * @param config Конфигурация маскировки
     */
    configure(config: JsonMask2Configs): void;

    /**
     * Применяет маскировку к данным
     * @param data Объект для маскировки
     * @returns Маскированный объект
     */
    processJSON<T extends object>(data: T): T;
  }

  // Экспорт экземпляра mask
  export const mask: Mask;

  // Реэкспорт ВСЕХ экспортов из maskdata
  export * from 'maskdata';
}
