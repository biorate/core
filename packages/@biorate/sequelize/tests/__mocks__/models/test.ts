import { Table, Column, Model, DataType } from '../../../src';

@Table({
  tableName: 'test',
  timestamps: false,
})
export class TestModel extends Model {
  @Column({ type: DataType.CHAR, primaryKey: true })
  title: string;

  @Column(DataType.INTEGER)
  value: number;
}
