import { ID } from './id.helper';

describe('Id', () => {
  describe('generate', () => {
    it('should call the generate method and return a string with 36 characters', () => {
      // Arrange
      const mockUuid = '1a2b3c4d';
      jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
      jest.spyOn(String.prototype, 'slice').mockReturnValue(mockUuid);

      // Act
      const result = ID.generate();

      // Assert
      expect(result).toBe(mockUuid);
    });
  });
});
