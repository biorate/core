/** @description In-memory bucket/object storage for MemoryMinioClient. */
export class MemoryMinioStore {
  readonly #buckets = new Map<string, Map<string, Buffer>>();

  public reset() {
    this.#buckets.clear();
  }

  public hasBucket(name: string) {
    return this.#buckets.has(name);
  }

  public createBucket(name: string) {
    if (!this.#buckets.has(name)) this.#buckets.set(name, new Map());
  }

  public deleteBucket(name: string) {
    this.#buckets.delete(name);
  }

  public putObject(bucket: string, object: string, data: Buffer) {
    const objects = this.#buckets.get(bucket);
    if (!objects) throw new Error(`Bucket [${bucket}] does not exist`);
    objects.set(object, data);
  }

  public getObject(bucket: string, object: string) {
    const objects = this.#buckets.get(bucket);
    if (!objects?.has(object)) throw new Error(`Object [${object}] does not exist`);
    return objects.get(object)!;
  }

  public deleteObjects(bucket: string, objects: string[]) {
    const bucketObjects = this.#buckets.get(bucket);
    if (!bucketObjects) return;
    for (const object of objects) bucketObjects.delete(object);
  }

  public listBuckets() {
    return [...this.#buckets.keys()].map((name) => ({ name }));
  }
}
