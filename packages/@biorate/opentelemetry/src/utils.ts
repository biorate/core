export const copyMetadata = (original: any, current: any): void => {
  Reflect.getMetadataKeys(original).forEach((metadataKey) => {
    Reflect.defineMetadata(
      metadataKey,
      Reflect.getMetadata(metadataKey, original),
      current,
    );
  });
};
