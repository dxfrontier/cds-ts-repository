import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('FIND_ONE_AND_UPDATE', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.findOneAndUpdate()', () => {
    it('should successfully find and update an item in the database', async () => {
      // Arrange
      const bookId = 201;
      const originalBook = await bookRepository.findOne({ ID: bookId });
      const newDescription = 'UPDATED DESCRIPTION - findOneAndUpdate test';

      // Act
      const wasUpdated = await bookRepository.findOneAndUpdate({ ID: bookId }, { descr: newDescription });
      const updatedBook = await bookRepository.findOne({ ID: bookId });

      // Assert
      expect(wasUpdated).toBe(true);
      expect(originalBook).toBeDefined();
      expect(updatedBook).toBeDefined();
      expect(updatedBook?.descr).toBe(newDescription);
      expect(originalBook?.descr).not.toBe(updatedBook?.descr);
    });

    it('should return false when trying to update a non-existent item', async () => {
      // Arrange
      const nonExistentId = 99999;

      // Act
      const wasUpdated = await bookRepository.findOneAndUpdate(
        { ID: nonExistentId },
        { descr: 'This should not update' },
      );

      // Assert
      expect(wasUpdated).toBe(false);
    });

    it('should successfully update multiple fields at once', async () => {
      // Arrange
      const bookId = 203;
      const originalBook = await bookRepository.findOne({ ID: bookId });
      const updatedFields = {
        descr: 'New description for multiple fields test',
        stock: 999,
        price: 99.99,
      };

      // Act
      const wasUpdated = await bookRepository.findOneAndUpdate({ ID: bookId }, updatedFields);
      const updatedBook = await bookRepository.findOne({ ID: bookId });

      // Assert
      expect(wasUpdated).toBe(true);
      expect(updatedBook).toBeDefined();
      expect(updatedBook?.descr).toBe(updatedFields.descr);
      expect(updatedBook?.stock).toBe(updatedFields.stock);
      expect(updatedBook?.price).toBe(updatedFields.price);
      expect(originalBook?.descr).not.toBe(updatedBook?.descr);
      expect(originalBook?.stock).not.toBe(updatedBook?.stock);
      expect(originalBook?.price).not.toBe(updatedBook?.price);
    });

    it('should update only the specified fields, leaving others unchanged', async () => {
      // Arrange
      const bookId = 207;
      const originalBook = await bookRepository.findOne({ ID: bookId });
      const newTitle = 'Updated Title Only';

      // Act
      const wasUpdated = await bookRepository.findOneAndUpdate({ ID: bookId }, { title: newTitle });
      const updatedBook = await bookRepository.findOne({ ID: bookId });

      // Assert
      expect(wasUpdated).toBe(true);
      expect(updatedBook).toBeDefined();
      expect(updatedBook?.title).toBe(newTitle);
      // Other fields should remain unchanged
      expect(updatedBook?.descr).toBe(originalBook?.descr);
      expect(updatedBook?.stock).toBe(originalBook?.stock);
      expect(updatedBook?.price).toBe(originalBook?.price);
      expect(updatedBook?.currency_code).toBe(originalBook?.currency_code);
    });

    it('should find and update using composite keys', async () => {
      // Arrange
      const bookId = 271;
      const currencyCode = 'JPY';
      const originalBook = await bookRepository.findOne({ ID: bookId, currency_code: currencyCode });
      const newStock = 500;

      // Act
      const wasUpdated = await bookRepository.findOneAndUpdate(
        { ID: bookId, currency_code: currencyCode },
        { stock: newStock },
      );
      const updatedBook = await bookRepository.findOne({ ID: bookId });

      // Assert
      expect(wasUpdated).toBe(true);
      expect(updatedBook).toBeDefined();
      expect(updatedBook?.stock).toBe(newStock);
      expect(originalBook?.stock).not.toBe(updatedBook?.stock);
    });

    it('should handle updating with null values', async () => {
      // Arrange
      const bookId = 252;
      const originalBook = await bookRepository.findOne({ ID: bookId });

      // Act
      const wasUpdated = await bookRepository.findOneAndUpdate({ ID: bookId }, { descr: null });
      const updatedBook = await bookRepository.findOne({ ID: bookId });

      // Assert
      expect(wasUpdated).toBe(true);
      expect(updatedBook).toBeDefined();
      expect(updatedBook?.descr).toBeNull();
      expect(originalBook?.descr).not.toBeNull();
    });
  });
});
