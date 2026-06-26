import traverse from 'traverse';
import stringify from 'json-stringify-safe';
import { isMatch } from 'micromatch';

const SEP = '/';

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

/** @description Removes fields from a deep-cloned copy of data that match the given JSON path patterns. */
export function filterByPaths<T>(data: T, root: string, patterns: string[]): T {
  if (data === null || data === undefined) return data;
  const prefix = root + '.';
  const relevant = patterns
    .filter((p) => p.startsWith(prefix))
    .map((p) => p.slice(prefix.length).split('.'));
  if (!relevant.length) return data;
  let clone: any;
  try {
    clone = JSON.parse(JSON.stringify(data));
  } catch {
    return data;
  }
  return traverse(clone).map(function (value: any) {
    if (this.isRoot) return;
    if (relevant.some((pattern) => isMatch(this.path.join(SEP), pattern.join(SEP))))
      this.remove();
  });
}

/** @description Serializes data for a span attribute, applying exclude patterns if provided. */
export function attrStringify(attr: string, data: unknown, exclude?: string[]) {
  if (!exclude) return stringify(data);
  if (exclude.includes(attr)) return;
  return stringify(filterByPaths(data, attr, exclude));
}
