import type { ISequelizeConfig, ISequelizeConnection } from '@biorate/sequelize';
import type { Model, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';

/**
 * @description Sequelize call interface
 */
export interface SequelizeCall {
  method: 'query' | 'define' | 'sync' | 'close' | 'transaction' | 'authenticate';
  args: any[];
  timestamp: number;
}

/**
 * @description Mock Model for Sequelize
 */
export interface MockModelType<T extends Model = Model> {
  findAll(options?: FindOptions): Promise<T[]>;
  findOne(options?: FindOptions): Promise<T | null>;
  findByPk(options?: any): Promise<T | null>;
  create(values: any, options?: CreateOptions): Promise<T>;
  update(values: any, options?: UpdateOptions): Promise<[number, T[]]>;
  destroy(options?: DestroyOptions): Promise<number>;
  sync(options?: any): Promise<any>;
  drop(options?: any): Promise<void>;
}

/**
 * @description Options for model response configuration
 */
export interface ModelResponseOptions {
  delay?: number;
  error?: Error;
}
