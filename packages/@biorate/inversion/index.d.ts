import { IService } from './interfaces';
import { IDecorator } from '@biorate/lifecycled';
export * from './interfaces';

type ServiceId = IService | object;

export interface ContainerLike {
  get<T = unknown>(serviceIdentifier: ServiceId): T;
  getAll<T = unknown>(serviceIdentifier: ServiceId): T[];
  bind<T = unknown>(serviceIdentifier: ServiceId): any;
  rebind<T = unknown>(serviceIdentifier: ServiceId): any;
  isBound(serviceIdentifier: ServiceId): boolean;
}

declare module '@biorate/inversion' {
  export { init, kill, on } from '@biorate/lifecycled';

  export function Core<T extends new (...any: any[]) => any>(Class?: T): T;

  export function injectable(): IDecorator;

  export function factory(
    Type: Object,
    Child: Object,
    Parent: Object,
    Root: Object,
  ): void;

  export type inject = ((service: IService) => IDecorator) & {
    named: (service: IService, name: string) => IDecorator;
    tagged: (service: IService, name: string, value: any) => IDecorator;
  };

  export type Types = { [key: string]: symbol };

  export const container: ContainerLike;
}
