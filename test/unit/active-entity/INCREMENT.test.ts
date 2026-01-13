import { Book } from '#cds-models/CatalogService';

import { Filter } from '../../../lib/util/filter/Filter';
import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('INCREMENT / DECREMENT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.increment()', () => {
    test('should successfully increment a numeric field by 1', async () => {
      // Arrange
      const initialBook = await bookRepository.findOne({ ID: 201 });
      const initialStock = initialBook!.stock!;

      // Act
      const success = await bookRepository.increment({ ID: 201 }, 'stock', 1);

      // Assert
      expect(success).toBe(true);
      const updatedBook = await bookRepository.findOne({ ID: 201 });
      expect(updatedBook!.stock).toBe(initialStock + 1);
    });

    test('should successfully increment a numeric field by a custom value', async () => {
      // Arrange
      const initialBook = await bookRepository.findOne({ ID: 201 });
      const initialStock = initialBook!.stock!;

      // Act
      const success = await bookRepository.increment({ ID: 201 }, 'stock', 5);

      // Assert
      expect(success).toBe(true);
      const updatedBook = await bookRepository.findOne({ ID: 201 });
      expect(updatedBook!.stock).toBe(initialStock + 5);
    });

    test('should return false when entity is not found', async () => {
      // Act
      const success = await bookRepository.increment({ ID: 99999 }, 'stock', 1);

      // Assert
      expect(success).toBe(false);
    });
  });

  describe('.decrement()', () => {
    test('should successfully decrement a numeric field by 1', async () => {
      // Arrange
      const initialBook = await bookRepository.findOne({ ID: 201 });
      const initialStock = initialBook!.stock!;

      // Act
      const success = await bookRepository.decrement({ ID: 201 }, 'stock', 1);

      // Assert
      expect(success).toBe(true);
      const updatedBook = await bookRepository.findOne({ ID: 201 });
      expect(updatedBook!.stock).toBe(initialStock - 1);
    });

    test('should successfully decrement a numeric field by a custom value', async () => {
      // Arrange
      const initialBook = await bookRepository.findOne({ ID: 201 });
      const initialStock = initialBook!.stock!;

      // Act
      const success = await bookRepository.decrement({ ID: 201 }, 'stock', 3);

      // Assert
      expect(success).toBe(true);
      const updatedBook = await bookRepository.findOne({ ID: 201 });
      expect(updatedBook!.stock).toBe(initialStock - 3);
    });

    test('should return false when entity is not found', async () => {
      // Act
      const success = await bookRepository.decrement({ ID: 99999 }, 'stock', 1);

      // Assert
      expect(success).toBe(false);
    });
  });

  describe('.incrementMany()', () => {
    test('should successfully increment multiple items matching the keys', async () => {
      // Arrange
      const initialBooks = await bookRepository.find({ currency_code: 'GBP' });
      const initialCount = initialBooks!.length;
      const initialStocks = initialBooks!.map((b) => ({ ID: b.ID, stock: b.stock }));

      // Act
      const updatedCount = await bookRepository.incrementMany({ currency_code: 'GBP' }, { stock: 10 });

      // Assert
      expect(updatedCount).toBe(initialCount);

      const updatedBooks = await bookRepository.find({ currency_code: 'GBP' });
      updatedBooks!.forEach((book) => {
        const original = initialStocks.find((s) => s.ID === book.ID);
        expect(book.stock).toBe(original!.stock! + 10);
      });
    });

    test('should successfully increment multiple items matching a filter', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'stock',
        operator: 'GREATER THAN',
        value: 5,
      });
      const initialBooks = await bookRepository.find(filter);
      const initialCount = initialBooks!.length;

      // Act
      const updatedCount = await bookRepository.incrementMany(filter, { stock: 2 });

      // Assert
      expect(updatedCount).toBe(initialCount);
    });

    test('should return 0 when no items match the criteria', async () => {
      // Act
      const updatedCount = await bookRepository.incrementMany({ ID: 99999 }, { stock: 1 });

      // Assert
      expect(updatedCount).toBe(0);
    });
  });

  describe('.decrementMany()', () => {
    test('should successfully decrement multiple items matching the keys', async () => {
      // Arrange
      const initialBooks = await bookRepository.find({ currency_code: 'USD' });
      const initialCount = initialBooks!.length;
      const initialStocks = initialBooks!.map((b) => ({ ID: b.ID, stock: b.stock }));

      // Act
      const updatedCount = await bookRepository.decrementMany({ currency_code: 'USD' }, { stock: 2 });

      // Assert
      expect(updatedCount).toBe(initialCount);

      const updatedBooks = await bookRepository.find({ currency_code: 'USD' });
      updatedBooks!.forEach((book) => {
        const original = initialStocks.find((s) => s.ID === book.ID);
        expect(book.stock).toBe(original!.stock! - 2);
      });
    });

    test('should return 0 when no items match the criteria', async () => {
      // Act
      const updatedCount = await bookRepository.decrementMany({ ID: 99999 }, { stock: 1 });

      // Assert
      expect(updatedCount).toBe(0);
    });
  });
});
