export function isAccessor(object: any, field: string) {
  const descriptor = Object.getOwnPropertyDescriptor(object, field);
  if (!descriptor) return false;
  return 'get' in descriptor || 'set' in descriptor;
}

export function walkProto(object: any, callback = (object: any) => {}) {
  while (object) {
    object = Object.getPrototypeOf(object);
    if (!object || !('constructor' in object) || object.constructor === Object) break;
    callback(object);
  }
}

export function kSort(object: Record<string, any>) {
  return Object.keys(object)
    .sort()
    .reduce((memo, item) => ((memo[item] = object[item]), memo), {});
}
