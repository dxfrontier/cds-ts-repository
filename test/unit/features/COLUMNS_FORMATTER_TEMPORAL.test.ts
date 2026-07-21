import { BaseRepository } from '../../../lib';
import { startTestServer } from '../../util/util';

import type { Authors } from '#cds-models/CatalogService';

/**
 * Feature 2 : temporal difference functions in `.columnsFormatter()`.
 *
 * Adds the two-column CAP temporal functions (`DAYS_BETWEEN`, `MONTHS_BETWEEN`, `YEARS_BETWEEN`,
 * `SECONDS_BETWEEN`) so users can compute the distance between two date columns. Verified against
 * `Authors.dateOfBirth` / `Authors.dateOfDeath`.
 *
 * Reference row - Author ID 101 (Emily Brontë): born 1818-07-30, died 1848-12-19.
 */
const getAuthorRepository = async () => {
  const { Authors } = await import('#cds-models/CatalogService');

  class AuthorRepository extends BaseRepository<Authors> {
    constructor() {
      super(Authors);
    }
  }

  return new AuthorRepository();
};

describe('FEATURE - .columnsFormatter() temporal functions', () => {
  startTestServer(__dirname, 'bookshop');
  let authorRepository: Awaited<ReturnType<typeof getAuthorRepository>>;

  beforeAll(async () => {
    authorRepository = await getAuthorRepository();
  });

  describe('.builder().find() - two-column temporal formatters', () => {
    it('DAYS_BETWEEN should return the number of days between two date columns', async () => {
      // Act
      const results = await authorRepository
        .builder()
        .find({ ID: 101 })
        .columns('ID', 'dateOfBirth', 'dateOfDeath')
        .columnsFormatter({
          column1: 'dateOfBirth',
          column2: 'dateOfDeath',
          aggregate: 'DAYS_BETWEEN',
          renameAs: 'daysLived',
        })
        .execute();

      // Assert
      expect(results).toHaveLength(1);
      expect(results![0]).toHaveProperty('daysLived');
      expect(typeof results![0].daysLived).toBe('number');
      expect(results![0].daysLived).toBe(11100);
    });

    it('MONTHS_BETWEEN should return the number of months between two date columns', async () => {
      // Act
      const results = await authorRepository
        .builder()
        .find({ ID: 101 })
        .columnsFormatter({
          column1: 'dateOfBirth',
          column2: 'dateOfDeath',
          aggregate: 'MONTHS_BETWEEN',
          renameAs: 'monthsLived',
        })
        .execute();

      // Assert
      expect(results![0].monthsLived).toBe(364);
    });

    it('YEARS_BETWEEN should return the number of years between two date columns', async () => {
      // Act
      const results = await authorRepository
        .builder()
        .find({ ID: 101 })
        .columnsFormatter({
          column1: 'dateOfBirth',
          column2: 'dateOfDeath',
          aggregate: 'YEARS_BETWEEN',
          renameAs: 'yearsLived',
        })
        .execute();

      // Assert
      expect(results![0].yearsLived).toBe(30);
    });

    it('SECONDS_BETWEEN should return the number of seconds between two date columns', async () => {
      // Act
      const results = await authorRepository
        .builder()
        .find({ ID: 101 })
        .columnsFormatter({
          column1: 'dateOfBirth',
          column2: 'dateOfDeath',
          aggregate: 'SECONDS_BETWEEN',
          renameAs: 'secondsLived',
        })
        .execute();

      // Assert
      expect(typeof results![0].secondsLived).toBe('number');
      expect(results![0].secondsLived).toBe(959040000);
    });

    it('should combine a temporal formatter with a regular aggregate and a rename', async () => {
      // Act
      const results = await authorRepository
        .builder()
        .find({ ID: 101 })
        .columnsFormatter(
          { column: 'name', aggregate: 'UPPER', renameAs: 'upperName' },
          {
            column1: 'dateOfBirth',
            column2: 'dateOfDeath',
            aggregate: 'DAYS_BETWEEN',
            renameAs: 'daysLived',
          },
        )
        .execute();

      // Assert
      expect(results![0]).toHaveProperty('upperName');
      expect(results![0]).toHaveProperty('daysLived');
      expect(results![0].daysLived).toBe(11100);
    });
  });

  describe('.builder().findOne() - two-column temporal formatters', () => {
    it('YEARS_BETWEEN should work on a single-record query', async () => {
      // Act
      const result = await authorRepository
        .builder()
        .findOne({ ID: 101 })
        .columnsFormatter({
          column1: 'dateOfBirth',
          column2: 'dateOfDeath',
          aggregate: 'YEARS_BETWEEN',
          renameAs: 'yearsLived',
        })
        .execute();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result!.yearsLived).toBe('number');
      expect(result!.yearsLived).toBe(30);
    });
  });
});
