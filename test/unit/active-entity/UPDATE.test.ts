import { Book } from '#cds-models/CatalogService';

import { Filter } from '../../../lib/util/filter/Filter';
import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('UPDATE', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.update()', () => {
    test('should successfully update an item in the database', async () => {
      const findAnItem = await bookRepository.find({ ID: 203 });
      const updatedItem = await bookRepository.update({ ID: 203 }, { descr: 'A NEW DESCRIPTION !' });
      const findAnItemAfterUpdate = await bookRepository.find({ ID: 203 });

      expect(updatedItem).toBe(true);
      expect(findAnItem).not.toMatchObject(findAnItemAfterUpdate!);
    });
  });

  describe('.updateLocaleTexts()', () => {
    test('should successfully update "Locale" languages text', async () => {
      const textToUpdate = 'a NEW TITLE : UPDATED';

      const updatedLocaleItem = await bookRepository.updateLocaleTexts(
        { locale: 'de', ID: 201 },
        { title: textToUpdate },
      );

      const allLocalizedTexts = await bookRepository.getLocaleTexts(['descr', 'title', 'ID']);
      const foundUpdated = allLocalizedTexts!.filter((item) => item.ID === 201 && item.locale === 'de');

      expect(updatedLocaleItem).toBe(true);
      expect(foundUpdated[0].title).toBe(textToUpdate);
    });
  });

  describe('.updateMany()', () => {
    test('should successfully update multiple items matching the keys', async () => {
      // Arrange
      const originalBooks = await bookRepository.find({ currency_code: 'GBP' });
      const originalCount = originalBooks!.length;

      // Act
      const updatedCount = await bookRepository.updateMany({ currency_code: 'GBP' }, { descr: 'BULK UPDATED' });

      // Assert
      expect(updatedCount).toBe(originalCount);

      const updatedBooks = await bookRepository.find({ currency_code: 'GBP' });
      updatedBooks!.forEach((book) => {
        expect(book.descr).toBe('BULK UPDATED');
      });
    });

    test('should successfully update multiple items matching a filter', async () => {
      // Arrange
      const filter = new Filter<Book>({
        field: 'stock',
        operator: 'GREATER THAN',
        value: 10,
      });
      const originalBooks = await bookRepository.find(filter);
      const originalCount = originalBooks!.length;

      // Act
      const updatedCount = await bookRepository.updateMany(filter, { descr: 'FILTER BULK UPDATED' });

      // Assert
      expect(updatedCount).toBe(originalCount);
    });

    test('should return 0 when no items match the criteria', async () => {
      // Act
      const updatedCount = await bookRepository.updateMany({ ID: 99999 }, { descr: 'NON EXISTENT' });

      // Assert
      expect(updatedCount).toBe(0);
    });
  });
});
