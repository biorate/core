import { injectable as Injectable, Container, tagged, named } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { IMetadata } from '../interfaces';
import { Metadata } from './labels';

if (!global[Metadata.InversifyContainer]) {
  const container = new Container({ skipBaseClassChecks: true });
  global[Metadata.InversifyContainer] = {
    container,
    ...getDecorators(container),
  };
}
export const container = global[Metadata.InversifyContainer].container;
const { lazyInject, lazyInjectNamed, lazyInjectTagged } =
  global[Metadata.InversifyContainer];

export function inject(service) {
  return lazyInject(service);
}
inject.named = (service, name) => {
  lazyInjectNamed(service, name);
  named(name);
};
inject.tagged = (service, name, value) => {
  lazyInjectTagged(service, name, value);
  tagged(name, value);
};

export function injectable() {
  return (constructor) => {
    Reflect.defineMetadata(Metadata.Module, true, constructor);
    return Injectable()(constructor);
  };
}

export function addMetadata(
  key,
  value,
  field,
  constructor,
  containerKey = Metadata.Metadata,
) {
  let items = Reflect.getOwnMetadata(containerKey, constructor);
  if (!items) items = new Set<IMetadata>();
  items.add({ key, value, field, constructor });
  Reflect.defineMetadata(containerKey, items, constructor);
}
