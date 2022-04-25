import { Severity, modelOptions, Prop } from '@typegoose/typegoose';

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: { collection: 'test', versionKey: false },
})
export class TestModel {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  age: number;
}
