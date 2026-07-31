import type { Author, Authors, Book } from '#cds-models/CatalogService';
import type { Review } from '#cds-models/sap/capire/bookshop';

import { BaseRepository } from '../../../lib';
import { Filter } from '../../../lib/util/filter/Filter';
import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

const getAuthorRepository = async () => {
  const { Authors } = await import('#cds-models/CatalogService');

  class AuthorRepository extends BaseRepository<Authors> {
    constructor() {
      super(Authors);
    }
  }

  return new AuthorRepository();
};

describe('FILTER - path expressions and EXISTS / NOT EXISTS', () => {
  startTestServer(__dirname, 'bookshop');

  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;
  let authorRepository: Awaited<ReturnType<typeof getAuthorRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
    authorRepository = await getAuthorRepository();
  });

  describe('======> Filter - path expressions', () => {
    it('should return the 2 books of the author matching the "author.name" path - EQUALS', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'author.name',
        operator: 'EQUALS',
        value: 'Edgar Allen Poe',
      });

      // Act
      const results = await bookRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([251, 252]);
    });

    it('should return the 1 book of the author matching the "author.name" path - LIKE', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'author.name',
        operator: 'LIKE',
        value: 'Carpenter',
      });

      // Act
      const results = await bookRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID)).toStrictEqual([271]);
    });

    it('should return the 3 books of the authors matching the "author.name" path - IN', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'author.name',
        operator: 'IN',
        value: ['Edgar Allen Poe', 'Richard Carpenter'],
      });

      // Act
      const results = await bookRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([251, 252, 271]);
    });

    it('should return the 2 books matching the "author.placeOfBirth" path - .find(filter)', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'author.placeOfBirth',
        operator: 'EQUALS',
        value: 'Boston, Massachusetts',
      });

      // Act
      const results = await bookRepository.find(filter);

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([251, 252]);
    });

    it('should count the books matching the "author.name" path - .countWhere(filter)', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'author.name',
        operator: 'EQUALS',
        value: 'Edgar Allen Poe',
      });

      // Act
      const count = await bookRepository.countWhere(filter);

      // Assert
      expect(count).toBe(2);
    });
  });

  describe('======> Filter - EXISTS', () => {
    it('should return the 3 books having at least one review - bare EXISTS', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'reviews',
        operator: 'EXISTS',
      });

      // Act
      const results = await bookRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([201, 203, 207]);
    });

    it('should return the 1 author having a book matching the inner filter - EXISTS with an inner filter', async () => {
      // Arrange
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({
          field: 'stock',
          operator: 'GREATER THAN',
          value: 500,
        }),
      });

      // Act
      const results = await authorRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID)).toStrictEqual([150]);
    });

    it('should return the 1 author having a book matching the inner AND filter - EXISTS with an inner combined filter', async () => {
      // Arrange
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>(
          'AND',
          new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 300 }),
          new Filter<Book>({ field: 'currency_code', operator: 'EQUALS', value: 'USD' }),
        ),
      });

      // Act
      const results = await authorRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID)).toStrictEqual([150]);
    });

    it('should return the 2 authors having a book matching the inner OR filter - EXISTS with an inner combined filter', async () => {
      // Arrange
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>(
          'OR',
          new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 500 }),
          new Filter<Book>({ field: 'currency_code', operator: 'EQUALS', value: 'JPY' }),
        ),
      });

      // Act
      const results = await authorRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([150, 170]);
    });

    it('should return the 2 books of the author matching the inner filter - EXISTS on a to-one association', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'author',
        operator: 'EXISTS',
        filters: new Filter<Author>({
          field: 'name',
          operator: 'EQUALS',
          value: 'Edgar Allen Poe',
        }),
      });

      // Act
      const results = await bookRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([251, 252]);
    });

    it('should return the 2 authors having a book with a review matching the inner filter - nested EXISTS', async () => {
      // Arrange
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({
          field: 'reviews',
          operator: 'EXISTS',
          filters: new Filter<Review>({
            field: 'rating',
            operator: 'GREATER THAN',
            value: 4,
          }),
        }),
      });

      // Act
      const results = await authorRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([101, 107]);
    });

    it('should return the 1 author having a book matching the inner filter - .find(filter)', async () => {
      // Arrange
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({
          field: 'currency_code',
          operator: 'EQUALS',
          value: 'JPY',
        }),
      });

      // Act
      const results = await authorRepository.find(filter);

      // Assert
      expect(results!.map((item) => item.ID)).toStrictEqual([170]);
    });

    it('should count the authors having a book matching the inner filter - .countWhere(filter)', async () => {
      // Arrange
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({
          field: 'stock',
          operator: 'GREATER THAN',
          value: 500,
        }),
      });

      // Act
      const count = await authorRepository.countWhere(filter);

      // Assert
      expect(count).toBe(1);
    });
  });

  describe('======> Filter - NOT EXISTS', () => {
    it('should return the 3 books having no review - bare NOT EXISTS', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'reviews',
        operator: 'NOT EXISTS',
      });

      // Act
      const results = await bookRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([251, 252, 271]);
    });

    it('should return the 3 authors having no book matching the inner filter - NOT EXISTS with an inner filter', async () => {
      // Arrange
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'NOT EXISTS',
        filters: new Filter<Book>({
          field: 'stock',
          operator: 'GREATER THAN',
          value: 500,
        }),
      });

      // Act
      const results = await authorRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([101, 107, 170]);
    });
  });

  describe('======> Filter - EXISTS combined with other filters', () => {
    it('should return the 1 author matching both the EXISTS and the value filter - new Filter("AND", ...)', async () => {
      // Arrange
      const existsFilter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 300 }),
      });
      const nameFilter = new Filter<Author>({ field: 'name', operator: 'EQUALS', value: 'Edgar Allen Poe' });

      const filter = new Filter<Author>('AND', existsFilter, nameFilter);

      // Act
      const results = await authorRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID)).toStrictEqual([150]);
    });

    it('should return the 2 authors matching the EXISTS or the value filter - new Filter("OR", ...)', async () => {
      // Arrange
      const existsFilter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 500 }),
      });
      const nameFilter = new Filter<Author>({ field: 'name', operator: 'EQUALS', value: 'Richard Carpenter' });

      const filter = new Filter<Author>('OR', existsFilter, nameFilter);

      // Act
      const results = await authorRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([150, 170]);
    });

    it('should return the 2 authors matching the multidimensional filter - new Filter([...])', async () => {
      // Arrange
      const existsFilter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 500 }),
      });
      const nameFilter = new Filter<Author>({ field: 'name', operator: 'EQUALS', value: 'Richard Carpenter' });

      const filter = new Filter<Author>([existsFilter, 'OR', nameFilter]);

      // Act
      const results = await authorRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([150, 170]);
    });

    it('should return the 2 books matching both the path expression and the NOT EXISTS filter - new Filter("AND", ...)', async () => {
      // Arrange
      const pathFilter = new Filter<Book>({ field: 'author.name', operator: 'EQUALS', value: 'Edgar Allen Poe' });
      const existsFilter = new Filter<Book>({ field: 'reviews', operator: 'NOT EXISTS' });

      const filter = new Filter<Book>('AND', pathFilter, existsFilter);

      // Act
      const results = await bookRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([251, 252]);
    });

    it('should return the 4 books matching the multidimensional path expression / EXISTS filter - new Filter([...])', async () => {
      // Arrange
      const existsFilter = new Filter<Book>({ field: 'reviews', operator: 'EXISTS' });
      const pathFilter = new Filter<Book>({ field: 'author.name', operator: 'EQUALS', value: 'Richard Carpenter' });

      const filter = new Filter<Book>([existsFilter, 'OR', pathFilter]);

      // Act
      const results = await bookRepository.builder().find(filter).execute();

      // Assert
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([201, 203, 207, 271]);
    });
  });

  // The describes below modify the in-memory database of this suite, they must stay last
  describe('======> Filter - .updateMany()', () => {
    it('should update the 2 books having a review matching the inner filter - EXISTS', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'reviews',
        operator: 'EXISTS',
        filters: new Filter<Review>({
          field: 'rating',
          operator: 'GREATER THAN',
          value: 4,
        }),
      });

      // Act
      const updated = await bookRepository.updateMany(filter, { descr: 'Highly rated' });

      // Assert
      expect(updated).toBe(2);

      const results = await bookRepository.find({ descr: 'Highly rated' });
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([203, 207]);
    });

    it('should update the 2 books matching the "author.name" path', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'author.name',
        operator: 'EQUALS',
        value: 'Edgar Allen Poe',
      });

      // Act
      const updated = await bookRepository.updateMany(filter, { descr: 'Written by Poe' });

      // Assert
      expect(updated).toBe(2);

      const results = await bookRepository.find({ descr: 'Written by Poe' });
      expect(results!.map((item) => item.ID).sort()).toStrictEqual([251, 252]);
    });
  });

  describe('======> Filter - .deleteWhere()', () => {
    it('should delete the 3 books having no review - NOT EXISTS', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'reviews',
        operator: 'NOT EXISTS',
      });

      // Act
      const deleted = await bookRepository.deleteWhere(filter);

      // Assert
      expect(deleted).toBe(3);

      const remaining = await bookRepository.getAll();
      expect(remaining!.map((item) => item.ID).sort()).toStrictEqual([201, 203, 207]);
    });
  });
});
