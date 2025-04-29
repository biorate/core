export const ValueObject = (Class: any) => (proto: any, name: string) => {
  Reflect.defineMetadata(Symbol(name), { Class, name }, proto);
};
