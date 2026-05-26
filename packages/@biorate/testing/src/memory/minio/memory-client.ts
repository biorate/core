import { Readable } from 'node:stream';
import { MemoryMinioStore } from './memory-store';

/** @description In-memory MinIO client with a minimal API for component tests. */
export class MemoryMinioClient {
  readonly store = new MemoryMinioStore();

  public async listBuckets() {
    return this.store.listBuckets();
  }

  public async makeBucket(name: string) {
    this.store.createBucket(name);
  }

  public async putObject(bucket: string, object: string, data: Buffer) {
    this.store.putObject(bucket, object, data);
  }

  public async getObject(bucket: string, object: string) {
    const buffer = this.store.getObject(bucket, object);
    return Readable.from(buffer);
  }

  public async removeObjects(bucket: string, objects: string[]) {
    this.store.deleteObjects(bucket, objects);
  }

  public async removeBucket(name: string) {
    this.store.deleteBucket(name);
  }
}
