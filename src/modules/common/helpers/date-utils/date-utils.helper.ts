/**
 * DateUtils
 *
 * A utility class to work with dates.
 *
 * @class DateUtils
 * @abstract
 *
 */
export abstract class DateUtils {
  /**
   * Returns the current date and time.
   *
   * @static
   * @returns {Date} The current date and time.
   *
   * @example
   * const now = DateUtils.now();
   * console.log(now); // 2021-07-01T12:00:00.000Z
   */
  static now(): Date {
    return new Date();
  }
}
