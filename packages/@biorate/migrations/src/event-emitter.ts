import { EventEmitter as EventEmitterBase } from 'events';

/** Public subclass so declaration emit avoids TS4020 (private `EventEmitterOptions` in `Core(EventEmitter)`). */
export class EmitterEmitter extends EventEmitterBase {}
