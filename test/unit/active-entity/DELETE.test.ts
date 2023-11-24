import BookRepository from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('DELETE', () => {
  startTestServer(__dirname, 'bookshop');

  let bookRepository: BookRepository;

  beforeAll(async () => {
    bookRepository = new BookRepository();
  });

  describe('.delete()', () => {
    test('should successfully delete an item from the database', async () => {
      const getAll = await bookRepository.getAll();
      const deleteOperation = await bookRepository.delete({ ID: 201 });
      const getAllAfter = await bookRepository.getAll();

      expect(deleteOperation).toBe(true);
      expect(getAll.length).toBeGreaterThan(getAllAfter.length);
    });
  });

  describe('.deleteMany()', () => {
    test('should successfully delete multiple items from the database', async () => {
      const getAll = await bookRepository.getAll();
      const deleteAllOperation = await bookRepository.deleteMany([{ ID: 207 }, { ID: 251 }]);
      const getAllAfter = await bookRepository.getAll();

      expect(deleteAllOperation).toBe(true);
      expect(getAll.length).toBeGreaterThan(getAllAfter.length);
    });
  });
});
