import { IDecorator } from './interfaces';
export * from './interfaces';

declare module '@biorate/lifecycled' {
  export function lifecycled(
    root: {},
    onInit?: (object: {}) => {},
    onKill?: (object: {}) => {},
  );
  export function init(): IDecorator;
  export function kill(): IDecorator;
  export function on(event: string): IDecorator;
}
