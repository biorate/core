import { PropertiesOnly } from './src/interfaces';

declare module '@biorate/auto-object' {
  export abstract class AutoObject<T = Record<string, unknown>> {
    public constructor(data: PropertiesOnly<T>);
  }

  export { Getter, Setter, PropertiesOnly } from './src/interfaces';
}
