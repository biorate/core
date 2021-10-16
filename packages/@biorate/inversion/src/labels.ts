import { create } from '@biorate/symbolic';
import { env } from '@biorate/tools';

const key = Symbol.for('@biorate/inversion.namespace');

if (!env.globalThis[key])
  env.globalThis[key] = { Types: create('Types'), Metadata: create('Metadata') };

export const Types = env.globalThis[key].Types;
export const Metadata = env.globalThis[key].Metadata;
