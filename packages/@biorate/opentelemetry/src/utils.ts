import traverse from 'traverse';

export const copyMetadata = (original: any, current: any): void => {
  Reflect.getMetadataKeys(original).forEach((metadataKey) => {
    Reflect.defineMetadata(
      metadataKey,
      Reflect.getMetadata(metadataKey, original),
      current,
    );
  });
};

export function deepJsonParse(data: any) {
  return traverse(data).map(function (value: any) {
    if (typeof value === 'string') {
      try {
        this.update(JSON.parse(value));
      } catch {}
    }
  });
}
