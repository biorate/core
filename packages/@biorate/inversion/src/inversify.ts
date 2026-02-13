import { injectable as Injectable, Container, tagged, named } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { InversionInjectionIsUndefinedError } from './errors';
import { IMetadata, IService } from '../interfaces';
import { Metadata } from './labels';

const globalThisLink = globalThis as unknown as Record<
  symbol,
  { container: Container } & ReturnType<typeof getDecorators>
>;

if (!globalThisLink[Metadata.InversifyContainer]) {
  const container = new Container({ skipBaseClassChecks: true });
  globalThisLink[Metadata.InversifyContainer] = {
    container,
    ...getDecorators(container),
  };
} else console.warn(`Warning! Multi version packages [@biorate/inversion] included!`);

export const container = globalThisLink[Metadata.InversifyContainer].container;

const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } =
  globalThisLink[Metadata.InversifyContainer];

export function inject(service: IService) {
  if (!service) throw new InversionInjectionIsUndefinedError();
  return lazyInject(service);
}

inject.multi = (service: IService) => {
  if (!service) throw new InversionInjectionIsUndefinedError();
  return lazyMultiInject(service);
};

inject.named = (service: IService, name: string) => {
  if (!service) throw new InversionInjectionIsUndefinedError();
  lazyInjectNamed(service, name);
  named(name);
};

inject.tagged = (service: IService, name: string, value: any) => {
  if (!service) throw new InversionInjectionIsUndefinedError();
  lazyInjectTagged(service, name, value);
  tagged(name, value);
};

export function injectable() {
  return (constructor: Record<any, any>) => {
    Reflect.defineMetadata(Metadata.Module, true, constructor);
    return Injectable()(constructor);
  };
}

export function addMetadata(
  key: string | symbol,
  value: any,
  field: any,
  constructor: Record<any, any>,
  containerKey = Metadata.Metadata,
) {
  let items = Reflect.getOwnMetadata(containerKey, constructor);
  if (!items) items = new Set<IMetadata>();
  items.add({ key, value, field, constructor });
  Reflect.defineMetadata(containerKey, items, constructor);
}
