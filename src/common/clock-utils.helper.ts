type OffsetString = `${number}${'s' | 'm' | 'h' | 'd'}`;
type Offset = number | OffsetString;

/**
 * ClockUtils helper class.
 *
 * This class provides helper methods for working with time.
 *
 * @class
 * @abstract
 */
export abstract class ClockUtils {
  /**
   * Time constants for one second.
   *
   * @static
   * @readonly
   * @type {number}
   * @example
   * console.log(ClockUtils.ONE_SECOND); // e.g., 1000
   */
  static readonly ONE_SECOND: number = 1000;

  /**
   * Time constants for one minute.
   *
   * @static
   * @readonly
   * @type {number}
   * @example
   * console.log(ClockUtils.ONE_MINUTE); // e.g., 60000
   */
  static readonly ONE_MINUTE: number = 60 * this.ONE_SECOND;

  /**
   * Time constants for one hour.
   *
   * @static
   * @readonly
   * @type {number}
   * @example
   * console.log(ClockUtils.ONE_HOUR); // e.g., 3600000
   */
  static readonly ONE_HOUR: number = 60 * this.ONE_MINUTE;

  /**
   * Time constants for one day.
   *
   * @static
   * @readonly
   * @type {number}
   * @example
   * console.log(ClockUtils.ONE_DAY); // e.g., 86400000
   */
  static readonly ONE_DAY: number = 24 * this.ONE_HOUR;

  /**
   * Converts an offset string to milliseconds.
   *
   * @static
   * @param {OffsetString} offset - Offset string in the format of "{number}{'s' | 'm' | 'h' | 'd'}".
   * @returns {number} Offset in milliseconds.
   * @throws {Error} Invalid offset format.
   * @example
   * const offset = ClockUtils.getMilliseconds('1m');
   * console.log(offset); // e.g., 60000
   */
  static getMilliseconds(offset: OffsetString): number {
    const match = offset.match(/(\d+)([smhd])/);

    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      switch (unit) {
        case 's':
          return value * ClockUtils.ONE_SECOND;

        case 'm':
          return value * ClockUtils.ONE_MINUTE;

        case 'h':
          return value * ClockUtils.ONE_HOUR;

        case 'd':
          return value * ClockUtils.ONE_DAY;

        default:
          throw new Error('Invalid offset unit. Use "s", "m", "h", or "d".');
      }
    } else {
      throw new Error(
        'Invalid offset format. Use formats like "1d", "2h", "30m", "15s", etc.',
      );
    }
  }

  /**
   * Gets the current timestamp.
   *
   * @static
   * @param {Offset} [offset] - Optional offset in milliseconds or offset string.
   * @returns {number} Current timestamp.
   * @example
   * const timestamp = ClockUtils.getTimestamp('1d');
   * console.log(timestamp); // e.g., 1630549200000
   */
  static getFutureTimestamp(offset?: Offset): number {
    let timestamp = Date.now();

    if (offset !== undefined) {
      if (typeof offset === 'number') {
        timestamp += offset;
      }

      if (typeof offset === 'string') {
        timestamp += ClockUtils.getMilliseconds(offset);
      }
    }

    return timestamp;
  }
}
