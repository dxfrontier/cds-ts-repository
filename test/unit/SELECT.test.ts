import { connectTest, getBookRepository } from '../util/util';

const cds = connectTest(__dirname, 'bookshop');

describe('SELECT', () => {
  describe('.getAll()', () => {
    it('It should RETURN : response > 0', async () => {
      const bookRepository = await getBookRepository(cds);
      const getAll = await bookRepository.getAll();

      expect(getAll.length).toBeGreaterThan(0);
    });
  });

  describe('.getDistinctColumns()', () => {
    it('It should RETURN : .getDistinctColumns() distinct columns by provided columns', async () => {
      const bookRepository = await getBookRepository(cds);
      const getDistinctColumns = await bookRepository.getDistinctColumns(['currency_code', 'ID']);

      expect(getDistinctColumns.length).toBeGreaterThan(0);
    });
  });

  describe('.getAllAndLimit()', () => {
    it('It should RETURN : .getAllAndLimit() length smaller than .getAll length', async () => {
      const bookRepository = await getBookRepository(cds);
      const getAll = await bookRepository.getAll();
      const getAllAndLimit = await bookRepository.getAllAndLimit({ limit: 1 });

      expect(getAllAndLimit.length).toBeGreaterThan(0);
      expect(getAllAndLimit.length).toBeLessThan(getAll.length);
    });
  });

  describe('.getLocaleTexts()', () => {
    test('It should RETURN : getLocaleTexts() will return all "Locale" languages text', async () => {
      const bookRepository = await getBookRepository(cds);
      const texts = await bookRepository.getLocaleTexts();

      expect(texts).toBeDefined();
    });
  });

  describe('.find()', () => {
    it('It should RETURN : .find({ID: 201}) should find "1" item AND .find({currency_code : "GBP"}) should find "multiple" items', async () => {
      const bookRepository = await getBookRepository(cds);
      const findOneResult = await bookRepository.find({ ID: 201 });
      const findMultipleResult = await bookRepository.find({ currency_code: 'GBP' });

      expect(findMultipleResult.length).toBeGreaterThanOrEqual(1);
      expect(findOneResult).toHaveLength(1);
    });
  });

  describe('.findOne()', () => {
    it('It should RETURN : .findOne({currency_code : "GBP"}) should return only "1" item', async () => {
      const bookRepository = await getBookRepository(cds);
      const findOne = await bookRepository.findOne({ currency_code: 'GBP' });

      expect(findOne).toBeDefined();
    });
  });

  describe('.findBuilder()', () => {
    describe('======> .getExpand()', () => {
      it('It should RETURN : .getExpand(["genre"]) should return the original object + expanded "genre" property', async () => {
        const bookRepository = await getBookRepository(cds);
        const expandGenre = await bookRepository.findBuilder({ ID: 201 }).getExpand(['genre']).execute();
        const expandAll = await bookRepository.findBuilder({ ID: 201 }).getExpand().execute();

        const findOneForExpandAll = await bookRepository.find({ ID: 201 });

        expect(expandGenre.length).toBeGreaterThan(0);
        expect(expandGenre[0]).toHaveProperty('genre');

        expect(findOneForExpandAll).not.toMatchObject(expandAll);
      });
    });

    describe('======> .orderDesc()', () => {
      it('It should RETURN : .orderDesc(["stock"]) should find all values with "USD" value and make them "DESC" over "stock" property', async () => {
        const bookRepository = await getBookRepository(cds);
        const getAllByCurrencyCode = await bookRepository.findBuilder({ currency_code: 'USD' }).execute();
        const orderItemsDesc = await bookRepository
          .findBuilder({ currency_code: 'USD' })
          .orderDesc(['stock'])
          .execute();

        expect(orderItemsDesc[0]).not.toMatchObject(getAllByCurrencyCode[0]);
      });
    });

    describe('======> .orderAsc()', () => {
      it('It should RETURN : .orderDesc(["stock"]) should find all values with "USD" value and make them "ASC" over "stock" property', async () => {
        const bookRepository = await getBookRepository(cds);
        const orderItemsDesc = await bookRepository
          .findBuilder({ currency_code: 'USD' })
          .orderDesc(['stock'])
          .execute();
        const orderItemsAsc = await bookRepository.findBuilder({ currency_code: 'USD' }).orderAsc(['stock']).execute();

        expect(orderItemsAsc[0]).not.toMatchObject(orderItemsDesc[0]);
      });
    });

    describe('======> .groupBy()', () => {
      it('It should RETURN : groupBy(["author"]) should group by column "author"', async () => {
        const bookRepository = await getBookRepository(cds);
        const groupBy = await bookRepository.findBuilder({ currency_code: 'USD' }).groupBy(['author']).execute();

        expect(groupBy[0]).toBeDefined();
      });
    });

    describe('======> .limit()', () => {
      it('It should RETURN : .limit({limit: 1}) should return only 1 item', async () => {
        const bookRepository = await getBookRepository(cds);
        const limit = await bookRepository.findBuilder({ currency_code: 'GBP' }).limit({ limit: 1 }).execute();

        expect(limit).toHaveLength(1);
      });
    });

    describe('======> .limit()', () => {
      it('It should RETURN : .limit({limit: 2, skip: 1}) should return only 1 item', async () => {
        const bookRepository = await getBookRepository(cds);
        const all = await bookRepository.findBuilder({ currency_code: 'GBP' }).execute();
        const limit = await bookRepository.findBuilder({ currency_code: 'GBP' }).limit({ limit: 2, skip: 1 }).execute();

        expect(limit).toHaveLength(2);
        expect(limit).not.toContain(all[0]);
      });
    });

    describe('======> .execute()', () => {
      it('It should RETURN : .execute should execute the Promise and return results', async () => {
        const bookRepository = await getBookRepository(cds);
        const all = await bookRepository.findBuilder({ currency_code: 'GBP' }).execute();

        expect(all).toBeDefined();
      });
    });
  });

  describe('.exists()', () => {
    it('It should RETURN : "true" in case "1" item was found', async () => {
      const bookRepository = await getBookRepository(cds);
      const exists = await bookRepository.exists({ ID: 201 });

      expect(exists).toBe(true);
    });
  });

  describe('.count()', () => {
    it('It should RETURN : a count number larger than "0"', async () => {
      const bookRepository = await getBookRepository(cds);
      const count = await bookRepository.count();

      expect(count).toBeGreaterThan(0);
    });
  });
});
