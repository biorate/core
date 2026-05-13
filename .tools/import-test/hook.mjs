import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(__dirname, 'package.json'));
const lodashEsUrl = pathToFileURL(require.resolve('lodash-es'));

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'lodash') {
    return { url: lodashEsUrl.href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
