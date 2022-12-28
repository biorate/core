/**
 * @description Bit array class
 *
 * The BitArray class is for setting and extracting bits from a number.
 * It can be used, for example, for compact storage array of boolean values.
 *
 * ### Features:
 * - compact storage array of boolean values
 *
 * @example
 * ```
 * ```
 */
export class BitArray {
  /**
   * @description Max index value
   */
  static readonly #maxIndex = 30;
  /**
   * @description inner value storage
   */
  #value = 0;
  /**
   * @description Bit array class constructor
   */
  public constructor(value = 0) {
    this.#value = value;
  }
  /**
   * @description Get bits from value
   */
  public static bits(value: number) {
    let result = [];
    for (let i = 0; i < BitArray.#maxIndex; i++) if (value & (1 << i)) result.push(i);
    return result;
  }
  /**
   * @description Get bits array
   */
  public bits(value: number) {
    return BitArray.bits(value);
  }
  /**
   * @description Set bit
   */
  public set(index: number, offset = 0) {
    this.#checkIndex(index);
    this.#value = this.#value | (1 << (index + offset));
  }
  /**
   * @description Remove bit
   */
  public remove(index: number) {
    this.#checkIndex(index);
    if (this.#get(index)) this.#value = this.#value ^ (1 << index);
  }
  /**
   * @description Get bit
   */
  public get(index: number) {
    this.#checkIndex(index);
    return this.#get(index);
  }
  /**
   * @description Get value
   */
  public value(...bits: number[]) {
    let result = 0,
      i = 0;
    for (let bit of bits) {
      result = result | (this.get(bit) << i);
      ++i;
    }
    return result;
  }
  /**
   * @description Define value
   */
  public define(value: number) {
    this.#value = value;
  }
  /**
   * @description Clear all bites
   */
  public clear() {
    this.#value = 0;
  }
  /**
   * @description Format to binary string
   */
  public toBinary() {
    return this.#value.toString(2);
  }
  /**
   * @description Format to integer string
   */
  public toInt() {
    return this.#value;
  }
  /**
   * @description "valueOf" hook
   */
  public valueOf() {
    return this.toInt();
  }
  /**
   * @description Check index overflow
   */
  #checkIndex = (index: number) => {
    if (index > BitArray.#maxIndex) throw new Error("Index can't be more than 30"); //TODO: error!!
  };
  /**
   * @description Get index value
   */
  #get = (index: number) => (this.#value & (1 << index) ? 1 : 0);
}
