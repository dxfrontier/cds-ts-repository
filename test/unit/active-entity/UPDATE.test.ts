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
});
