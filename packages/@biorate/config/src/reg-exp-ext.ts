export class RegExpExt extends RegExp {
  public toJSON() {
    return `R{${this.toString().replace(/\\/g, '')}}`;
  }
}
