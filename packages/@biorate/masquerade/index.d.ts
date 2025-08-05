import type { JsonMask2Configs } from 'maskdata';
import { IMaskOptions, IMasqueradeConfig, MaskConstructor } from './interfaces';
import { CommonMask } from './src/common-mask';

declare module '@biorate/masquerade' {
  export class Masquerade {
    protected static config: IMasqueradeConfig | null;

    protected static maskers: Map<string, CommonMask>;

    public static get maskdataEnabled(): boolean;

    public static use<T extends CommonMask>(Mask: MaskConstructor<T>): Masquerade;

    public static unuse<T extends CommonMask>(Mask: MaskConstructor<T>): Masquerade;

    public static configure(config: IMasqueradeConfig | null): Masquerade;

    public static processJSON<T extends object>(data: T, options?: JsonMask2Configs): T;

    public static processString(data: string, options?: IMaskOptions): string;

    protected config: IConfig;

    protected initialize(): void;
  }
}
