import { BaseError } from '@biorate/errors';
import { Config } from '@biorate/config';

declare module '@biorate/file-config' {
  export class FileConfig extends Config {
    public static root(path: string): FileConfig;
  }
}
