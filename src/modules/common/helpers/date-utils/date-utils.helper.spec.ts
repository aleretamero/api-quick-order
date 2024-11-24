import { DateUtils } from './date-utils.helper';

describe('DateUtils', () => {
  describe('now', () => {
    it('should call the now method and return the current date and time', () => {
      // Arrange
      const mockDate = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      // Act
      const result = DateUtils.now();

      // Assert
      expect(result).toBe(mockDate);
    });
  });
});
