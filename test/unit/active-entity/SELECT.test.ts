import { Book } from '#cds-models/CatalogService';
import Filter from '../../../lib/util/Filter';

import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('SELECT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.getAll()', () => {
    it('It should RETURN : all items from the database', async () => {
      // Act
      const getAll = await bookRepository.getAll();

      getAll?.length;
      // Assert
      expect(getAll?.length).toBeGreaterThan(0);
    });
  });

  describe('.getDistinctColumns()', () => {
    it('It should RETURN : distinct columns found in the database', async () => {
      // Act
      const getDistinctColumns = await bookRepository.getDistinctColumns(['currency_code', 'ID']);

      // Assert
      expect(getDistinctColumns!.length).toBeGreaterThan(0);
    });
  });

  describe('.getAllAndLimit()', () => {
    it('It should RETURN : .getAllAndLimit() should have length smaller than .getAll length', async () => {
      // Arrange
      const getAll = await bookRepository.getAll();

      // Act
      const getAllAndLimit = await bookRepository.getAllAndLimit({ limit: 1 });
      const getAllAndLimitAndSkip = await bookRepository.getAllAndLimit({ limit: 2, skip: 1 });

      // Assert
      expect(getAllAndLimit!.length).toBeGreaterThan(0);
      expect(getAllAndLimit!.length).toBeLessThan(getAll!.length);
      expect(getAllAndLimitAndSkip).not.toContain(getAll![0]);
    });
  });

  describe('.getLocaleTexts()', () => {
    test('It should RETURN : all "Locale" languages text', async () => {
      // Act
      const texts = await bookRepository.getLocaleTexts(['descr', 'ID']);

      // Assert
      expect(texts).toBeDefined();
      expect(texts!.length).toBeGreaterThan(0);
    });
  });

  describe('.getAll()', () => {
    it('should return all items from the database', async () => {
      // Act
      const getAll = await bookRepository.getAll();

      // Assert
      expect(getAll!.length).toBeGreaterThan(0);
    });
  });

  describe('.getDistinctColumns()', () => {
    it('should return distinct columns found in the database', async () => {
      // Act
      const getDistinctColumns = await bookRepository.getDistinctColumns(['currency_code', 'ID']);

      // Assert
      expect(getDistinctColumns!.length).toBeGreaterThan(0);
    });
  });

  describe('.getAllAndLimit()', () => {
    it('should return results with length smaller than .getAll length when limited', async () => {
      // Arrange
      const getAll = await bookRepository.getAll();

      // Act
      const getAllAndLimit = await bookRepository.getAllAndLimit({ limit: 1 });
      const getAllAndLimitAndSkip = await bookRepository.getAllAndLimit({ limit: 2, skip: 1 });

      // Assert
      expect(getAllAndLimit!.length).toBeGreaterThan(0);
      expect(getAllAndLimit!.length).toBeLessThan(getAll!.length);
      expect(getAllAndLimitAndSkip).not.toContain(getAll![0]);
    });
  });

  describe('.getLocaleTexts()', () => {
    test('should return all "Locale" languages text', async () => {
      // Act
      const texts = await bookRepository.getLocaleTexts(['descr', 'ID']);

      // Assert
      expect(texts).toBeDefined();
      expect(texts!.length).toBeGreaterThan(0);
    });
  });

  describe('.find()', () => {
    describe('.find() - object', () => {
      it('should find "multiple" items with the specified criteria', async () => {
        // Act
        const findOneResult = await bookRepository.find({ ID: 201 });

        // Assert
        expect(findOneResult).toHaveLength(1);
      });

      it('should find one item with the specified criteria', async () => {
        const findMultipleResult = await bookRepository.find({ currency_code: 'GBP' });

        expect(findMultipleResult!.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('.find() - LIKE - BETWEEN - IN - multiple filters', () => {
      it('should return all records containing (currency_code = "GBP" OR stock BETWEEN 11 and 333) AND ID IN ("203", "201", "207")', async () => {
        // Arrange
        const filterLike = new Filter<Book>({
          field: 'currency_code',
          operator: 'LIKE',
          value: 'GBP',
        });

        const filterBetween = new Filter<Book>({
          field: 'stock',
          operator: 'BETWEEN',
          value1: 11,
          value2: 333,
        });

        const filterIn = new Filter<Book>({
          field: 'ID',
          operator: 'IN',
          value: [201, 203, 207],
        });

        // descr like 'Wuthering' or stock between 11 and 333
        const combinedFiltersWithOR = new Filter('OR', filterLike, filterBetween);

        // (descr LIKE 'Wuthering' OR stock BETWEEN 11 and 333) AND ID IN ('203', '201', '207')
        const filters = new Filter('AND', combinedFiltersWithOR, filterIn);

        // Act
        const results = await bookRepository.find(filters);

        // Assert
        expect(results).toHaveLength(3);

        results?.forEach((item) => {
          expect(item.currency_code).not.toBe('JPY');
          expect(item.currency_code).not.toBe('USD');
          expect(item.stock).toBeGreaterThanOrEqual(filterBetween.value1 as number);
          expect(item.stock).toBeLessThanOrEqual(filterBetween.value2 as number);

          (filterIn.value as number[]).forEach((id) => {
            expect(id).toBeGreaterThanOrEqual(201);
            expect(id).toBeLessThanOrEqual(207);
          });
        });
      });
    });
  });
  describe('.findOne()', () => {
    it('should return only one item with the specified criteria', async () => {
      // Act
      const findOne = await bookRepository.findOne({ currency_code: 'GBP' });

      // Assert
      expect(findOne).toBeDefined();
    });
  });

  describe('.builder()', () => {
    describe('======> .filter() - Overload - filter / filters ', () => {
      describe('======> .filter() - NOT EQUAL', () => {
        it('should return 5 record and ID 251 not in the items', async () => {
          const initialResult = await bookRepository.getAll();
          // Arrange
          const filter = new Filter<Book>({
            field: 'ID',
            operator: 'NOT EQUAL',
            value: 251,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(initialResult?.length).toBeGreaterThan(results!.length);
        });
      });
      describe('======> .filter() - EQUALS', () => {
        it('should return 1 record with the ID 251', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'ID',
            operator: 'EQUALS',
            value: 251,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(1);

          results?.forEach((item) => {
            expect(item.ID).toBe(filter.value as number);
          });
        });
      });

      describe('======> .filter() - LIKE', () => {
        it('should return 2 records containing in the "descr" field the string "Wuthering" ', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'descr',
            operator: 'LIKE',
            value: 'Wuthering',
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(2);

          results?.forEach((item) => expect(item.descr).toContain((filter.value as string).replace(/%/g, '')));
        });
      });

      describe('======> .filter() - BETWEEN', () => {
        it('should return 5 records between stock 11 and 333', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'BETWEEN',
            value1: 11,
            value2: 333,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(5);

          results?.forEach((item) => {
            expect(item.stock).toBeGreaterThanOrEqual(filter.value1 as number);
            expect(item.stock).toBeLessThanOrEqual(filter.value2 as number);
          });
        });
      });

      describe('======> .filter() - NOT BETWEEN', () => {
        it('should return 1 record not between 11 and 333', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'NOT BETWEEN',
            value1: 11,
            value2: 333,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(1);

          results?.forEach((item) => {
            expect(item.stock).toBeGreaterThan(filter.value1 as number);
            expect(item.stock).toBeGreaterThan(filter.value2 as number);
          });
        });
      });

      describe('======> .filter() - IN', () => {
        it('should return 5 records containing currency code USD and GBP', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'currency_code',
            operator: 'IN',
            value: ['USD', 'GBP'],
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(5);

          results?.forEach((item) => {
            expect(item.currency_code).not.toBe('JPY');
          });
        });
      });

      describe('======> .filter() - NOT IN', () => {
        it('should return only 1 records containing "JPY"', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'currency_code',
            operator: 'NOT IN',
            value: ['USD', 'GBP'],
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(1);

          results?.forEach((item) => {
            expect(item.currency_code).toBe('JPY');
          });
        });
      });

      describe('======> .filter() - GREATER THAN', () => {
        it('should return only 3 records that have stock greater than 12', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'GREATER THAN',
            value: 12,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(3);

          results?.forEach((item) => {
            expect(item.stock).toBeGreaterThan(filter.value as number);
          });
        });
      });

      describe('======> .filter() - GREATER THAN OR EQUALS', () => {
        it('should return only 5 records that have stock greater or equals to 12', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'GREATER THAN OR EQUALS',
            value: 12,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(5);

          results?.forEach((item) => {
            expect(item.stock).toBeGreaterThanOrEqual(filter.value as number);
          });
        });
      });

      describe('======> .filter() - LESS THAN', () => {
        it('should return only 4 records that have stock less than 12', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'LESS THAN',
            value: 333,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(4);

          results?.forEach((item) => {
            expect(item.stock).toBeLessThan(filter.value as number);
          });
        });
      });

      describe('======> .filter() - LESS THAN OR EQUALS', () => {
        it('should return only 4 records that have stock less than 12', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'LESS THAN OR EQUALS',
            value: 333,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(5);

          results?.forEach((item) => {
            expect(item.stock).toBeLessThanOrEqual(filter.value as number);
          });
        });
      });

      describe('======> .filter() - LIKE - BETWEEN - IN - multiple filters', () => {
        it('should return all records containing (currency_code = "GBP" OR stock BETWEEN 11 and 333) AND ID IN ("203", "201", "207")', async () => {
          // Arrange
          const filterLike = new Filter<Book>({
            field: 'currency_code',
            operator: 'LIKE',
            value: 'GBP',
          });

          const filterBetween = new Filter<Book>({
            field: 'stock',
            operator: 'BETWEEN',
            value1: 11,
            value2: 333,
          });

          const filterIn = new Filter<Book>({
            field: 'ID',
            operator: 'IN',
            value: [201, 203, 207],
          });

          // descr like 'Wuthering' or stock between 11 and 333
          const combinedFiltersWithOR = new Filter('OR', filterLike, filterBetween);

          // (descr LIKE 'Wuthering' OR stock BETWEEN 11 and 333) AND ID IN ('203', '201', '207')
          const filters = new Filter('AND', combinedFiltersWithOR, filterIn);

          // Act
          const results = await bookRepository.builder().find(filters).execute();

          // Assert
          expect(results).toHaveLength(3);

          results?.forEach((item) => {
            expect(item.currency_code).not.toBe('JPY');
            expect(item.currency_code).not.toBe('USD');
            expect(item.stock).toBeGreaterThanOrEqual(filterBetween.value1 as number);
            expect(item.stock).toBeLessThanOrEqual(filterBetween.value2 as number);

            (filterIn.value as number[]).forEach((id) => {
              expect(id).toBeGreaterThanOrEqual(201);
              expect(id).toBeLessThanOrEqual(207);
            });
          });
        });
      });
    });

    describe('======> .filter() - object ', () => {
      describe('======> .getExpand() + .columns() ', () => {
        it('should return only the columns "currency_code, descr, reviews" + expanded "reviews" property', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          // When .getExpand first and after the .columns
          const reviews = await bookRepository
            .builder()
            .find({ ID: 201 })
            .getExpand(['reviews'])
            .columns(['currency_code', 'descr', 'reviews'])
            .execute();

          // When .columns first and after the .getExpand
          const reviews_2 = await bookRepository
            .builder()
            .find({ ID: 201 })
            .columns('ID', 'currency_code', 'descr', 'reviews')
            .getExpand(['reviews'])
            .execute();

          // Assert
          expect(reviews?.length).toBeGreaterThan(0);
          expect(reviews![0]).toHaveProperty('reviews');
          expect(reviews![0]).toHaveProperty('descr');
          expect(reviews![0]).toHaveProperty('currency_code');

          expect(reviews_2?.length).toBeGreaterThan(0);
          expect(reviews_2![0]).toHaveProperty('reviews');
          expect(reviews_2![0]).toHaveProperty('descr');
          expect(reviews_2![0]).toHaveProperty('currency_code');

          expect(findOneForExpandAll).not.toMatchObject(reviews![0]);
          expect(findOneForExpandAll).not.toMatchObject(reviews_2![0]);
        });
      });

      describe('======> .getExpand()', () => {
        it('should return the original object + expanded "genre" property - .getExpand("genre")', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const expandGenre = await bookRepository.builder().find({ ID: 201 }).getExpand('genre').execute();

          // Assert
          expect(expandGenre?.length).toBeGreaterThan(0);
          expect(expandGenre![0]).toHaveProperty('genre');
          expect(findOneForExpandAll).not.toMatchObject(expandGenre![0]);
        });
        it('should return the original object + expanded "genre" property - .getExpand(["genre"])', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const expandGenre = await bookRepository.builder().find({ ID: 201 }).getExpand(['genre']).execute();

          // Assert
          expect(expandGenre?.length).toBeGreaterThan(0);
          expect(expandGenre![0]).toHaveProperty('genre');
          expect(findOneForExpandAll).not.toMatchObject(expandGenre![0]);
        });
      });

      describe('======> .orderDesc()', () => {
        it('should find all values with "USD" value and make them "DESC" over "stock" property - .orderDesc(["stock", "price"])', async () => {
          // Arrange
          const getAllByCurrencyCode = await bookRepository.builder().find({ currency_code: 'USD' }).execute();

          // Act
          const orderItemsDesc = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .orderDesc(['stock', 'price'])
            .execute();

          // Assert
          expect(orderItemsDesc![0]).not.toMatchObject(getAllByCurrencyCode![0]);
        });

        it('should find all values with "USD" value and make them "DESC" over "stock" property - .orderDesc("stock", "price")', async () => {
          // Arrange
          const getAllByCurrencyCode = await bookRepository.builder().find({ currency_code: 'USD' }).execute();

          // Act
          const orderItemsDesc = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .orderDesc(['stock', 'price'])
            .execute();

          // Assert
          expect(orderItemsDesc![0]).not.toMatchObject(getAllByCurrencyCode![0]);
        });
      });

      describe('======> .orderAsc()', () => {
        it('should find all values with "USD" value and make them "ASC" over "stock" property - orderAsc("stock", "price")', async () => {
          // Arrange
          const orderItemsDesc = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .orderDesc(['stock', 'price'])
            .execute();

          // Act
          const orderItemsAsc = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .orderAsc(['stock', 'price'])
            .execute();

          // Assert
          expect(orderItemsAsc![0]).not.toMatchObject(orderItemsDesc![0]);
        });

        it('should find all values with "USD" value and make them "ASC" over "stock" property - orderAsc("stock, "price")', async () => {
          // Arrange
          const orderItemsDesc = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .orderDesc(['stock', 'price'])
            .execute();

          // Act
          const orderItemsAsc = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .orderAsc('stock', 'price')
            .execute();

          // Assert
          expect(orderItemsAsc![0]).not.toMatchObject(orderItemsDesc![0]);
        });
      });

      describe('======> .columns()', () => {
        it('columns should return 2 records with only 2 columns ID and descr - .columns(["ID", "descr"])', async () => {
          // Act
          const columns = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .columns(['ID', 'descr'])
            .execute();

          // Assert
          expect(columns).toHaveLength(2);

          columns?.forEach((item) => {
            expect(item).toHaveProperty('ID');
            expect(item).toHaveProperty('descr');

            expect(item).not.toHaveProperty('title');
            expect(item).not.toHaveProperty('price');
            expect(item).not.toHaveProperty('currency_code');
          });
        });

        it('should return 2 records with only 2 columns ID and descr - .columns("ID", "descr")', async () => {
          // Act
          const columns = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .columns('ID', 'descr')
            .execute();

          // Assert
          expect(columns).toHaveLength(2);

          columns?.forEach((item) => {
            expect(item).toHaveProperty('ID');
            expect(item).toHaveProperty('descr');

            expect(item).not.toHaveProperty('title');
            expect(item).not.toHaveProperty('price');
            expect(item).not.toHaveProperty('currency_code');
          });
        });
      });

      describe('======> .groupBy()', () => {
        it('should group by column "author - groupBy(["author", "currency_code"])"', async () => {
          // Act
          const groupBy = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .groupBy(['author', 'currency_code'])
            .execute();

          // Assert
          expect(groupBy![0]).toBeDefined();
        });

        it('should group by column "author" - groupBy("author", "currency_code")', async () => {
          // Act
          const groupBy = await bookRepository
            .builder()
            .find({ currency_code: 'USD' })
            .groupBy('author', 'currency_code')
            .execute();

          // Assert
          expect(groupBy![0]).toBeDefined();
        });
      });

      describe('======> .limit()', () => {
        it('should return only 1 item when limited to 1', async () => {
          // Act
          const limit = await bookRepository.builder().find({ currency_code: 'GBP' }).limit({ limit: 1 }).execute();

          // Assert
          expect(limit).toHaveLength(1);
        });
      });

      describe('======> .limit()', () => {
        it('should return only 1 item when limited to 2 with skip 1', async () => {
          // Arrange
          const all = await bookRepository.builder().find({ currency_code: 'GBP' }).execute();

          // Act
          const limit = await bookRepository
            .builder()
            .find({ currency_code: 'GBP' })
            .limit({ limit: 2, skip: 1 })
            .execute();

          // Assert
          expect(limit).toHaveLength(2);
          expect(limit).not.toContain(all![0]);
        });
      });

      describe('======> .execute()', () => {
        it('should execute the Promise and return results', async () => {
          // Act
          const all = await bookRepository.builder().find({ currency_code: 'GBP' }).execute();

          // Assert
          expect(all).toBeDefined();
        });
      });
    });
  });

  describe('.exists()', () => {
    it('should return "true" if "1" item was found with the specified criteria', async () => {
      // Act
      const exists = await bookRepository.exists({ ID: 201 });
      // Assert
      expect(exists).toBe(true);
    });
  });

  describe('.count()', () => {
    it('should return a count number larger than "0"', async () => {
      // Act
      const count = await bookRepository.count();

      // Assert
      expect(count).toBeGreaterThan(0);
    });
  });
});
