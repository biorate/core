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

  public bind(service: unknown, implementation: unknown) {
    const id = service as interfaces.ServiceIdentifier<unknown>;
    const impl = implementation as interfaces.Newable<unknown>;
    if (this.#container.isBound(id)) this.#container.unbind(id);
    this.#container.bind(id).to(impl).inSingletonScope();
    this.#bound.add(id);
  }

  public rebind(service: unknown, implementation: unknown) {
    const id = service as interfaces.ServiceIdentifier<unknown>;
    const impl = implementation as interfaces.Newable<unknown>;
    if (this.#container.isBound(id)) this.#container.unbind(id);
    this.#container.bind(id).to(impl).inSingletonScope();
    this.#bound.add(id);
  }

  public dispose() {
    for (const service of [...this.#bound].reverse()) {
      if (this.#container.isBound(service)) this.#container.unbind(service);
    }
    this.#bound.clear();
    if (this.#ownsContainer) this.#container.unbindAll();
  }
}
