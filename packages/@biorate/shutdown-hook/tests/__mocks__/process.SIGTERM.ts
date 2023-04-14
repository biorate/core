import { ShutdownHook } from '../../src';
import { timer } from '@biorate/tools';

ShutdownHook.subscribe(async () => {
  await timer.wait(1000);
  console.log('done');
});

process.kill(process.pid, 'SIGTERM');
