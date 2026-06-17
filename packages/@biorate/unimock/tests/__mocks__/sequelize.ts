import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ISequelizeConnector } from '@biorate/sequelize';
import {
  SequelizeConnector as RawSequelizeConnector,
  Model,
  Table,
  Column,
  DataType,
} from '@biorate/sequelize';
import { Mockable } from '../../src';

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

@Mockable({ wrapStatics: true })
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

class RootSequelize extends Core() {
  @inject(SequelizeConnector) public connector: ISequelizeConnector;
}

class RootModelMock extends Core() {
  @inject(ModelMockConnector) public connector: ISequelizeConnector;
}

export async function setupSequelize() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge({
    Sequelize: [{ name: 'connection', options: { ...PG } }],
  });
  container.bind(SequelizeConnector).toSelf().inSingletonScope();
  container.bind(RootSequelize).toSelf().inSingletonScope();
  const root = container.get<RootSequelize>(RootSequelize);
  await root.$run();
  return root as { connector: ISequelizeConnector };
}

export async function setupModelMock() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge({
    SequelizeModel: [{ name: 'modelConn', options: { ...PG } }],
  });
  container.bind(ModelMockConnector).toSelf().inSingletonScope();
  container.bind(RootModelMock).toSelf().inSingletonScope();
  const root = container.get<RootModelMock>(RootModelMock);
  await root.$run();
  return root as { connector: ISequelizeConnector };
}

export function teardownSequelize() {
  for (const c of [SequelizeConnector]) {
    try {
      if (container.isBound(c)) container.unbind(c);
    } catch {
      /* ok */
    }
  }
  if (container.isBound(RootSequelize)) container.unbind(RootSequelize);
}

export function teardownModelMock() {
  for (const c of [ModelMockConnector]) if (container.isBound(c)) container.unbind(c);
  if (container.isBound(RootModelMock)) container.unbind(RootModelMock);
}
