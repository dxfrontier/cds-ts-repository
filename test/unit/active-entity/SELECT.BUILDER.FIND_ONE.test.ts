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

  describe('.builder().findOne()', () => {
    describe('======> .findOne(filter) - with filter / filters - [OVERLOAD 1]', () => {
      describe('======> Filter - Multidimensional filter [[filter1, "AND", filter2]]', () => {
        it('should return 1 record with genre_ID EQUALS to 13 and price EQUALS to 150', async () => {
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

          // Act
          const one = await bookRepository.builder().findOne(nestedFilter).execute();

          // Assert
          expect(initialResult).toContainEqual(one);
          expect(one).toBeDefined();
          expect(one).toMatchObject({
            genre_ID: 13,
            price: 150,
          });
        });
      });

      describe('======> Filter - NOT EQUAL', () => {
        it('should return 1 record and with ID NOT EQUAL to 251 ', async () => {
          // Arrange
          const initialResult = await bookRepository.getAll();
          const filter = new Filter<Book>({
            field: 'ID',
            operator: 'NOT EQUAL',
            value: 251,
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(initialResult).toContainEqual(one);
        });
      });

      describe('======> Filter - EQUALS', () => {
        it('should return 1 record with the ID 251', async () => {
          // Arrange
          const initialResult = await bookRepository.getAll();
          const filter = new Filter<Book>({
            field: 'ID',
            operator: 'EQUALS',
            value: 251,
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();
          const found = initialResult?.filter((item) => item.ID === one?.ID);

          // Assert
          expect(initialResult).toContainEqual(one);
          expect(one?.ID).toBe(found![0].ID);
        });
      });

      describe('======> Filter - ENDS_WITH', () => {
        it('should return 1 record containing in the "descr" field the string "1850." ', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'descr',
            operator: 'ENDS_WITH',
            value: '1850.',
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert

          expect(one?.descr).toContain('1850');
        });
      });

      describe('======> Filter - STARTS_WITH', () => {
        it('should return 1 record containing in the "descr" field the string "Wuthering" ', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'descr',
            operator: 'STARTS_WITH',
            value: 'Wuthering',
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.descr).toContain('Wuthering');
        });
      });

      describe('======> Filter - LIKE', () => {
        it('should return 1 record containing in the "descr" field the string "Wuthering" ', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'descr',
            operator: 'LIKE',
            value: 'Wuthering',
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert

          expect(one?.descr).toContain('Wuthering');
        });
      });

      describe('======> Filter - BETWEEN', () => {
        it('should return 1 record between stock 11 and 333', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'BETWEEN',
            value1: 11,
            value2: 333,
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.stock).toBeGreaterThan(filter.value1 as number);
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
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.stock).toBeGreaterThan(filter.value1 as number);
        });
      });

      describe('======> Filter - IN', () => {
        it('should return 1 record containing currency code GBP', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'currency_code',
            operator: 'IN',
            value: ['USD', 'GBP'],
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.currency_code).toBe('GBP');
        });
      });

      describe('======> Filter - NOT IN', () => {
        it('should return only 1 record containing "JPY"', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'currency_code',
            operator: 'NOT IN',
            value: ['USD', 'GBP'],
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.currency_code).toBe('JPY');
        });
      });

      describe('======> Filter - GREATER THAN', () => {
        it('should return only 1 record that have stock greater than 12', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'GREATER THAN',
            value: 12,
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.stock).toBeGreaterThan(filter.value as number);
        });
      });

      describe('======> Filter - GREATER THAN OR EQUALS', () => {
        it('should return only 1 record that have stock greater or equals to 12', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'GREATER THAN OR EQUALS',
            value: 12,
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.stock).toBeGreaterThanOrEqual(filter.value as number);
        });
      });

      describe('======> Filter - LESS THAN', () => {
        it('should return only 1 record that have stock less than 12', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'LESS THAN',
            value: 333,
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.stock).toBeLessThan(filter.value as number);
        });
      });

      describe('======> Filter - LESS THAN OR EQUALS', () => {
        it('should return only 1 record that have stock less than 12', async () => {
          // Arrange
          const filter = new Filter<Book>({
            field: 'stock',
            operator: 'LESS THAN OR EQUALS',
            value: 333,
          });

          // Act
          const one = await bookRepository.builder().findOne(filter).execute();

          // Assert
          expect(one?.stock).toBeLessThanOrEqual(filter.value as number);
        });
      });

      describe('======> Filter - LIKE - BETWEEN - IN - multiple filters', () => {
        it('should return 1 record containing (currency_code = "GBP" OR stock BETWEEN 11 and 333) AND ID IN ("203", "201", "207")', async () => {
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
          const one = await bookRepository.builder().findOne(filters).execute();

          // Assert

          expect(one?.currency_code).not.toBe('JPY');
          expect(one?.currency_code).not.toBe('USD');
          expect(one?.stock).toBeGreaterThanOrEqual(filterBetween.value1 as number);
          expect(one?.stock).toBeLessThanOrEqual(filterBetween.value2 as number);
        });
      });
    });

    describe('======> .findOne({ ... }) - with object - [OVERLOAD 2]', () => {
      describe('======> .getExpand() - OVERLOAD - AUTO EXPAND - { levels : number }', () => {
        it('should return the original object + expanded "genre", "author" and "reviews" properties', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const deepExpand = await bookRepository.builder().findOne({ ID: 201 }).getExpand({ levels: 2 }).execute();

          // Assert
          expect(deepExpand).toBeDefined();
          expect(Array.isArray(deepExpand)).toBe(false);
          expect(deepExpand).toHaveProperty('author');
          expect(deepExpand).toHaveProperty('genre');
          expect(deepExpand).toHaveProperty('reviews');

          expect(deepExpand).toHaveProperty('price');
          expect(deepExpand).toHaveProperty('stock');

          expect(deepExpand?.reviews![0]).toHaveProperty('reviewer');
          expect(deepExpand?.reviews![0].reviewer).toHaveProperty('ID');

          expect(findOneForExpandAll).not.toMatchObject(deepExpand!);
        });

        it('should return the original object + expanded "genre", "author" and "reviews" properties', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const deepExpand = await bookRepository.builder().findOne({ ID: 201 }).getExpand({ levels: 2 }).execute();

          // Assert
          expect(deepExpand).toBeDefined();
          expect(Array.isArray(deepExpand)).toBe(false);
          expect(deepExpand).toHaveProperty('author');
          expect(deepExpand).toHaveProperty('genre');
          expect(deepExpand).toHaveProperty('reviews');

          expect(deepExpand).toHaveProperty('price');
          expect(deepExpand).toHaveProperty('stock');

          expect(deepExpand?.reviews![0]).toHaveProperty('reviewer');
          expect(deepExpand?.reviews![0].reviewer).toHaveProperty('ID');

          expect(findOneForExpandAll).not.toMatchObject(deepExpand!);
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
          const deepExpand = await bookRepository.builder().findOne({ ID: 201 }).getExpand(associations).execute();

          // Assert
          expect(deepExpand).toBeDefined();
          expect(Array.isArray(deepExpand)).toBe(false);
          expect(deepExpand).toHaveProperty('author');
          expect(deepExpand).toHaveProperty('genre');
          expect(deepExpand).toHaveProperty('reviews');

          expect(deepExpand).toHaveProperty('price');
          expect(deepExpand).toHaveProperty('stock');

          expect(deepExpand?.reviews![0]).toHaveProperty('reviewer');
          expect(deepExpand?.reviews![0].reviewer).toHaveProperty('ID');

          expect(findOneForExpandAll).not.toMatchObject(deepExpand!);
        });

        it('should return only the expanded "genre", "author" and "reviews" properties', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const deepExpand = await bookRepository
            .builder()
            .findOne({ ID: 201 })
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

          expect(deepExpand).toBeDefined();
          expect(Array.isArray(deepExpand)).toBe(false);
          expect(deepExpand).toHaveProperty('author');
          expect(deepExpand).toHaveProperty('genre');
          expect(deepExpand).toHaveProperty('reviews');

          expect(deepExpand?.reviews![0]).toHaveProperty('reviewer');
          expect(deepExpand?.reviews![0]).toHaveProperty('comment');
          expect(deepExpand?.reviews![0]).toHaveProperty('rating');

          expect(deepExpand?.reviews![0].reviewer).toHaveProperty('ID');

          expect(deepExpand).not.toHaveProperty('price');
          expect(deepExpand).not.toHaveProperty('stock');

          expect(findOneForExpandAll).not.toMatchObject(deepExpand!);
        });
      });

      describe('======> .getExpand() - OVERLOAD - [] (array)', () => {
        it('should return the original object + expanded "genre" property - .getExpand("genre")', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          const one = await bookRepository.builder().findOne({ ID: 201 }).getExpand('genre', 'reviews').execute();

          // Assert
          expect(one).toBeDefined();
          expect(Array.isArray(one)).toBe(false);
          expect(one).toHaveProperty('genre');
          expect(one).toHaveProperty('reviews');
          expect(findOneForExpandAll).not.toMatchObject(one!);
        });
      });

      describe('======> .getExpand() + .columns() ', () => {
        it('should return only the columns "currency_code, descr, reviews" + expanded "reviews" property', async () => {
          // Arrange
          const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

          // Act
          // When .getExpand first and after the .columns
          const findOneArrayStyle = await bookRepository
            .builder()
            .findOne({ ID: 201 })
            .getExpand(['reviews'])
            .columns(['currency_code', 'descr', 'reviews'])
            .execute();

          // When .columns first and after the .getExpand
          const findOneSpreadArrayStyle = await bookRepository
            .builder()
            .findOne({ ID: 201 })
            .columns('currency_code', 'descr', 'reviews')
            .getExpand('reviews')
            .execute();

          // Assert
          expect(findOneArrayStyle).toBeDefined();

          expect(Array.isArray(findOneArrayStyle)).toBe(false);
          expect(findOneArrayStyle).toHaveProperty('currency_code');
          expect(findOneArrayStyle).toHaveProperty('descr');
          expect(findOneArrayStyle).toHaveProperty('reviews');

          expect(findOneSpreadArrayStyle).toHaveProperty('currency_code');
          expect(findOneSpreadArrayStyle).toHaveProperty('descr');
          expect(findOneSpreadArrayStyle).toHaveProperty('reviews');

          expect(findOneForExpandAll).not.toMatchObject(findOneArrayStyle!);
          expect(findOneForExpandAll).not.toMatchObject(findOneSpreadArrayStyle!);
        });
      });

      describe('======> .columns()', () => {
        it('columns should return 1 entry with only 2 columns ID and descr - .columns(["ID", "descr"])', async () => {
          // Act
          const one = await bookRepository
            .builder()
            .findOne({ currency_code: 'USD' })
            .columns(['ID', 'descr'])
            .execute();

          // Assert
          expect(one).toBeDefined();
          expect(Array.isArray(one)).toBe(false);
          expect(one).toHaveProperty('ID');
          expect(one).toHaveProperty('descr');
          expect(one).not.toHaveProperty('title');
          expect(one).not.toHaveProperty('price');
          expect(one).not.toHaveProperty('currency_code');
        });

        it('should return 1 entry with only 2 columns ID and descr - .columns("ID", "descr")', async () => {
          // Act
          const one = await bookRepository.builder().findOne({ currency_code: 'USD' }).columns('ID', 'descr').execute();

          // Assert
          expect(one).toBeDefined();
          expect(Array.isArray(one)).toBe(false);
          expect(one).toHaveProperty('ID');
          expect(one).toHaveProperty('descr');
          expect(one).not.toHaveProperty('title');
          expect(one).not.toHaveProperty('price');
          expect(one).not.toHaveProperty('currency_code');
        });
      });

      describe('======> .columnFormatter()', () => {
        it('should return 1 item having 2 new properties "SMALL_DESCR", "UPPER_DESCR"', async () => {
          // Arrange
          const originalItem = await bookRepository.builder().find({ ID: 201 }).execute();
          // TODO: the spread operator cannot be type safe and for that make a throw new Error and check if it's empty or not

          // Act
          const one = await bookRepository
            .builder()
            .findOne({ currency_code: 'GBP' })
            .getExpand('reviews')
            .columns('createdAt', 'author', 'reviews', 'price', 'stock', 'descr', 'currency_code')
            .columnsFormatter(
              { column: 'descr', aggregate: 'LOWER', renameAs: 'SMALL_DESCR' },
              { column: 'descr', aggregate: 'UPPER', renameAs: 'UPPER_DESCR' },
            )
            .execute();

          // Assert
          expect(one).toBeDefined();
          expect(Array.isArray(one)).toBe(false);
          expect(one).toHaveProperty('SMALL_DESCR');
          expect(one).toHaveProperty('UPPER_DESCR');
        });
      });

      describe('======> .execute()', () => {
        it('should execute the Promise and return one result', async () => {
          // Act
          const one = await bookRepository.builder().findOne({ currency_code: 'GBP' }).execute();

          // Assert
          expect(one).toBeDefined();
          expect(Array.isArray(one)).toBe(false);
          expect(one).toHaveProperty('ID');
        });
      });
    });
  });
});
