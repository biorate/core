import { ShutdownHook } from '../../src';

ShutdownHook.subscribe((reason) => {
  console.log(reason);
});

process.exit();
