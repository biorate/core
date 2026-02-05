import { ShutdownHook } from '../../src/index.ts';

ShutdownHook.subscribe((reason) => {
  console.log(reason);
});

process.exit();
