import { connectTest, getCustomerRepository } from './util/util';

const cds = connectTest(__dirname, 'bookshop');

describe('DELETE', () => {

  describe('.delete()', () => {
    test('It should RETURN : .delete() deletion of an item from the DB', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const getAll = await customerRepository.getAll()
      const deleteOperation = await customerRepository.delete({ID : 201})
      const getAllAfter = await customerRepository.getAll()

      expect(deleteOperation).toBe(true);

      expect(getAll.length).toBeGreaterThan(getAllAfter.length)
    });
  });

  describe('.deleteAll()', () => {
    test('It should RETURN : .deleteAll() deletion of "multiple" items from the DB', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const getAll = await customerRepository.getAll()
      const deleteAllOperation = await customerRepository.deleteAll([{ID : 207}, {ID : 251}])
      const getAllAfter = await customerRepository.getAll()

      expect(deleteAllOperation).toBe(true);
      expect(getAll.length).toBeGreaterThan(getAllAfter.length)
    });
  });

});
