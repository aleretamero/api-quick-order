import { randomBytes } from 'node:crypto';

/**
 * CodeUtils helper class.
 *
 * This class provides helper methods for generating codes.
 *
 * @class
 * @abstract
 */
export abstract class CodeUtils {
  /**
   * Generates a random hexadecimal string.
   *
   * @static
   * @param {number} [length=8] - Length of the hex string. Defaults to 8 characters.
   * @returns {string} Generated hex string in uppercase.
   * @example
   * const hexCode = CodeUtils.generateHex(8);
   * console.log(hexCode); // e.g., "A1B2C3D4"
   */
  static generateHex(length: number = 8): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
      .toUpperCase();
  }

  /**
   * Generates a random numeric string.
   *
   * @static
   * @param {number} [length=8] - Length of the numeric string. Defaults to 8 characters.
   * @returns {string} Generated numeric string.
   * @example
   * const numericCode = CodeUtils.generateNumeric(8);
   * console.log(numericCode); // e.g., "12345678"
   */
  static generateNumeric(length: number = 8): string {
    let result = '';

    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }

    return result;
  }
}
