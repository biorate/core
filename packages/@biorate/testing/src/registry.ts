import { ITestBindingRegistry } from './types';
import { Container, interfaces } from 'inversify';
import { container as globalContainer } from '@biorate/inversion';

/** @description Tracks bindings on the global Inversify container for test teardown. */
export class BindingRegistry implements ITestBindingRegistry {
  readonly #container: Container;
  readonly #bound = new Set<interfaces.ServiceIdentifier<unknown>>();
  readonly #ownsContainer: boolean;

  public constructor(useGlobalContainer = true) {
    this.#ownsContainer = !useGlobalContainer;
    this.#container = useGlobalContainer ? globalContainer : new Container({ skipBaseClassChecks: true });
  }

  public get container() {
    return this.#container;
  }

  public bind<T>(
    service: interfaces.ServiceIdentifier<T>,
    implementation: interfaces.Newable<T>,
  ) {
    if (this.#container.isBound(service)) this.#container.unbind(service);
    this.#container.bind(service).to(implementation).inSingletonScope();
    this.#bound.add(service);
  }

  public rebind<T>(
    service: interfaces.ServiceIdentifier<T>,
    implementation: interfaces.Newable<T>,
  ) {
    if (this.#container.isBound(service)) this.#container.unbind(service);
    this.#container.bind(service).to(implementation).inSingletonScope();
    this.#bound.add(service);
  }

  public dispose() {
    for (const service of [...this.#bound].reverse()) {
      if (this.#container.isBound(service)) this.#container.unbind(service);
    }
    this.#bound.clear();
    if (this.#ownsContainer) this.#container.unbindAll();
  }
}
