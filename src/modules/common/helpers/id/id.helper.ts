/**
 * ID
 *
 * A utility class to work with IDs.
 *
 * @class ID
 * @abstract
 *
 */
export abstract class ID {
  /**
   * Returns the generated ID.
   *
   * @static
   * @returns {string} The generated ID.
   *
   * @example
   * const id = ID.generate();
   * console.log(id); // 1a2b3c4d
   */
  static generate(): string {
    return Math.random().toString(36).slice(2);
  }
}
