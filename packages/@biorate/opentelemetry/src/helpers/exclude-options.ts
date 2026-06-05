export const getRequestInfo = (args: any[], exclude?: string[]) => {
  if (!exclude || exclude.length === 0) return args;

  return args.map((arg) => filterExcludedFields(arg, exclude));
};

export const getResponseInfo = (result: any, exclude?: string[]) => {
  if (!exclude || exclude.length === 0) return result;

  return filterExcludedFields(result, exclude);
};

const filterExcludedFields = (data: any, exclude: string[]): any => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return data;

  const result: Record<string, unknown> = {};
  for (const key in data) {
    if (!exclude.includes(key)) {
      result[key] = data[key];
    }
  }
  return result;
};
