import { IEventLike } from '../interfaces';
/**
 * @description load data file into memory
 */
export function load(stream: IEventLike): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    stream
      .on('data', (chunk: Buffer) => (buffer = Buffer.concat([buffer, chunk])))
      .on('error', (e: Error) => reject(e))
      .on('end', () => resolve(buffer));
  });
}
