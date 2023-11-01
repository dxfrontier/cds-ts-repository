import { connectTest, getBookRepository } from '../util/util';

const cds = connectTest(__dirname, 'bookshop');

describe('UPDATE', () => {
  describe('.update()', () => {
    test('It should RETURN : update() an item from the db', async () => {
      const bookRepository = await getBookRepository(cds);
      const findAnItem = await bookRepository.find({ ID: 203 });
      const updatedItem = await bookRepository.update({ ID: 203 }, { descr: 'A NEW DESCRIPTION !' });
      const findAnItemAfterUpdate = await bookRepository.find({ ID: 203 });

      expect(updatedItem).toBe(true);
      expect(findAnItem).not.toMatchObject(findAnItemAfterUpdate);
    });
  });

  describe('.updateLocaleTexts()', () => {
    test('It should RETURN : updateLocalTexts() update "Locale" languages text', async () => {
      const bookRepository = await getBookRepository(cds);
      const locale = 'de';
      const textToUpdate = 'a NEW TITLE : UPDATED';

      const updatedLocaleItem = await bookRepository.updateLocaleTexts(
        { locale: locale, ID: 201 },
        { title: textToUpdate },
      );

      const allLocalizedTexts = await bookRepository.getLocaleTexts(['descr', 'title', 'ID']);
      const foundUpdated = allLocalizedTexts.filter((item) => item.ID === 201 && item.locale === locale);

      expect(updatedLocaleItem).toBe(true);
      expect(foundUpdated[0].title).toBe(textToUpdate);
    });
  });
});
