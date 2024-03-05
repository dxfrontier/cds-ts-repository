import { Book } from '#cds-models/CatalogService';
import { Expand } from '../../../lib';
import { Filter } from '../../../lib/util/helpers/Filter';

import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('SELECT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.builder().findOne()', () => {
    // TODO:

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

    // describe('======> .getExpand() - OVERLOAD with no arguments - AUTO EXPAND - AUTO EXPOSE ', () => {
    //   it('should return the original object + expanded "genre", "author" and "reviews" properties', async () => {
    //     // Arrange
    //     const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

    //     // Act
    //     const deepExpand = await bookRepository.builder().findOne({ ID: 201 }).getExpand().execute();

    //     // Assert
    //     expect(deepExpand).toBeDefined();
    //     expect(Array.isArray(deepExpand)).toBe(false);
    //     expect(deepExpand).toHaveProperty('author');
    //     expect(deepExpand).toHaveProperty('genre');
    //     expect(deepExpand).toHaveProperty('reviews');

    //     expect(deepExpand).toHaveProperty('price');
    //     expect(deepExpand).toHaveProperty('stock');

    //     expect(deepExpand?.reviews![0]).toHaveProperty('reviewer');
    //     expect(deepExpand?.reviews![0].reviewer).toHaveProperty('ID');

    //     expect(findOneForExpandAll).not.toMatchObject(deepExpand!);
    //   });
    // });

    describe('======> .getExpand() - OVERLOAD with {} (object)', () => {
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

    describe('======> .getExpand() - OVERLOAD with [] (array)', () => {
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

    describe('======> .columns()', () => {
      it('columns should return 1 entry with only 2 columns ID and descr - .columns(["ID", "descr"])', async () => {
        // Act
        const one = await bookRepository.builder().findOne({ currency_code: 'USD' }).columns(['ID', 'descr']).execute();

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
