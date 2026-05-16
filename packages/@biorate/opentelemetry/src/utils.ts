import traverse from 'traverse';

/** @description Copies all Reflect metadata keys from the original function to the current function. */
export const copyMetadata = (original: any, current: any): void => {
  Reflect.getMetadataKeys(original).forEach((metadataKey) => {
    Reflect.defineMetadata(
      metadataKey,
      Reflect.getMetadata(metadataKey, original),
      current,
    );
  });
};

/** @description Recursively traverses an object and attempts to parse string values as JSON. */
export function deepJsonParse(data: any) {
  return traverse(data).map(function (value: any) {
    if (typeof value === 'string') {
      try {
        this.update(JSON.parse(value));
      } catch {}
    }
  });
}
