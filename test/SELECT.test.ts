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
    it('TODO', async () => {

      // TODO
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

    describe('======> .getExpand()', () => {
      it('It should RETURN : .getExpand(["genre"]) should return the original object + expanded "genre" property', async() => {
        const customerRepository = await getCustomerRepository(cds);
        const expandGenre = await customerRepository.findBuilder({ID: 201}).getExpand(['genre']).execute()
      
        expect(expandGenre.length).toBeGreaterThan(0);
        expect(expandGenre[0]).toHaveProperty('genre')
      });
    });

    describe('======> .orderDesc()', () => {
      it('It should RETURN : .orderDesc(["stock"]) should find all values with "USD" value and make them "DESC" over "stock" property', async () => {
        const customerRepository = await getCustomerRepository(cds);
        const getAllByCurrencyCode = await customerRepository.findBuilder({currency_code: 'USD'}).execute()
        const orderItemsDesc = await customerRepository.findBuilder({currency_code: 'USD'}).orderDesc(['stock']).execute()
      
        expect(orderItemsDesc[0]).not.toMatchObject(getAllByCurrencyCode[0])
      });
    });

    describe('======> .orderAsc()', () => {
      it('It should RETURN : .orderDesc(["stock"]) should find all values with "USD" value and make them "ASC" over "stock" property', async () => {
        const customerRepository = await getCustomerRepository(cds);
        const orderItemsDesc = await customerRepository.findBuilder({currency_code: 'USD'}).orderDesc(['stock']).execute()
        const orderItemsAsc = await customerRepository.findBuilder({currency_code: 'USD'}).orderAsc(['stock']).execute()
      
        expect(orderItemsAsc[0]).not.toMatchObject(orderItemsDesc[0])
      });
    });
    
    describe('======> .groupBy()', () => {
      it('It should RETURN : groupBy(["author"]) should group by column "author"', async () => {
        const customerRepository = await getCustomerRepository(cds);
        const groupBy = await customerRepository.findBuilder({currency_code: 'USD'}).groupBy(['author']).execute()

        expect(groupBy[0]).toBeDefined()

      });
    });
    
    describe('======> .limit()', () => {
      it('It should RETURN : .limit({limit: 1}) should return only 1 item', async () => {
        const customerRepository = await getCustomerRepository(cds);
        const limit = await customerRepository.findBuilder({currency_code: 'GBP'}).limit({limit : 1}).execute();

        expect(limit).toHaveLength(1);
      });
    });
    
    describe('======> .limit()', () => {
      it('It should RETURN : .limit({limit: 2, skip: 1}) should return only 1 item', async () => {
        const customerRepository = await getCustomerRepository(cds);
        const all = await customerRepository.findBuilder({currency_code: 'GBP'}).execute();
        const limit = await customerRepository.findBuilder({currency_code: 'GBP'}).limit({limit : 2, skip: 1}).execute();

        expect(limit).toHaveLength(2);
        expect(limit).not.toContain(all[0])
      });
    });

    describe('======> .execute()', () => {
      it('It should RETURN : .execute should execute the Promise and return results', async () => {
        const customerRepository = await getCustomerRepository(cds);
        const all = await customerRepository.findBuilder({currency_code: 'GBP'}).execute();

        expect(all).toBeDefined();

      });
    });
  });

  describe('.exists()', () => {
    it('It should RETURN : "true" in case "1" item was found', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const exists = await customerRepository.exists({ID : 201});
      
      expect(exists).toBe(true);
    });
  });

  describe('.count()', () => {
    it('It should RETURN : a count number larger than "0"', async () => {
      const customerRepository = await getCustomerRepository(cds);
      const count = await customerRepository.count();
      
      expect(count).toBeGreaterThan(0);
    });
  });
});
