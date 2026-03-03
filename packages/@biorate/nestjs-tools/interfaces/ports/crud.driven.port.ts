export type CrudFindOneDrivenPort<E, I, T = unknown> = {
  findOne(id: I, transaction?: T): Promise<E>;
};

export type CrudFindManyDrivenPort<
  E,
  F = { offset: number; limit: number },
  R = { total: number; offset: number; limit: number; items: E[] },
  T = unknown,
> = {
  findMany(filter?: F, transaction?: T): Promise<R>;
};

export type CrudUpdateOneDrivenPort<E, I, D = E, T = unknown> = {
  updateOne(id: I, data: D, transaction?: T): Promise<E>;
};

export type CrudUpdateManyDrivenPort<E, C, D = E[], T = unknown> = {
  updateMany(criteria: C, data: D, transaction?: T): Promise<E[]>;
};

export type CrudInsertOneDrivenPort<E, T = unknown> = {
  insertOne(data: E, transaction?: T): Promise<E>;
};

export type CrudInsertManyDrivenPort<E, R = E[], T = unknown> = {
  insertMany(items: E[], transaction?: T): Promise<R>;
};

export type CrudDeleteOneDrivenPort<I, R = boolean, T = unknown> = {
  deleteOne(id: I, transaction?: T): Promise<R>;
};

export type CrudDeleteManyDrivenPort<CD, R = number, T = unknown> = {
  deleteMany(criteria?: CD, transaction?: T): Promise<R>;
};

export type CrudDrivenPort<
  Id,
  Entity,
  FindManyFilter,
  InsertManyResult,
  UpdateManyCriteria,
  DeleteCriteria,
  FindManyresult = Entity[],
  UpdateData = Entity,
  DeleteOneResult = boolean,
  DeleteManyResult = number,
  Transaction = unknown,
> = CrudFindOneDrivenPort<Entity, Id, Transaction> &
  CrudFindManyDrivenPort<Entity, FindManyFilter, FindManyresult, Transaction> &
  CrudUpdateOneDrivenPort<Entity, Id, UpdateData, Transaction> &
  CrudUpdateManyDrivenPort<Entity, UpdateManyCriteria, UpdateData[], Transaction> &
  CrudInsertOneDrivenPort<Entity, Transaction> &
  CrudInsertManyDrivenPort<Entity, InsertManyResult, Transaction> &
  CrudDeleteOneDrivenPort<Id, DeleteOneResult, Transaction> &
  CrudDeleteManyDrivenPort<DeleteCriteria, DeleteManyResult, Transaction>;
