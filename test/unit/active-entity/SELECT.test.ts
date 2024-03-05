import { Book } from '#cds-models/CatalogService';
import { Filter } from '../../../lib/util/helpers/Filter';

import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('SELECT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.getAll()', () => {
    it('It should RETURN : all items from the database', async () => {
      // Act
      const getAll = await bookRepository.getAll();

      getAll?.length;
      // Assert
      expect(getAll?.length).toBeGreaterThan(0);
    });
  });

  describe('.getDistinctColumns()', () => {
    it('It should RETURN : distinct columns found in the database - .getDistinctColumns(["currency_code", "ID"])', async () => {
      // Act
      const getDistinctColumns = await bookRepository.getDistinctColumns(['currency_code', 'ID']);

      // Assert
      expect(getDistinctColumns!.length).toBeGreaterThan(0);
    });

    it('It should RETURN : distinct columns found in the database - .getDistinctColumns("currency_code", "ID")', async () => {
      // Act
      const getDistinctColumns = await bookRepository.getDistinctColumns('currency_code', 'ID');

      // Assert
      expect(getDistinctColumns!.length).toBeGreaterThan(0);
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
      expect(getAllAndLimit!.length).toBeGreaterThan(0);
      expect(getAllAndLimit!.length).toBeLessThan(getAll!.length);
      expect(getAllAndLimitAndSkip).not.toContain(getAll![0]);
    });
  });

  describe('.getLocaleTexts()', () => {
    test('It should RETURN : all "Locale" languages text', async () => {
      // Act
      const texts = await bookRepository.getLocaleTexts(['descr', 'ID']);

      // Assert
      expect(texts).toBeDefined();
      expect(texts!.length).toBeGreaterThan(0);
    });
  });

  describe('.getAll()', () => {
    it('should return all items from the database', async () => {
      // Act
      const getAll = await bookRepository.getAll();

      // Assert
      expect(getAll!.length).toBeGreaterThan(0);
    });
  });

  describe('.getDistinctColumns()', () => {
    it('should return distinct columns found in the database', async () => {
      // Act
      const getDistinctColumns = await bookRepository.getDistinctColumns(['currency_code', 'ID']);

      // Assert
      expect(getDistinctColumns!.length).toBeGreaterThan(0);
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
      expect(getAllAndLimit!.length).toBeGreaterThan(0);
      expect(getAllAndLimit!.length).toBeLessThan(getAll!.length);
      expect(getAllAndLimitAndSkip).not.toContain(getAll![0]);
    });
  });

  describe('.getLocaleTexts()', () => {
    test('should return all "Locale" languages text', async () => {
      // Act
      const texts = await bookRepository.getLocaleTexts(['descr', 'ID']);

      // Assert
      expect(texts).toBeDefined();
      expect(texts!.length).toBeGreaterThan(0);
    });
  });

  describe('.find()', () => {
    describe('.find() - OVERLOAD - Get all', () => {
      it('should find "multiple" items with the specified criteria', async () => {
        // Act
        const findAll = await bookRepository.find();

        // Assert
        expect(findAll).toHaveLength(6);
      });

      it('should find one item with the specified criteria', async () => {
        const findMultipleResult = await bookRepository.find({ currency_code: 'GBP' });

        expect(findMultipleResult!.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('.find() - object', () => {
      it('should find "multiple" items with the specified criteria', async () => {
        // Act
        const findOneResult = await bookRepository.find({ ID: 201 });

        // Assert
        expect(findOneResult).toHaveLength(1);
      });

      it('should find one item with the specified criteria', async () => {
        const findMultipleResult = await bookRepository.find({ currency_code: 'GBP' });

        expect(findMultipleResult!.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('.find() - LIKE - BETWEEN - IN - multiple filters', () => {
      it('should return all records containing (currency_code = "GBP" OR stock BETWEEN 11 and 333) AND ID IN ("203", "201", "207")', async () => {
        // Arrange
        const filterLike = new Filter<Book>({
          field: 'currency_code',
          operator: 'LIKE',
          value: 'GBP',
        });

        const filterBetween = new Filter<Book>({
          field: 'stock',
          operator: 'BETWEEN',
          value1: 11,
          value2: 333,
        });

        const filterIn = new Filter<Book>({
          field: 'ID',
          operator: 'IN',
          value: [201, 203, 207],
        });

        // descr like 'Wuthering' or stock between 11 and 333
        const combinedFiltersWithOR = new Filter('OR', filterLike, filterBetween);

        // (descr LIKE 'Wuthering' OR stock BETWEEN 11 and 333) AND ID IN ('203', '201', '207')
        const filters = new Filter('AND', combinedFiltersWithOR, filterIn);

        // Act
        const results = await bookRepository.find(filters);

        // Assert
        expect(results).toHaveLength(3);

        results?.forEach((item) => {
          expect(item.currency_code).not.toBe('JPY');
          expect(item.currency_code).not.toBe('USD');
          expect(item.stock).toBeGreaterThanOrEqual(filterBetween.value1 as number);
          expect(item.stock).toBeLessThanOrEqual(filterBetween.value2 as number);

          (filterIn.value as number[]).forEach((id) => {
            expect(id).toBeGreaterThanOrEqual(201);
            expect(id).toBeLessThanOrEqual(207);
          });
        });
      });
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
