export type IDecorator = (
  target: Object,
  key: string | symbol,
  descriptor?: PropertyDescriptor,
) => void;
