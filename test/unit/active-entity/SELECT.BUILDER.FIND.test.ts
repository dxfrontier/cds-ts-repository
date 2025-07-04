import { Book } from '#cds-models/CatalogService';

import { Expand } from '../../../lib';
import { Filter } from '../../../lib/util/filter/Filter';
import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('SELECT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.builder().find()', () => {
    /**
     * ################################################################################################################################
     * OVERLOAD 1
     * ################################################################################################################################
     */
    describe('======> .find() - no arguments (get all items) - [OVERLOAD 1]', () => {
      it('should return 6 record', async () => {
        // Act
        const results = await bookRepository.builder().find().execute();

        // Assert
        expect(results?.length).toEqual(6);
      });

      it('should return 3 distinct records', async () => {
        // Act
        const results = await bookRepository.builder().find().distinct.columns('currency_code').execute();

        // Assert
        expect(results?.length).toEqual(3);
      });

      it('should return the entity elements', async () => {
        // Act
        const elements = bookRepository
          .builder()
          .find({ currency_code: 'USD' })
          .columns('ID', 'currency_code').elements;

        // Assert
        expect(elements).not.toBeUndefined();
      });
    });

    /**
     * ################################################################################################################################
     * OVERLOAD 2
     * ################################################################################################################################
     */
    describe('======> .find({ ... }) - with object ({ ... }) - [OVERLOAD 2]', () => {
      describe('======> .getExpand() - OVERLOAD - AUTO EXPAND - { levels : number }', () => {
        it('should return the original object + expanded "genre", "author" and "reviews" properties', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const deepExpand = await bookRepository.builder().find({ ID: 201 }).getExpand({ levels: 3 }).execute();

          // Assert
          expect(deepExpand?.length).toBeGreaterThan(0);
          expect(deepExpand![0]).toHaveProperty('author');
          expect(deepExpand![0]).toHaveProperty('genre');
          expect(deepExpand![0]).toHaveProperty('reviews');
          expect(deepExpand![0]).toHaveProperty('price');
          expect(deepExpand![0]).toHaveProperty('stock');
          expect(deepExpand![0].reviews![0]).toHaveProperty('reviewer');
          expect(deepExpand![0].reviews![0].reviewer).toHaveProperty('ID');
          expect(findOneForExpandAll).not.toMatchObject(deepExpand![0]);
        });
      });

      describe('======> .getExpand() - OVERLOAD - {} (object)', () => {
        it('should return the original object + expanded "genre", "author" and "reviews" properties', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          const associations: Expand<Book> = {
            // expand 'author'
            author: {},

            // expand 'genre', having only 'ID' and 'name'
            genre: {
              select: ['ID', 'parent'],
            },

            // expand 'reviews', having only 'ID' and 'book_ID' and 'reviewer'
            reviews: {
              select: ['ID', 'comment'],

              // expand 'reviewer', having only the 'ID'
              expand: {
                reviewer: {
                  select: ['ID'],
                },
              },
            },
          };

          // Act
          const deepExpand = await bookRepository.builder().find({ ID: 201 }).getExpand(associations).execute();

          // deepExpand[0]

          // Assert
          expect(deepExpand?.length).toBeGreaterThan(0);
          expect(deepExpand![0]).toHaveProperty('author');
          expect(deepExpand![0]).toHaveProperty('genre');
          expect(deepExpand![0]).toHaveProperty('reviews');
          expect(deepExpand![0]).toHaveProperty('price');
          expect(deepExpand![0]).toHaveProperty('stock');
          expect(deepExpand![0].reviews![0]).toHaveProperty('reviewer');
          expect(deepExpand![0].reviews![0].reviewer).toHaveProperty('ID');
          expect(findOneForExpandAll).not.toMatchObject(deepExpand![0]);
        });

        it('should return only the expanded "genre", "author" and "reviews" properties', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const deepExpand = await bookRepository
            .builder()
            .find({ ID: 201 })
            .columns('author', 'genre', 'reviews')
            .getExpand({
              // expand full 'author' up to 1 level
              author: {},

              // expand 'genre', having only 'ID' and 'name'
              genre: {
                select: ['ID', 'parent'],
              },

              // expand 'reviews', having only 'ID' and 'book_ID' and 'reviewer'
              reviews: {
                // select: ['ID', 'book_ID'], // omit this, take everything in the reviews

                // expand 'reviewer', having only the 'ID'
                expand: {
                  reviewer: {
                    select: ['ID'],
                  },
                },
              },
            })
            .execute();

          // Assert
          expect(deepExpand?.length).toBeGreaterThan(0);
          expect(deepExpand![0]).toHaveProperty('author');
          expect(deepExpand![0]).toHaveProperty('genre');
          expect(deepExpand![0]).toHaveProperty('reviews');
          expect(deepExpand![0].reviews![0]).toHaveProperty('reviewer');
          expect(deepExpand![0].reviews![0]).toHaveProperty('comment');
          expect(deepExpand![0].reviews![0]).toHaveProperty('rating');
          expect(deepExpand![0].reviews![0].reviewer).toHaveProperty('ID');
          expect(deepExpand![0]).not.toHaveProperty('price');
          expect(deepExpand![0]).not.toHaveProperty('stock');
          expect(findOneForExpandAll).not.toMatchObject(deepExpand![0]);
        });
      });

      describe('======> .getExpand() - OVERLOAD - [] (array)', () => {
        it('should return the original object + expanded "genre" property - .getExpand("genre")', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const expanded = await bookRepository.builder().find({ ID: 201 }).getExpand('genre', 'reviews').execute();

          // Assert
          expect(expanded?.length).toBeGreaterThan(0);
          expect(expanded![0]).toHaveProperty('genre');
          expect(expanded![0]).toHaveProperty('reviews');
          expect(expanded![0].reviews?.length).toBeGreaterThan(0);
          expect(findOneForExpandAll).not.toMatchObject(expanded![0]);
        });
      });

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
            .getExpand('reviews')
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
            .orderDesc('stock', 'price')
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

      describe('======> .paginate()', () => {
        it('should return only 1 item when limited to 1', async () => {
          // Act
          const paginate = await bookRepository
            .builder()
            .find({ currency_code: 'GBP' })
            .paginate({ limit: 1 })
            .execute();

          // Assert
          expect(paginate).toHaveLength(1);
        });
      });

      describe('======> .paginate()', () => {
        it('should return only 1 item when limited to 2 with skip 1', async () => {
          // Arrange
          const all = await bookRepository.builder().find({ currency_code: 'GBP' }).execute();

          // Act
          const paginate = await bookRepository
            .builder()
            .find({ currency_code: 'GBP' })
            .paginate({ limit: 2, skip: 1 })
            .execute();

          // Assert
          expect(paginate).toHaveLength(2);
          expect(paginate).not.toContain(all![0]);
        });
      });

      describe('======> .columnFormatter()', () => {
        it('should return 1 item having 2 new properties "theAvg", "stockRenamed"', async () => {
          // Arrange
          const originalItem = await bookRepository.builder().find({ ID: 201 }).execute();

          // Act
          const columnFormatter = await bookRepository
            .builder()
            .find({ currency_code: 'GBP' })
            .getExpand('reviews')
            .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
            .columnsFormatter(
              { column: 'price', aggregate: 'AVG', renameAs: 'theAvg' },
              { column: 'stock', aggregate: 'AVG', renameAs: 'stockRenamed' },
            )
            .execute();

          // Assert
          expect(columnFormatter).toHaveLength(1);
          expect(columnFormatter![0]).not.toEqual(originalItem![0]);
          expect(columnFormatter![0]).toHaveProperty('theAvg');
          expect(columnFormatter![0]).toHaveProperty('stockRenamed');
        });

        describe('.columnFormatter() - NUMERIC AGGREGATE FUNCTIONS', () => {
          it("'AVG' | 'MIN' | 'MAX' | 'SUM' | 'ABS' | 'CEILING' | 'TOTAL'", async () => {
            // Arrange
            const originalItem = await bookRepository.builder().find({ ID: 201 }).execute();

            // Act
            const AVG = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'AVG', renameAs: 'AVG' })
              .execute();

            // Assert
            expect(AVG).toHaveLength(1);
            expect(AVG![0]).toHaveProperty('AVG');

            const MIN = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'MIN', renameAs: 'MIN' })
              .forUpdate()
              .execute();

            // Assert
            expect(MIN).toHaveLength(1);
            expect(MIN![0]).toHaveProperty('MIN');

            const MAX = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'MAX', renameAs: 'MAX' })
              .execute();

            // Assert
            expect(MAX).toHaveLength(1);
            expect(MAX![0]).toHaveProperty('MAX');

            const SUM = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'SUM', renameAs: 'SUM' })
              .execute();

            // Assert
            expect(SUM).toHaveLength(1);
            expect(SUM![0]).toHaveProperty('SUM');

            const ABS = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'ABS', renameAs: 'ABS' })
              .execute();

            // Assert
            expect(ABS).toHaveLength(3);
            expect(ABS![0]).toHaveProperty('ABS');

            const CEILING = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'CEILING', renameAs: 'CEILING' })
              .execute();

            // Assert
            expect(CEILING).toHaveLength(3);
            expect(CEILING![0]).toHaveProperty('CEILING');

            const TOTAL = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'TOTAL', renameAs: 'TOTAL' })
              .execute();

            // Assert
            expect(TOTAL).toHaveLength(1);
            expect(TOTAL![0]).toHaveProperty('TOTAL');

            const COUNT = await bookRepository
              .builder()
              .find()
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'COUNT', renameAs: 'COUNT' })
              .execute();

            // Assert
            expect(COUNT).toHaveLength(1);
            expect(COUNT![0].COUNT).toBe(6);
            expect(COUNT![0]).toHaveProperty('COUNT');

            const ROUND = await bookRepository
              .builder()
              .find()
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'ROUND', renameAs: 'ROUND' })
              .execute();

            // Assert
            expect(ROUND).toHaveLength(6);
            expect(ROUND![0]).toHaveProperty('ROUND');

            const FLOOR = await bookRepository
              .builder()
              .find()
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'price', aggregate: 'FLOOR', renameAs: 'FLOOR' })
              .execute();

            // Assert
            expect(FLOOR).toHaveLength(6);
            expect(FLOOR![0]).toHaveProperty('FLOOR');
          });
        });

        describe('.columnFormatter() - STRING AGGREGATE FUNCTIONS', () => {
          it("'LOWER' | 'UPPER' | 'LENGTH' & Two columns string ======> 'CONCAT'", async () => {
            // Arrange
            const originalItem = await bookRepository.builder().find({ ID: 201 }).execute();

            // Act
            const LOWER = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'descr', aggregate: 'LOWER', renameAs: 'LOWER' })
              .execute();

            // Assert
            expect(LOWER).toHaveLength(3);
            expect(LOWER![0]).toHaveProperty('LOWER');

            const UPPER = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'descr', aggregate: 'UPPER', renameAs: 'UPPER' })
              .execute();

            // Assert
            expect(UPPER).toHaveLength(3);
            expect(UPPER![0]).toHaveProperty('UPPER');

            const LENGTH = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'descr', aggregate: 'LENGTH', renameAs: 'LENGTH' })
              .execute();

            // Assert
            expect(LENGTH).toHaveLength(3);
            expect(LENGTH![0]).toHaveProperty('LENGTH');

            const CONCAT = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column1: 'price', column2: 'descr', aggregate: 'CONCAT', renameAs: 'CONCAT' })
              .execute();

            // Assert
            expect(CONCAT).toHaveLength(3);
            expect(CONCAT![0]).toHaveProperty('CONCAT');

            const TRIM = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'descr', aggregate: 'TRIM', renameAs: 'TRIM' })
              .execute();

            // Assert
            expect(TRIM).toHaveLength(3);
            expect(TRIM![0]).toHaveProperty('TRIM');
          });
        });

        describe('.columnFormatter() - DATE AGGREGATE FUNCTIONS', () => {
          it("'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND'", async () => {
            // Arrange
            const originalItem = await bookRepository.builder().find({ ID: 201 }).execute();

            // Act
            const DAY = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'createdAt', aggregate: 'DAY', renameAs: 'DAY' })
              .execute();

            // Assert
            expect(DAY).toHaveLength(3);
            expect(DAY![0]).toHaveProperty('DAY');

            const MONTH = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'createdAt', aggregate: 'MONTH', renameAs: 'MONTH' })
              .execute();

            // Assert
            expect(MONTH).toHaveLength(3);
            expect(MONTH![0]).toHaveProperty('MONTH');

            const YEAR = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'createdAt', aggregate: 'YEAR', renameAs: 'YEAR' })
              .execute();

            // Assert
            expect(YEAR).toHaveLength(3);
            expect(YEAR![0]).toHaveProperty('YEAR');

            const HOUR = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'createdAt', aggregate: 'HOUR', renameAs: 'HOUR' })
              .execute();

            // Assert
            expect(HOUR).toHaveLength(3);
            expect(HOUR![0]).toHaveProperty('HOUR');

            const MINUTE = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({ column: 'createdAt', aggregate: 'MINUTE', renameAs: 'MINUTE' })
              .execute();

            // Assert
            expect(MINUTE).toHaveLength(3);
            expect(MINUTE![0]).toHaveProperty('MINUTE');

            const SECOND = await bookRepository
              .builder()
              .find({ currency_code: 'GBP' })
              .getExpand('reviews')
              .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
              .columnsFormatter({
                column: 'createdAt',
                aggregate: 'SECOND',
                renameAs: 'SECOND',
              })
              .execute();

            // Assert
            expect(SECOND).toHaveLength(3);
            expect(SECOND![0]).toHaveProperty('SECOND');
          });
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

    /**
     * ################################################################################################################################
     * OVERLOAD 3
     * ################################################################################################################################
     */
    describe('======> .find(filter) - with filter / or filters - [OVERLOAD 3]', () => {
      it('should return only matching items based on nested AND/OR filters', async () => {
        // Arrange
        const initialResult = await bookRepository.getAll();

        const nestedFilter = new Filter<Book>([
          new Filter<Book>({
            field: 'genre_ID',
            operator: 'EQUALS',
            value: 13,
          }),
          'AND',
          new Filter<Book>({
            field: 'price',
            operator: 'EQUALS',
            value: 150,
          }),
        ]);

        const filter2 = new Filter<Book>({
          field: 'stock',
          operator: 'NOT EQUAL',
          value: 100,
        });

        const filter3 = new Filter<Book>({
          field: 'descr',
          operator: 'STARTS_WITH',
          value: 'Catweazle',
        });

        const filter4 = new Filter<Book>({
          field: 'currency_code',
          operator: 'EQUALS',
          value: 'JPY',
        });

        const combinedFilter = new Filter<Book>([nestedFilter, 'AND', filter2, 'AND', filter3, 'OR', filter4]);

        // Act
        const results = await bookRepository.builder().find(combinedFilter).execute();

        // Assert
        const matchedItem = results![0];

        expect(results!.length).toBe(1);
        expect(initialResult?.length).toBeGreaterThan(results!.length);
        expect(matchedItem.genre_ID).toBe(13);
        expect(matchedItem.price).toBe(150);
        expect(matchedItem.stock).not.toBe(100);
        expect(matchedItem.descr!.startsWith('Catweazle') || matchedItem.currency_code === 'JPY').toBe(true);
      });

      it('should return books with genre_ID 13 and price 150', async () => {
        // Arrange
        const initialResult = await bookRepository.getAll();

        const simpleFilter = new Filter<Book>([
          new Filter<Book>({
            field: 'genre_ID',
            operator: 'EQUALS',
            value: 13,
          }),
          'AND',
          new Filter<Book>({
            field: 'price',
            operator: 'EQUALS',
            value: 150,
          }),
        ]);

        // Act
        const results = await bookRepository.builder().find(simpleFilter).execute();

        // Assert
        const matchedItem = results![0];

        expect(results!.length).toBe(1);
        expect(matchedItem.genre_ID).toBe(13);
        expect(matchedItem.price).toBe(150);
        expect(initialResult?.length).toBeGreaterThan(results!.length);
      });

      describe('======> Filter - NOT EQUAL', () => {
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

      describe('======> Filter - NOT EQUALS (null)', () => {
        it('should return 6 records', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'ID',
            operator: 'NOT EQUAL',
            value: null,
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(6);
        });
      });

      describe('======> Filter - EQUALS', () => {
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

      describe('======> Filter - ENDS_WITH', () => {
        it('should return 2 records containing in the "descr" field the string "1850." ', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'descr',
            operator: 'ENDS_WITH',
            value: '1850.',
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(1);

          results?.forEach((item) => expect(item.descr).toContain((filter.value as string).replace(/%/g, '')));
        });
      });

      describe('======> Filter - STARTS_WITH', () => {
        it('should return 2 records containing in the "descr" field the string "Wuthering" ', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'descr',
            operator: 'STARTS_WITH',
            value: 'Wuthering',
          });

          // Act
          const results = await bookRepository.builder().find(filter).execute();

          // Assert
          expect(results).toHaveLength(1);

          results?.forEach((item) => expect(item.descr).toContain((filter.value as string).replace(/%/g, '')));
        });
      });

      describe('======> Filter - LIKE', () => {
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
          expect(results).toHaveLength(1);

          results?.forEach((item) => expect(item.descr).toContain((filter.value as string).replace(/%/g, '')));
        });
      });

      describe('======> Filter - BETWEEN', () => {
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

      describe('======> Filter - NOT BETWEEN', () => {
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

      describe('======> Filter - IN', () => {
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

      describe('======> Filter - NOT IN', () => {
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

      describe('======> Filter - GREATER THAN', () => {
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

      describe('======> Filter - GREATER THAN OR EQUALS', () => {
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

      describe('======> Filter - LESS THAN', () => {
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

      describe('======> Filter - LESS THAN OR EQUALS', () => {
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

      describe('======> Filter - IS NULL / IS NOT NULL', () => {
        it('should return books with descr field NULL and only one result', async () => {
          // Arrange
          const initialResult = await bookRepository.getAll();

          const simpleFilter = new Filter<Book>({ field: 'descr', operator: 'IS NULL' });

          // Act
          const results = await bookRepository.builder().find(simpleFilter).execute();

          // Assert
          const matchedItem = results![0];

          expect(results!.length).toBe(1);
          expect(matchedItem.price).toBe(11.11);
          expect(initialResult?.length).toBeGreaterThan(results!.length);
        });

        it('should return books with descr field NOT NULL and get 6 results', async () => {
          // Arrange
          const initialResult = await bookRepository.getAll();

          const simpleFilter = new Filter<Book>({ field: 'descr', operator: 'IS NOT NULL' });

          // Act
          const results = await bookRepository.builder().find(simpleFilter).execute();

          // Assert
          const matchedItem = results![0];

          expect(results!.length).toBe(5);
          expect(initialResult?.length).toBeGreaterThan(results!.length);
        });
      });

      describe('======> Filter - LIKE - BETWEEN - IN - multiple filters', () => {
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
  });
});
