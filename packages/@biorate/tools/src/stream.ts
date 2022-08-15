import { ReadStream } from 'fs';
/**
 * @description load data file into memory
 */
export function load(stream: ReadableStream | ReadStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    stream
      // @ts-ignore: fucking ts!
      .on('data', (chunk: Buffer) => (buffer = Buffer.concat([buffer, chunk])))
      .on('error', (e: Error) => reject(e))
      .on('end', () => resolve(buffer));
  });
}
