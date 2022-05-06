import { promises as fs } from 'fs';
import { Core, inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import * as Migrations from './src/types';

declare module '@biorate/migrations' {
  export class Root extends Core() {
    public config: IConfig;
    public sequelize: Migrations.Sequelize;
    protected initialize(): Promise<void>;
  }

  export abstract class Migration {
    protected config: IConfig;
    protected get type(): string;
    protected scan(...args: string[]): Promise<string[]>;
    protected path(...args: string[]): string;
    protected log(...args: string[]): void;
    protected initialize(): Promise<void>;
    protected abstract process(): Promise<void>;
  }

  export class Sequelize extends Migration {
    protected process(): Promise<void>;
  }
}
