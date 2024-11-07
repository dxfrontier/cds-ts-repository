import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('INSERT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.create()', () => {
    it('should successfully create a new record in the database', async () => {
      const initialRecords = await bookRepository.getAll();

      const insertResult = await bookRepository.create({
        title: 'Wonderful Neighborhood',
        descr: 'A notorious but beautiful neighborhood!',
        stock: 123,
        author_ID: 101,
        price: 23,
        currency_code: 'USD',
        genre_ID: 11,
      });

      const updatedRecords = await bookRepository.getAll();

      expect(updatedRecords!.length).toBeGreaterThan(initialRecords!.length);
      expect(insertResult.query.INSERT.entries).toHaveLength(1);
      expect(insertResult.query.INSERT.entries[0]).toMatchObject({
        title: 'Wonderful Neighborhood',
        descr: 'A notorious but beautiful neighborhood!',
        stock: 123,
        author_ID: 101,
        price: 23,
        currency_code: 'USD',
        genre_ID: 11,
      });
    });
  });

  describe('.updateOrCreate()', () => {
    it('should successfully create or update multiple records in the database - .updateOrCreate()', async () => {
      const getAll = await bookRepository.getAll();
      const updateOrCreateMany = await bookRepository.updateOrCreate(
        {
          ID: 123,
          title: 'Magic Forest',
          descr: 'A magical journey through enchanted woods!',
          stock: 50,
          author_ID: 201,
          price: 40,
          currency_code: 'USD',
          genre_ID: 8,
        },
        {
          ID: 456,
          title: 'Mystic Mountain',
          descr: 'Explore the mysteries of the ancient mountain!',
          stock: 30,
          author_ID: 201,
          price: 35,
          currency_code: 'EUR',
          genre_ID: 8,
        },
        {
          ID: 357,
          title: 'The Hidden Gem',
          descr: 'A captivating tale of discovery and adventure',
          stock: 67,
          author_ID: 204,
          price: 45,
          currency_code: 'USD',
          genre_ID: 8,
        },
      );

      const getAllAfter = await bookRepository.getAll();

      expect(getAllAfter!.length).toBeGreaterThan(getAll!.length);
      expect(updateOrCreateMany).toBe(true);
    });

    it('should successfully create multiple records in the database - .createMany([{}, {}])', async () => {
      const initialRecords = await bookRepository.getAll();

      const createManyResult = await bookRepository.createMany([
        {
          ID: 542,
          title: 'Thieves Boulevard',
          descr: 'The neighborhood where everything gets stolen!',
          stock: 23,
          author_ID: 101,
          price: 53,
          currency_code: 'GBP',
          genre_ID: 11,
        },
        {
          ID: 896,
          title: 'Thieves Boulevard Part II',
          descr: 'The neighborhood where everything gets stolen, PART 2!',
          stock: 53,
          author_ID: 101,
          price: 32,
          currency_code: 'GBP',
          genre_ID: 11,
        },
      ]);

      const updatedRecords = await bookRepository.getAll();

      // Verify the count of records increased by the number of inserted entries
      expect(updatedRecords!.length).toBe(initialRecords!.length + 2);

      // Ensure `createMany` returned an InsertResult with the created entries
      expect(createManyResult.query.INSERT.entries).toHaveLength(2);

      // Verify that each entry in the result matches the provided input data
      expect(createManyResult.query.INSERT.entries[0]).toMatchObject({
        title: 'Thieves Boulevard',
        descr: 'The neighborhood where everything gets stolen!',
        stock: 23,
        author_ID: 101,
        price: 53,
        currency_code: 'GBP',
        genre_ID: 11,
      });

      expect(createManyResult.query.INSERT.entries[1]).toMatchObject({
        title: 'Thieves Boulevard Part II',
        descr: 'The neighborhood where everything gets stolen, PART 2!',
        stock: 53,
        author_ID: 101,
        price: 32,
        currency_code: 'GBP',
        genre_ID: 11,
      });
    });

    it('should successfully create multiple records in the database - .createMany({}, {})', async () => {
      const getAll = await bookRepository.getAll();
      const createMany = await bookRepository.createMany(
        {
          ID: 332,
          title: 'Thieves Boulevard',
          descr: 'The neighborhood where everything gets stolen!',
          stock: 23,
          author_ID: 101,
          price: 53,
          currency_code: 'GBP',
          genre_ID: 11,
        },
        {
          ID: 636,
          title: 'Thieves Boulevard Part II',
          descr: 'The neighborhood where everything gets stolen, PART 2!',
          stock: 53,
          author_ID: 101,
          price: 32,
          currency_code: 'GBP',
          genre_ID: 11,
        },
      );

      const getAllAfter = await bookRepository.getAll();

      expect(getAllAfter!.length).toBeGreaterThan(getAll!.length);
      expect(createMany).not.toBe(false);
    });
  });
});
