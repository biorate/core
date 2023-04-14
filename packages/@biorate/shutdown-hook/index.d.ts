import { IHook } from './src/interfaces';

declare module '@biorate/shutdown-hook' {
  export class ShutdownHook {
    public static subscribe(callback: IHook): ShutdownHook;

    public static unsubscribe(callback: IHook): ShutdownHook;
  }
}
