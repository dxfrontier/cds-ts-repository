import type { Author, Authors, Book } from '#cds-models/CatalogService';

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

// A value carrying a single quote that must only ever match its own literal text.
const NON_MATCHING_LITERAL_VALUE = "O'Reilly' x";

// A LIKE-family value carrying a single quote that must only ever match its own literal text.
const LIKE_QUOTED_VALUE = "it's 'quoted' start";

// An IN list item carrying a single quote that must only ever match its own literal text.
const IN_QUOTED_VALUE = "O'Reilly's Odyssey";

describe('FILTER - values are always literals', () => {
  startTestServer(__dirname, 'bookshop');

  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;
  let authorRepository: Awaited<ReturnType<typeof getAuthorRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
    authorRepository = await getAuthorRepository();
  });

  describe('======> a non-matching value carrying a quote only ever matches its own literal value', () => {
    it('.find() - EQUALS returns no rows and leaves the table untouched', async () => {
      const totalBefore = await bookRepository.count();

      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: NON_MATCHING_LITERAL_VALUE });
      const results = await bookRepository.find(filter);

      expect(results).toHaveLength(0);
      expect(await bookRepository.count()).toBe(totalBefore);
    });

    it('.countWhere() - EQUALS returns 0', async () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: NON_MATCHING_LITERAL_VALUE });

      expect(await bookRepository.countWhere(filter)).toBe(0);
    });

    it('.updateMany() - EQUALS updates 0 rows and no row is silently touched', async () => {
      const totalBefore = await bookRepository.count();

      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: NON_MATCHING_LITERAL_VALUE });
      const updatedCount = await bookRepository.updateMany(filter, { stock: -1 });

      expect(updatedCount).toBe(0);
      expect(await bookRepository.countWhere({ stock: -1 })).toBe(0);
      expect(await bookRepository.count()).toBe(totalBefore);
    });

    it('.deleteWhere() - EQUALS deletes 0 rows for a value containing a quote', async () => {
      const totalBefore = await bookRepository.count();

      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: NON_MATCHING_LITERAL_VALUE });
      const deletedCount = await bookRepository.deleteWhere(filter);

      expect(deletedCount).toBe(0);
      expect(await bookRepository.count()).toBe(totalBefore);
    });

    it('.find() - LIKE family returns no rows for a value containing a quote', async () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'LIKE', value: LIKE_QUOTED_VALUE });
      const results = await bookRepository.find(filter);

      expect(results).toHaveLength(0);
    });

    it('.find() - a quoted IN item only ever matches its own literal text next to a legit one', async () => {
      const filter = new Filter<Book>({
        field: 'title',
        operator: 'IN',
        value: ['Jane Eyre', IN_QUOTED_VALUE],
      });
      const results = await bookRepository.find(filter);

      expect(results!.map((item) => item.ID)).toStrictEqual([207]);
    });

    it('.find() - a BETWEEN string bound is rendered as a quoted literal', async () => {
      // Both bounds sort after every real title (which all start with 'C', 'E', 'J', 'T' or 'W'),
      // so a correctly literal-quoted range matches nothing.
      const filter = new Filter<Book>({
        field: 'title',
        operator: 'BETWEEN',
        value1: `Z${NON_MATCHING_LITERAL_VALUE}`,
        value2: 'ZZZZZZZ',
      });
      const results = await bookRepository.find(filter);

      expect(results).toHaveLength(0);
    });

    it('.find() - a non-matching value inside an EXISTS inner filter matches no authors', async () => {
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({ field: 'title', operator: 'EQUALS', value: NON_MATCHING_LITERAL_VALUE }),
      });
      const results = await authorRepository.find(filter);

      expect(results).toHaveLength(0);
    });

    it('.find() - a non-matching branch of a compound OR filter contributes nothing', async () => {
      const nonMatching = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: NON_MATCHING_LITERAL_VALUE });
      const matching = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: 'Jane Eyre' });

      const results = await bookRepository.find(new Filter('OR', nonMatching, matching));

      expect(results!.map((item) => item.ID)).toStrictEqual([207]);
    });
  });

  describe('======> a legit apostrophe value matches exactly its own row', () => {
    it('inserts a title with an apostrophe, finds it back by the same value, then restores the table', async () => {
      const totalBefore = await bookRepository.count();
      const title = "O'Reilly's Guide";

      await bookRepository.create({ ID: 9001, title, author_ID: 101, stock: 1 } as unknown as Book);

      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: title });
      const results = await bookRepository.find(filter);

      expect(results!.map((item) => item.ID)).toStrictEqual([9001]);

      // Restore: tests in this suite share the database.
      await bookRepository.delete({ ID: 9001 });
      expect(await bookRepository.count()).toBe(totalBefore);
    });
  });

  describe('======> invalid field / operator / value', () => {
    it('rejects a field that is not a valid CDS element path', async () => {
      const filter = new Filter<Book>({
        field: 'title name' as unknown as 'title',
        operator: 'EQUALS',
        value: 'x',
      });

      await expect(bookRepository.find(filter)).rejects.toThrow(/valid CDS element path/);
    });

    it('rejects a non-primitive filter value', async () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: {} as unknown as string });

      await expect(bookRepository.find(filter)).rejects.toThrow(/must be a string, a finite number, a bigint or null/);
    });

    it('rejects a non-primitive LIKE value', () => {
      expect(() => new Filter<Book>({ field: 'title', operator: 'LIKE', value: {} as unknown as string })).toThrow(
        /must be a string, a finite number, a bigint, a boolean or null/,
      );
    });

    it('rejects a non-primitive STARTS_WITH value', () => {
      expect(
        () => new Filter<Book>({ field: 'title', operator: 'STARTS_WITH', value: {} as unknown as string }),
      ).toThrow(/must be a string, a finite number, a bigint, a boolean or null/);
    });

    it('rejects a non-primitive ENDS_WITH value', () => {
      expect(() => new Filter<Book>({ field: 'title', operator: 'ENDS_WITH', value: {} as unknown as string })).toThrow(
        /must be a string, a finite number, a bigint, a boolean or null/,
      );
    });
  });
});
