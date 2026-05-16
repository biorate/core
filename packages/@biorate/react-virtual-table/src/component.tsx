import * as React from 'react';
import { Store } from './store';

/**
 * @description Base abstract component for table parts (header, content, footer, etc.).
 * Provides access to the Store via `this.store`.
 */
export abstract class Component extends React.Component<{ store: Store }, unknown> {
  public props: { store: Store };

  public abstract render();

  protected get store() {
    return this.props.store;
  }
}
