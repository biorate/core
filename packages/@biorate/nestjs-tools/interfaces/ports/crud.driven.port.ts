export type CrudCreateDrivenPort<E> = {
  create(data: E): E;
};

export type CrudFindOneDrivenPort<E, I> = {
  findOne(id: I): E;
};

export type CrudFindManyDrivenPort<
  E,
  F = { offset: number; limit: number },
  R = { total: number; offset: number; limit: number; items: E[] },
> = {
  findMany(filter?: F): R;
};

export type CrudUpdateOneDrivenPort<E, I, D = E> = {
  updateOne(id: I, data: D): E;
};

export type CrudUpdateManyDrivenPort<E, C, D = E[]> = {
  updateMany(criteria: C, data: D): E[];
};

export type CrudInsertOneDrivenPort<E> = {
  insertOne(data: E): E;
};

export type CrudInsertManyDrivenPort<E, R = E[]> = {
  insertOne(items: E[]): R;
};

export type CrudDeleteOneDrivenPort<I, R = boolean> = {
  deleteOne(id: I): R;
};

export type CrudDeleteManyDrivenPort<CD, R = number> = {
  deleteMany(criteria?: CD): R;
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
