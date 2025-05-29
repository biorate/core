import { Expose, Transform } from 'class-transformer';

export const Default =
  <T = any>(value: T) =>
  (target: any, propertyName: string) => {
    Expose()(target, propertyName);
    Transform(({ obj }) => obj[propertyName] ?? value)(target, propertyName);
  };
