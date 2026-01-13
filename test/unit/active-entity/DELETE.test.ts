import { Book } from '#cds-models/CatalogService';

import { Filter } from '../../../lib/util/filter/Filter';
import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('DELETE', () => {
  startTestServer(__dirname, 'bookshop');

  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.delete()', () => {
    test('should successfully delete an item from the table', async () => {
      const getAll = await bookRepository.getAll();
      const deleteOperation = await bookRepository.delete({ ID: 201 });
      const getAllAfter = await bookRepository.getAll();

      expect(deleteOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });
  });

  describe('.deleteMany()', () => {
    it('should successfully delete multiple items from the table - deleteMany([{ ID : 207 }, { ID : 251 }])', async () => {
      const getAll = await bookRepository.getAll();
      const deleteAllOperation = await bookRepository.deleteMany([{ ID: 207 }, { ID: 251 }]);
      const getAllAfter = await bookRepository.getAll();

      expect(deleteAllOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });

    it('should successfully delete multiple items from the table - deleteMany({ ID: 201 }, { ID: 252 })', async () => {
      const getAll = await bookRepository.getAll();
      const deleteAllOperation = await bookRepository.deleteMany({ ID: 203 }, { ID: 252 });
      const getAllAfter = await bookRepository.getAll();

      expect(deleteAllOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });
  });

  describe('.deleteWhere()', () => {
    it('should successfully delete items matching the provided keys', async () => {
      // Arrange
      const beforeCount = await bookRepository.count();
      const matchingBooks = await bookRepository.find({ currency_code: 'GBP' });
      const matchingCount = matchingBooks!.length;

      // Act
      const deletedCount = await bookRepository.deleteWhere({ currency_code: 'GBP' });

      // Assert
      const afterCount = await bookRepository.count();
      expect(deletedCount).toBe(matchingCount);
      expect(afterCount).toBe(beforeCount - matchingCount);
    });

    it('should successfully delete items matching a filter', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'stock',
        operator: 'LESS THAN',
        value: 15,
      });
      const beforeCount = await bookRepository.count();
      const matchingBooks = await bookRepository.find(filter);
      const matchingCount = matchingBooks!.length;

      // Act
      const deletedCount = await bookRepository.deleteWhere(filter);

      // Assert
      const afterCount = await bookRepository.count();
      expect(deletedCount).toBe(matchingCount);
      expect(afterCount).toBe(beforeCount - matchingCount);
    });

    it('should return 0 when no items match the criteria', async () => {
      // Act
      const deletedCount = await bookRepository.deleteWhere({ ID: 99999 });

      // Assert
      expect(deletedCount).toBe(0);
    });
  });

  describe('.deleteAll()', () => {
    it('should successfully delete all items from the table', async () => {
      const getAll = await bookRepository.getAll();
      const deleteAll = await bookRepository.deleteAll();
      const getAllAfter = await bookRepository.getAll();

      expect(deleteAll).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });
  });
});
