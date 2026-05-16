/** @description Array subclass that collects intercepted request options. */
export class Options extends Array<any> {
  /** @description Returns the first (oldest) collected option. */
  public get first() {
    return this[0];
  }

  /** @description Returns the last (most recent) collected option. */
  public get last() {
    return this[this.length - 1];
  }
}
