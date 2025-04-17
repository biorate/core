export class Options extends Array<any> {
  public get first() {
    return this[0];
  }

  public get last() {
    return this[this.length - 1];
  }
}
