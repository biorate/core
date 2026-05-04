import getDecorators from 'inversify-inject-decorators';
import { InversionInjectionIsUndefinedError } from './errors';
import { IMetadata, IService } from '../interfaces';
import { Metadata } from './labels';

// Inversify v8 is ESM; keep this package CJS-friendly by loading at runtime.
// (Node can `require()` inversify; TypeScript CJS+node16 otherwise errors on static imports.)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const inversify = require('inversify') as any;
const { injectable: Injectable, Container, tagged, named } = inversify;

export type ContainerLike = {
  get<T = unknown>(serviceIdentifier: IService | object): T;
  getAll<T = unknown>(serviceIdentifier: IService | object): T[];
  bind<T = unknown>(serviceIdentifier: IService | object): any;
  rebind<T = unknown>(serviceIdentifier: IService | object): any;
  isBound(serviceIdentifier: IService | object): boolean;
};

const globalThisLink = globalThis as unknown as Record<
  symbol,
  { container: any } & ReturnType<typeof getDecorators>
>;

if (!globalThisLink[Metadata.InversifyContainer]) {
  const container = new Container();
  globalThisLink[Metadata.InversifyContainer] = {
    container,
    ...getDecorators(container),
  };
} else console.warn(`Warning! Multi version packages [@biorate/inversion] included!`);

export const container: ContainerLike =
  globalThisLink[Metadata.InversifyContainer].container;

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
  return <T extends abstract new (...args: any[]) => any>(constructor: T) => {
    Reflect.defineMetadata(Metadata.Module, true, constructor);
    return Injectable()(constructor) as T;
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
