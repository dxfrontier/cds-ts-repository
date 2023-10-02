import { connectTest, getBookRepository } from './util/util';

const cds = connectTest(__dirname, 'bookshop');

describe('DELETE', () => {
  describe('.delete()', () => {
    test('It should RETURN : .delete() deletion of an item from the DB', async () => {
      const bookRepository = await getBookRepository(cds);
      const getAll = await bookRepository.getAll();
      const deleteOperation = await bookRepository.delete({ ID: 201 });
      const getAllAfter = await bookRepository.getAll();

      expect(deleteOperation).toBe(true);
      expect(getAll.length).toBeGreaterThan(getAllAfter.length);
    });
  });

  describe('.deleteAll()', () => {
    test('It should RETURN : .deleteAll() deletion of "multiple" items from the DB', async () => {
      const bookRepository = await getBookRepository(cds);
      const getAll = await bookRepository.getAll();
      const deleteAllOperation = await bookRepository.deleteAll([{ ID: 207 }, { ID: 251 }]);
      const getAllAfter = await bookRepository.getAll();

      expect(deleteAllOperation).toBe(true);
      expect(getAll.length).toBeGreaterThan(getAllAfter.length);
    });
  });
});
