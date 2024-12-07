import dayjs, { ManipulateType } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(dayOfYear);
dayjs.extend(weekOfYear);

/**
 * DateUtils class.
 *
 * This class contains utility methods for date manipulation.
 *
 * @class
 * @abstract
 */
export abstract class DateUtils {
  /**
   * Formats a date into a specified format and timezone.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {string} [format='YYYY-MM-DD'] - The desired format (default is 'YYYY-MM-DD').
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {string} The formatted date string.
   * @example
   * const formattedDate = DateUtils.format(new Date());
   * console.log(formattedDate); // e.g., "2023-12-31"
   *
   * const formattedDate = DateUtils.format('31/12/2023', 'DD/MM/YYYY');
   * console.log(formattedDate); // e.g., "2023-12-31"
   */
  static format(
    date: Date | string | number,
    format: string = 'YYYY-MM-DD',
    timezoneStr: string = 'UTC',
  ): string {
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/');
      date = `${year}-${month}-${day}`;
    }

    return dayjs(date).tz(timezoneStr).utc(true).format(format);
  }

  /**
   * Returns a date object.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The date object.
   * @example
   * const date = DateUtils.getDate('2023-12-31');
   * console.log(date); // e.g., "2023-12-31T00:00:00.000Z"
   */
  static getDate(
    date?: Date | string | number,
    timezoneStr: string = 'UTC',
  ): Date {
    return dayjs(date).tz(timezoneStr).utc(true).toDate();
  }

  /**
   * Subtracts a specified amount of time from a date.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {number} [amount] - The amount of time to subtract.
   * @param {string} [unit] - The unit of time to subtract (e.g., 'day', 'month', 'year').
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The resulting date after subtraction.
   * @example
   * const newDate = DateUtils.subtract(new Date(), 1, 'day');
   * console.log(newDate); // e.g., "2023-12-30T00:00:00.000Z"
   */
  static subtract(
    date: Date | string | number,
    amount: number,
    unit: ManipulateType,
    timezoneStr: string = 'UTC',
  ): Date {
    return dayjs(date).tz(timezoneStr, true).subtract(amount, unit).toDate();
  }

  /**
   * Adds a specified amount of time to a date.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {number} [amount] - The amount of time to add.
   * @param {string} [unit] - The unit of time to add (e.g., 'day', 'month', 'year').
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The resulting date after addition.
   * @example
   * const newDate = DateUtils.add(new Date(), 1, 'day');
   * console.log(newDate); // e.g., "2024-01-01T00:00:00.000Z"
   */
  static add(
    date: Date | string | number,
    amount: number,
    unit: ManipulateType,
    timezoneStr: string = 'UTC',
  ): Date {
    return dayjs(date).tz(timezoneStr, true).add(amount, unit).toDate();
  }

  /**
   * Returns the start of the day for a given date.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The start of the day for the given date.
   * @example
   * const startOfDay = DateUtils.startOfDay(new Date());
   * console.log(startOfDay); // e.g., "2023-12-31T00:00:00.000Z"
   */
  static startOfDay(date: Date | string, timezoneStr: string = 'UTC'): Date {
    const formattedDate = DateUtils.format(date);
    return dayjs(formattedDate).tz(timezoneStr, true).startOf('day').toDate();
  }

  /**
   * Returns the end of the day for a given date.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The end of the day for the given date.
   * @example
   * const endOfDay = DateUtils.endOfDay(new Date());
   * console.log(endOfDay); // e.g., "2023-12-31T23:59:59.999Z"
   */
  static endOfDay(date: Date | string, timezoneStr: string = 'UTC'): Date {
    const formattedDate = DateUtils.format(date);
    return dayjs(formattedDate).tz(timezoneStr, true).endOf('day').toDate();
  }

  /**
   * Returns the end of the week for a given date.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The end of the week for the given date.
   * @example
   * const startOfWeek = DateUtils.startOfWeek(new Date());
   * console.log(startOfWeek); // e.g., "2023-12-31T23:59:59.999Z"
   */
  static startOfWeek(date: Date | string, timezoneStr: string = 'UTC'): Date {
    const formattedDate = DateUtils.format(date);
    return dayjs(formattedDate).tz(timezoneStr, true).startOf('week').toDate();
  }

  /**
   * Returns the end of the week for a given date.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The end of the week for the given date.
   * @example
   * const endOfWeek = DateUtils.endOfWeek(new Date());
   * console.log(endOfWeek); // e.g., "2023-12-31T23:59:59.999Z"
   */
  static endOfWeek(date: Date | string, timezoneStr: string = 'UTC'): Date {
    const formattedDate = DateUtils.format(date);
    return dayjs(formattedDate).tz(timezoneStr, true).endOf('week').toDate();
  }

  /**
   * Returns the start of the month for a given date.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The start of the month for the given date.
   * @example
   * const startOfMonth = DateUtils.startOfMonth(new Date());
   * console.log(startOfMonth); // e.g., "2023-12-31T00:00:00.000Z"
   */
  static startOfMonth(date: Date | string, timezoneStr: string = 'UTC'): Date {
    const formattedDate = DateUtils.format(date);
    return dayjs(formattedDate).tz(timezoneStr, true).startOf('month').toDate();
  }

  /**
   * Returns the end of the month for a given date.
   *
   * @static
   * @param {Date|string|number} [date] - The date to format. Can be a Date object, a string, or a number.
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {Date} The end of the month for the given date.
   * @example
   * const endOfMonth = DateUtils.endOfMonth(new Date());
   * console.log(endOfMonth); // e.g., "2023-12-31T23:59:59.999Z"
   */
  static endOfMonth(date: Date | string, timezoneStr: string = 'UTC'): Date {
    const formattedDate = DateUtils.format(date);
    return dayjs(formattedDate).tz(timezoneStr, true).endOf('month').toDate();
  }

  /**
   * Checks if a date is after another date.
   *
   * @static
   * @param {Date|string|number} date1 - The first date to compare.
   * @param {Date|string|number} date2 - The second date to compare.
   * @param {string} [timezoneStr='UTC'] - The timezone to use (default is 'UTC').
   * @returns {boolean} A boolean indicating if the first date is after the second date.
   * @example
   * const isAfter = DateUtils.isAfter(new Date(), '2023-12-31');
   * console.log(isAfter); // e.g., true or false
   */
  static isAfter(
    date1: Date | string | number,
    date2: Date | string | number,
    timezoneStr: string = 'UTC',
  ): boolean {
    return dayjs(date1)
      .tz(timezoneStr, true)
      .isAfter(dayjs(date2).tz(timezoneStr, true));
  }
}
