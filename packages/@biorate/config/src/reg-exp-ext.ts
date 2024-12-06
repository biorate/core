export class RegExpExt extends RegExp {
  public valueOf() {
    return this.toString();
  }
}
