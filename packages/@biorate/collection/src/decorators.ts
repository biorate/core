import { Props } from './symbols';
import { ICollection } from '../interfaces';
import { observable as o, action as a, computed as c } from 'mobx';

export function observable() {
  return (target, field, ...args) => o(target, field, ...args);
}

export function action() {
  return (target, field, descriptor) => a(target, field, descriptor);
}

export function computed() {
  return (target, field, descriptor) => c(target, field, descriptor);
}

export function embed(type: any) {
  return (target, field: string) => {
    Reflect.defineMetadata(Props.Class, type, target, field);
  };
}

export function inject(Class: ICollection.Ctor) {
  return (target, field: string) => {
    target[field] = new Class();
  };
}

export function singletone() {
  return (Class: ICollection.Ctor) =>
    new Proxy(
      Class,
      new (class {
        #instance = null;
        construct(
          target: ICollection.Ctor,
          argumentsList: ArrayLike<any>,
          newTarget?: ICollection.Ctor,
        ) {
          return (
            this.#instance ??
            (this.#instance = Reflect.construct(target, argumentsList, newTarget))
          );
        }
      })(),
    );
}
