import { Book } from '#cds-models/CatalogService';

import { CoreRepository } from '../../../lib/core/CoreRepository';
import { Filter } from '../../../lib/util/filter/Filter';
import { createFakeExternalService } from '../../util/fakeExternalService';
import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

import type { Entity } from '../../../lib/types/types';

type FakeEntity = { ID?: number; name?: string };

const externalEntity: Entity = { name: 'EXTERNAL.FakeEntity' };

describe('SELECT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.builder().find()', () => {
    describe('======> .having()', () => {
      it('should keep only the groups matching the raw aggregate condition', async () => {
        // Act
        const results = await bookRepository
          .builder()
          .find()
          .columns('author_ID')
          .groupBy('author_ID')
          .having('count(*) >= 2')
          .execute();

        // Assert : only the authors 101 and 150 have more than 1 book
        expect(results).toEqual([{ author_ID: 101 }, { author_ID: 150 }]);
      });

      it('should keep only the groups matching the filter', async () => {
        // Arrange
        const filter = new Filter<Book>({
          field: 'currency_code',
          operator: 'EQUALS',
          value: 'GBP',
        });

        // Act
        const results = await bookRepository
          .builder()
          .find()
          .columns('currency_code')
          .groupBy('currency_code')
          .having(filter)
          .execute();

        // Assert
        expect(results).toEqual([{ currency_code: 'GBP' }]);
      });

      it('should throw an error when .groupBy() was not called before', () => {
        // Act + Assert
        expect(() => bookRepository.builder().find().having('count(*) >= 2')).toThrow(
          '.having() requires .groupBy() to be called before !',
        );
      });
    });

    describe('======> .executeAndCount()', () => {
      it('should return all results together with the total count', async () => {
        // Act
        const { results, count } = await bookRepository.builder().find().executeAndCount();

        // Assert
        expect(results.length).toEqual(6);
        expect(count).toEqual(6);
      });

      it('should return the paginated results together with the unpaginated total count', async () => {
        // Act
        const { results, count } = await bookRepository
          .builder()
          .find()
          .orderAsc('ID')
          .paginate({ limit: 2 })
          .executeAndCount();

        // Assert
        expect(results.map((result) => result.ID)).toEqual([201, 203]);
        expect(count).toEqual(6);
      });

      it('should count only the rows matching the filter', async () => {
        // Arrange
        const filter = new Filter<Book>({
          field: 'currency_code',
          operator: 'EQUALS',
          value: 'GBP',
        });

        // Act
        const { results, count } = await bookRepository.builder().find(filter).paginate({ limit: 1 }).executeAndCount();

        // Assert
        expect(results.length).toEqual(1);
        expect(count).toEqual(3);
      });

      it('should count the number of groups when the query is grouped', async () => {
        // Act
        const { results, count } = await bookRepository
          .builder()
          .find()
          .columns('author_ID')
          .groupBy('author_ID')
          .paginate({ limit: 2 })
          .executeAndCount();

        // Assert : the books are written by 4 different authors
        expect(results.length).toEqual(2);
        expect(count).toEqual(4);
      });

      it('should count the number of distinct rows when the query is distinct', async () => {
        // Act
        const { results, count } = await bookRepository
          .builder()
          .find()
          .distinct.columns('currency_code')
          .paginate({ limit: 2 })
          .executeAndCount();

        // Assert : the 6 books are priced in 3 different currencies
        expect(results.length).toEqual(2);
        expect(count).toEqual(3);
      });

      it('should throw an error when an external service is used', async () => {
        // Arrange
        const repository = new CoreRepository<FakeEntity>(externalEntity, createFakeExternalService());

        // Act + Assert
        await expect(repository.builder().find().executeAndCount()).rejects.toThrow(
          'executeAndCount is currently not supported on External services !',
        );
      });
    });
  });
});
