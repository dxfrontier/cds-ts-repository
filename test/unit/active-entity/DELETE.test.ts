import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('DELETE', () => {
  startTestServer(__dirname, 'bookshop');

  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.delete()', () => {
    test('should successfully delete an item from the database', async () => {
      const getAll = await bookRepository.getAll();
      const deleteOperation = await bookRepository.delete({ ID: 201 });
      const getAllAfter = await bookRepository.getAll();

      expect(deleteOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });
  });

  describe('.deleteMany()', () => {
    it('should successfully delete multiple items from the database - deleteMany([{ ID : 207 }, { ID : 251 }])', async () => {
      const getAll = await bookRepository.getAll();
      const deleteAllOperation = await bookRepository.deleteMany([{ ID: 207 }, { ID: 251 }]);
      const getAllAfter = await bookRepository.getAll();

      expect(deleteAllOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });

    it('should successfully delete multiple items from the database - deleteMany({ ID: 201 }, { ID: 252 })', async () => {
      const getAll = await bookRepository.getAll();
      const deleteAllOperation = await bookRepository.deleteMany({ ID: 203 }, { ID: 252 });
      const getAllAfter = await bookRepository.getAll();

      expect(deleteAllOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });
  });
});
