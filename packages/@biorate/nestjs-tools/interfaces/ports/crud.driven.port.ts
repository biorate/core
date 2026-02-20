export type CrudCreateDrivenPort<E> = {
  create(data: E): Promise<E>;
};

export type CrudFindOneDrivenPort<E, I> = {
  findOne(id: I): Promise<E>;
};

export type CrudFindManyDrivenPort<
  E,
  F = { offset: number; limit: number },
  R = { total: number; offset: number; limit: number; items: E[] },
> = {
  findMany(filter?: F): Promise<R>;
};

export type CrudUpdateOneDrivenPort<E, I, D = E> = {
  updateOne(id: I, data: D): Promise<E>;
};

export type CrudUpdateManyDrivenPort<E, C, D = E[]> = {
  updateMany(criteria: C, data: D): Promise<E[]>;
};

export type CrudInsertOneDrivenPort<E> = {
  insertOne(data: E): Promise<E>;
};

export type CrudInsertManyDrivenPort<E, R = E[]> = {
  insertMany(items: E[]): Promise<R>;
};

export type CrudDeleteOneDrivenPort<I, R = boolean> = {
  deleteOne(id: I): Promise<R>;
};

export type CrudDeleteManyDrivenPort<CD, R = number> = {
  deleteMany(criteria?: CD): Promise<R>;
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
> = CrudCreateDrivenPort<Entity> &
  CrudFindOneDrivenPort<Entity, Id> &
  CrudFindManyDrivenPort<Entity, FindManyFilter, FindManyresult> &
  CrudUpdateOneDrivenPort<Entity, Id, UpdateData> &
  CrudUpdateManyDrivenPort<Entity, UpdateManyCriteria, UpdateData[]> &
  CrudInsertOneDrivenPort<Entity> &
  CrudInsertManyDrivenPort<Entity, InsertManyResult> &
  CrudDeleteOneDrivenPort<Id, DeleteOneResult> &
  CrudDeleteManyDrivenPort<DeleteCriteria, DeleteManyResult>;
