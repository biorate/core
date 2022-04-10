import { List } from '@biorate/collection';
import { Type } from 'avsc';

export class Schemas extends List<{
  id: number;
  schema: Type;
}> {
  protected get _keys() {
    return [['id']];
  }
}
