import * as React from 'react';
import { Store } from './store';

export abstract class Component extends React.Component {
  props: { store: Store };

  protected get store() {
    return this.props.store;
  }

  public abstract render();
}
