import { timer } from '@biorate/tools';
import { ShutdownHook } from '../../src';

ShutdownHook.subscribe(async (reason) => {
  await timer.wait(100);
  console.log(reason);
});

process.kill(process.pid, 'SIGINT');
