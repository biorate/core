import { injectable as Injectable, Container, tagged, named } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { IMetadata, IService } from '../interfaces';
import { Metadata } from './labels';

// @ts-ignore
if (!global[Metadata.InversifyContainer]) {
  const container = new Container({ skipBaseClassChecks: true });
  // @ts-ignore
  global[Metadata.InversifyContainer] = {
    container,
    ...getDecorators(container),
  };
}
// @ts-ignore
export const container = global[Metadata.InversifyContainer].container;
const { lazyInject, lazyInjectNamed, lazyInjectTagged } =
  // @ts-ignore
  global[Metadata.InversifyContainer];

export function inject(service: IService) {
  return lazyInject(service);
}
inject.named = (service: IService, name: string) => {
  lazyInjectNamed(service, name);
  named(name);
};
inject.tagged = (service: IService, name: string, value: any) => {
  lazyInjectTagged(service, name, value);
  tagged(name, value);
};

export function injectable() {
  return (constructor: Object) => {
    Reflect.defineMetadata(Metadata.Module, true, constructor);
    return Injectable()(constructor);
  };
}

export function addMetadata(
  key: string | symbol,
  value: any,
  field: any,
  constructor: Object,
  containerKey = Metadata.Metadata,
) {
  let items = Reflect.getOwnMetadata(containerKey, constructor);
  if (!items) items = new Set<IMetadata>();
  items.add({ key, value, field, constructor });
  Reflect.defineMetadata(containerKey, items, constructor);
}
