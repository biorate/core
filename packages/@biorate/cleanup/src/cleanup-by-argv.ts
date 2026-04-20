import minimist from 'minimist';
import { ArgvEmptyListError } from './errors';
import { cleanup } from './cleanup';

const { _ } = minimist(process.argv.slice(2));

if (!_.length) throw new ArgvEmptyListError();

(async () => await cleanup(..._))();
