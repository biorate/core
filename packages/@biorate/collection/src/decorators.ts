import { Props } from './symbols';
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

export function embed(Class) {
  return (target, field: string) => {
    Reflect.defineMetadata(Props.Class, Class, target, field);
  };
}

export function inject(Class) {
  return (target, field: string) => {
    target[field] = new Class();
  };
}

export function singletone() {
  return (Class) =>
    new Proxy(
      Class,
      new (class {
        #instance = null;
        construct(target: Function, argumentsList: ArrayLike<any>, newTarget?: Function) {
          return (
            this.#instance ??
            (this.#instance = Reflect.construct(target, argumentsList, newTarget))
          );
        }
      })(),
    );
}
