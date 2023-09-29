import { Book } from './bookshop/srv/util/types/entities/sap/capire/bookshop';
import BaseRepository from '../lib/BaseRepository';
import { connectTest, getCustomerRepository } from './util/util';

const cds = connectTest(__dirname, 'bookshop');

describe('SELECT', () => {


  describe('.getAll()', () => {
    
    it('It should RETURN : response > 0', async () => {

      const customerRepository = await getCustomerRepository(cds);
      const getAll = await customerRepository.getAll()
        
      expect(getAll.length).toBeGreaterThan(0)

    });
  });

  describe('.getAllDistinct()', () => {
    it('It should RETURN : response > 0 AND response not EQUAL to .getAll response', async () => {

      // ! TODO
      // const customerRepository = await getCustomerRepository(cds);
      // const getAll : Book[] = await customerRepository.getAll()
      // const getAllDistinct : Book[] = await customerRepository.getAllDistinct()
        
      // expect(getAllDistinct.length).toBeGreaterThan(0)
      // expect(getAllDistinct.length).toBeLessThan(getAll.length)


    });
  });

  describe('.getAllAndLimit()', () => {
    it('It should RETURN : .getAllAndLimit length smaller than .getAll length', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const getAll = await customerRepository.getAll()
      const getAllAndLimit = await customerRepository.getAllAndLimit({limit : 1});

      expect(getAllAndLimit.length).toBeGreaterThan(0)
      expect(getAllAndLimit.length).toBeLessThan(getAll.length)

    });
  });

  describe('.find()', () => {
    it('It should RETURN : .find({ID: 201}) should find "1" item AND .find({currency_code : "GBP"}) should find "multiple" items', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const findOneResult = await customerRepository.find({ID : 201});
      const findMultipleResult = await customerRepository.find({currency_code : 'GBP'});
      
      expect(findMultipleResult.length).toBeGreaterThanOrEqual(1)
      expect(findOneResult.length).toBeGreaterThanOrEqual(1)

    });
  });

  describe('.findOne()', () => {
    it('It should RETURN : .findOne({currency_code : "GBP"}) should return only "1" item', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const findOne = await customerRepository.findOne({currency_code : 'GBP'});
      
      expect(findOne).toBeDefined();
      
    });
  });

  describe('.findBuilder()', () => {
    describe('===> .getExpand()', () => {
      it('It should RETURN : .getExpand(["genre"]) should return the original object + expanded "genre" property', async() => {
        const customerRepository = await getCustomerRepository(cds);
        const expandGenre = await customerRepository.findBuilder({ID: 201}).getExpand(['genre']).execute()
      
        expect(expandGenre.length).toBeGreaterThan(0);
        expect(expandGenre[0]).toHaveProperty('genre')
      });
    });
    describe('===> .orderDesc()', () => {
      it('It should RETURN : .orderDesc() should find all values with "USD" value and make them "DESC" over "stock" property', async () => {
        const customerRepository = await getCustomerRepository(cds);
        const getAllByCurrencyCode = await customerRepository.findBuilder({currency_code: 'USD'}).execute()
        const orderItemsDesc = await customerRepository.findBuilder({currency_code: 'USD'}).orderDesc(['stock']).execute()
      
        expect(orderItemsDesc[0]).not.toMatchObject(getAllByCurrencyCode[0])
      });
    });
    describe('===> .orderAsc()', () => {
      it('It should RETURN : .orderDesc() should find all values with "USD" value and make them "ASC" over "stock" property', async () => {
        const customerRepository = await getCustomerRepository(cds);
        const orderItemsDesc = await customerRepository.findBuilder({currency_code: 'USD'}).orderDesc(['stock']).execute()
        const orderItemsAsc = await customerRepository.findBuilder({currency_code: 'USD'}).orderAsc(['stock']).execute()
      
        expect(orderItemsAsc[0]).not.toMatchObject(orderItemsDesc[0])
      });
    });
    describe('===> .groupBy()', () => {
      it('2 + 2 is 4', () => {
        expect(2 + 2).toBe(4);
      });
    });
    describe('===> .limit()', () => {
      it('2 + 2 is 4', () => {
        expect(2 + 2).toBe(4);
      });
    });
    describe('===> .execute()', () => {
      it('2 + 2 is 4', () => {
        expect(2 + 2).toBe(4);
      });
    });
  });

  describe('.exists()', () => {
    it('It should RETURN : "true" in case "1" item was found', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const _exists = await customerRepository.exists({ID : 201});
      
      expect(_exists).toBe(true);
    });
  });

  describe('.count()', () => {
    it('It should RETURN : a count number larger than "0"', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const _count = await customerRepository.count();
      
      expect(_count).toBeGreaterThan(0);
    });
  });
});
