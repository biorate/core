import * as React from 'react';
import { Store } from './store';

export abstract class Component extends React.Component {
  public props: { store: Store };

  public abstract render();

  protected get store() {
    return this.props.store;
  }
}
