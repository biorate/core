/**
 * @description Extended RegExp class with custom JSON serialization in format R{/pattern/flags}
 * */
export class RegExpExt extends RegExp {
  /**
   * @description Serializes RegExp to config template format R{/pattern/flags}
   * */
  public toJSON() {
    return `R{${this.toString().replace(/\\/g, '')}}`;
  }
}
