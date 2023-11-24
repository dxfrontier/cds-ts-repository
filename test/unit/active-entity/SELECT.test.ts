import BookRepository from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('SELECT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: BookRepository;

  beforeAll(async () => {
    bookRepository = new BookRepository();
  });

  describe('.getAll()', () => {
    it('It should RETURN : all items from the database', async () => {
      // Act
      const getAll = await bookRepository.getAll();

      // Assert
      expect(getAll.length).toBeGreaterThan(0);
    });
  });

  describe('.getDistinctColumns()', () => {
    it('It should RETURN : distinct columns found in the database', async () => {
      // Act
      const getDistinctColumns = await bookRepository.getDistinctColumns(['currency_code', 'ID']);

      // Assert
      expect(getDistinctColumns.length).toBeGreaterThan(0);
    });
  });

  describe('.getAllAndLimit()', () => {
    it('It should RETURN : .getAllAndLimit() should have length smaller than .getAll length', async () => {
      // Arrange
      const getAll = await bookRepository.getAll();

      // Act
      const getAllAndLimit = await bookRepository.getAllAndLimit({ limit: 1 });
      const getAllAndLimitAndSkip = await bookRepository.getAllAndLimit({ limit: 2, skip: 1 });

      // Assert
      expect(getAllAndLimit.length).toBeGreaterThan(0);
      expect(getAllAndLimit.length).toBeLessThan(getAll.length);
      expect(getAllAndLimitAndSkip).not.toContain(getAll[0]);
    });
  });

  describe('.getLocaleTexts()', () => {
    test('It should RETURN : all "Locale" languages text', async () => {
      // Act
      const texts = await bookRepository.getLocaleTexts(['descr', 'ID']);

      // Assert
      expect(texts).toBeDefined();
      expect(texts.length).toBeGreaterThan(0);
    });
  });

  describe('.getAll()', () => {
    it('should return all items from the database', async () => {
      // Act
      const getAll = await bookRepository.getAll();

      // Assert
      expect(getAll.length).toBeGreaterThan(0);
    });
  });

  describe('.getDistinctColumns()', () => {
    it('should return distinct columns found in the database', async () => {
      // Act
      const getDistinctColumns = await bookRepository.getDistinctColumns(['currency_code', 'ID']);

      // Assert
      expect(getDistinctColumns.length).toBeGreaterThan(0);
    });
  });

  describe('.getAllAndLimit()', () => {
    it('should return results with length smaller than .getAll length when limited', async () => {
      // Arrange
      const getAll = await bookRepository.getAll();

      // Act
      const getAllAndLimit = await bookRepository.getAllAndLimit({ limit: 1 });
      const getAllAndLimitAndSkip = await bookRepository.getAllAndLimit({ limit: 2, skip: 1 });

      // Assert
      expect(getAllAndLimit.length).toBeGreaterThan(0);
      expect(getAllAndLimit.length).toBeLessThan(getAll.length);
      expect(getAllAndLimitAndSkip).not.toContain(getAll[0]);
    });
  });

  describe('.getLocaleTexts()', () => {
    test('should return all "Locale" languages text', async () => {
      // Act
      const texts = await bookRepository.getLocaleTexts(['descr', 'ID']);

      // Assert
      expect(texts).toBeDefined();
      expect(texts.length).toBeGreaterThan(0);
    });
  });

  describe('.find()', () => {
    it('should find "multiple" items with the specified criteria', async () => {
      // Act
      const findOneResult = await bookRepository.find({ ID: 201 });

      // Assert
      expect(findOneResult).toHaveLength(1);
    });

    it('should find one item with the specified criteria', async () => {
      const findMultipleResult = await bookRepository.find({ currency_code: 'GBP' });

      expect(findMultipleResult.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('.findOne()', () => {
    it('should return only one item with the specified criteria', async () => {
      // Act
      const findOne = await bookRepository.findOne({ currency_code: 'GBP' });

      // Assert
      expect(findOne).toBeDefined();
    });
  });

  describe('.builder()', () => {
    describe('======> .getExpand()', () => {
      it('should return the original object + expanded "genre" property', async () => {
        // Arrange
        const findOneForExpandAll = await bookRepository.findOne({ ID: 201 });

        // Act
        const expandGenre = await bookRepository.builder().find({ ID: 201 }).getExpand(['genre']).execute();

        // Assert
        expect(expandGenre.length).toBeGreaterThan(0);
        expect(expandGenre[0]).toHaveProperty('genre');
        expect(findOneForExpandAll).not.toMatchObject(expandGenre[0]);
      });
    });

    describe('======> .orderDesc()', () => {
      it('should find all values with "USD" value and make them "DESC" over "stock" property', async () => {
        // Arrange
        const getAllByCurrencyCode = await bookRepository.builder().find({ currency_code: 'USD' }).execute();

        // Act
        const orderItemsDesc = await bookRepository
          .builder()
          .find({ currency_code: 'USD' })
          .orderDesc(['stock', 'price'])
          .execute();

        // Assert
        expect(orderItemsDesc[0]).not.toMatchObject(getAllByCurrencyCode[0]);
      });
    });

    describe('======> .orderAsc()', () => {
      it('should find all values with "USD" value and make them "ASC" over "stock" property', async () => {
        // Arrange
        const orderItemsDesc = await bookRepository
          .builder()
          .find({ currency_code: 'USD' })
          .orderDesc(['stock', 'price'])
          .execute();

        // Act
        const orderItemsAsc = await bookRepository
          .builder()
          .find({ currency_code: 'USD' })
          .orderAsc(['stock', 'price'])
          .execute();

        // Assert
        expect(orderItemsAsc[0]).not.toMatchObject(orderItemsDesc[0]);
      });
    });

    describe('======> .groupBy()', () => {
      it('should group by column "author"', async () => {
        // Act
        const groupBy = await bookRepository
          .builder()
          .find({ currency_code: 'USD' })
          .groupBy(['author', 'currency_code'])
          .execute();

        // Assert
        expect(groupBy[0]).toBeDefined();
      });
    });

    describe('======> .limit()', () => {
      it('should return only 1 item when limited to 1', async () => {
        // Act
        const limit = await bookRepository.builder().find({ currency_code: 'GBP' }).limit({ limit: 1 }).execute();

        // Assert
        expect(limit).toHaveLength(1);
      });
    });

    describe('======> .limit()', () => {
      it('should return only 1 item when limited to 2 with skip 1', async () => {
        // Arrange
        const all = await bookRepository.builder().find({ currency_code: 'GBP' }).execute();

        // Act
        const limit = await bookRepository
          .builder()
          .find({ currency_code: 'GBP' })
          .limit({ limit: 2, skip: 1 })
          .execute();

        // Assert
        expect(limit).toHaveLength(2);
        expect(limit).not.toContain(all[0]);
      });
    });

    describe('======> .execute()', () => {
      it('should execute the Promise and return results', async () => {
        // Act
        const all = await bookRepository.builder().find({ currency_code: 'GBP' }).execute();

        // Assert
        expect(all).toBeDefined();
      });
    });
  });

  describe('.exists()', () => {
    it('should return "true" if "1" item was found with the specified criteria', async () => {
      // Act
      const exists = await bookRepository.exists({ ID: 201 });
      // Assert
      expect(exists).toBe(true);
    });
  });

  describe('.count()', () => {
    it('should return a count number larger than "0"', async () => {
      // Act
      const count = await bookRepository.count();

      // Assert
      expect(count).toBeGreaterThan(0);
    });
  });
});
