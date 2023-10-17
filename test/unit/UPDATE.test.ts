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

  // TODO DELETE
  // !!!!
  // describe('.updateMany()', () => {
  //   test('It should RETURN : updateMany() multiple items from the db', async () => {
  //     const bookRepository = await getBookRepository(cds);

  //     const findAnItem = await bookRepository.find({ ID: 271 });
  //     const findTheOtherItem = await bookRepository.find({ ID: 252 });

  //     const findAnItemAfterUpdate = await bookRepository.find({ ID: 271 });
  //     const findTheOtherItemAfterUpdate = await bookRepository.find({ ID: 252 });

  //     expect(updatedItem).toBe(true);
  //     expect([findAnItem, findTheOtherItem]).not.toMatchObject([findAnItemAfterUpdate, findTheOtherItemAfterUpdate]);

  //     // !!!! TODO arguments types are ugly ...
  //   });
  // });

  describe('.updateLocaleTexts()', () => {
    test('It should RETURN : updateLocalTexts() update "Locale" languages text', async () => {
      const bookRepository = await getBookRepository(cds);

      const updatedLocaleItem = await bookRepository.updateLocaleTexts(
        { locale: 'de', ID: 201 },
        { title: 'a NEW TITLE : UPDATED' },
      );

      expect(updatedLocaleItem).toBe(true);

      const allLocalizedTexts = await bookRepository.getLocaleTexts();

      // TODO make the test better
    });
  });
});
