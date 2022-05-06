import { Table, Column, Model, DataType } from '../../../src';

@Table({
  tableName: 'test',
  timestamps: false,
})
export class TestModel extends Model {
  @Column(DataType.CHAR)
  title: string;

  @Column(DataType.INTEGER)
  value: number;
}

