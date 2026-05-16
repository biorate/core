import minimist from 'minimist';
import { ArgvEmptyListError } from './errors';
import { cleanup } from './cleanup';

/**
 * @description CLI entrypoint — parses process.argv and runs cleanup on the provided paths.
 */

const { _ } = minimist(process.argv.slice(2));

if (!_.length) throw new ArgvEmptyListError();

(async () => await cleanup(..._))();
