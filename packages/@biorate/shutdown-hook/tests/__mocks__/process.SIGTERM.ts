import { ShutdownHook } from '../../src';
import { timer } from '@biorate/tools';

ShutdownHook.subscribe(async (reason) => {
  await timer.wait(100);
  console.log(reason);
});

process.kill(process.pid, 'SIGTERM');
