/**
 * DateUtils helper class.
 *
 * This class provides helper methods for working with dates.
 *
 * @class
 * @abstract
 */
export class DateUtils {
  /**
   * Get the date.
   *
   * @static
   * @type {Date}
   * @example
   * const date = DateUtils.getDate();
   * console.log(date); // e.g., 2021-09-01T00:00:00.000Z
   */
  static getDate(date?: Date | string | number): Date {
    if (date !== undefined) {
      return new Date(date);
    }

    return new Date();
  }
}
