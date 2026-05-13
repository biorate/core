import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register(pathToFileURL('./hook.mjs', import.meta.url));
