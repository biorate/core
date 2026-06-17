import {
  SequelizeConnector as RawSequelizeConnector,
  Model,
  Table,
  Column,
  DataType,
} from '@biorate/sequelize';
import { Mockable, SEQUELIZE_STATICS } from '../../src';
import { createMockSetup } from './helpers';

export const PG = {
  logging: false,
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
};

export const DDL =
  'CREATE TABLE IF NOT EXISTS mock_models (id INTEGER PRIMARY KEY, title TEXT, value INTEGER)';
export const DML = "INSERT INTO mock_models (id, title, value) VALUES (1, 'test', 42)";
export const SELECT = 'SELECT * FROM mock_models ORDER BY id';
export const SELECT_MODEL = 'SELECT * FROM mock_models WHERE id = 10 ORDER BY id';

@Mockable({ statics: [SEQUELIZE_STATICS] })
@Table({ tableName: 'mock_models', timestamps: false })
export class TestModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  id: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.INTEGER)
  value: number;
}

@Mockable({})
export class SequelizeConnector extends RawSequelizeConnector {
  protected readonly models = { connection: [TestModel] };
}

@Mockable({})
export class ModelMockConnector extends RawSequelizeConnector {
  protected readonly namespace: string = 'SequelizeModel';
  protected readonly models = { modelConn: [TestModel] };
}

const sequelizeSetup = createMockSetup(SequelizeConnector, {
  Sequelize: [{ name: 'connection', options: { ...PG } }],
});

const modelMockSetup = createMockSetup(ModelMockConnector, {
  SequelizeModel: [{ name: 'modelConn', options: { ...PG } }],
});

export const setupSequelize = sequelizeSetup.setup;
export const teardownSequelize = sequelizeSetup.teardown;
export const setupModelMock = modelMockSetup.setup;
export const teardownModelMock = modelMockSetup.teardown;
