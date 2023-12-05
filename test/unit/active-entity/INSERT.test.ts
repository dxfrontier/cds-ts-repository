import BookRepository from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

describe('INSERT', () => {
  startTestServer(__dirname, 'bookshop');

  let bookRepository: BookRepository;

  beforeAll(async () => {
    bookRepository = new BookRepository();
  });

  describe('.create()', () => {
    test('should successfully create a new record in the database', async () => {
      const getAll = await bookRepository.getAll();
      const create = await bookRepository.create({
        ID: 432,
        title: 'Wonderful Neighborhood',
        descr: 'A notorious but beautiful neighborhood!',
        stock: 123,
        author_ID: 101,
        price: 23,
        currency_code: 'USD',
        genre_ID: 11,
      });
      const getAllAfter = await bookRepository.getAll();

      expect(getAllAfter!.length).toBeGreaterThan(getAll!.length);
      expect(create.query.INSERT.entries).toHaveLength(1);
    });
  });

  describe('.createMany()', () => {
    test('should successfully create multiple records in the database', async () => {
      const getAll = await bookRepository.getAll();
      const createMany = await bookRepository.createMany([
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
      const getAllAfter = await bookRepository.getAll();

      expect(getAllAfter!.length).toBeGreaterThan(getAll!.length);
      expect(createMany.query.INSERT.entries).toHaveLength(2);
    });
  });
});
