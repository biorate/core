/**
 * @description Lazily registers `ts-node` (transpile-only) for TypeScript files —
 * the shared path used by `.hygen.ts` configs and `hooks.ts` action hook files,
 * keeping zero startup cost for non-TS inputs.
 * @param file - The file being loaded; only `.ts` triggers registration.
 * @param error - Error class thrown when `ts-node` cannot be registered
 * (the caller keeps its own taxonomy: `ConfigTsNodeError` / `HookTsNodeError`).
 * */
const registerTsNode = async (
  file: string,
  error: new (file: string, cause: unknown) => Error,
): Promise<void> => {
  if (!/\.ts$/.test(file)) return;
  try {
    await import('ts-node/register/transpile-only');
  } catch (cause) {
    throw new error(file, cause);
  }
};

export default registerTsNode;
