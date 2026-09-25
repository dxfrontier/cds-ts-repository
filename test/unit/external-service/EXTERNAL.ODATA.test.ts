import cds from '@sap/cds';

import type { Author, Authors, Book } from '#cds-models/CatalogService';

import { BaseRepository } from '../../../lib/core/BaseRepository';
import { CoreRepository } from '../../../lib/core/CoreRepository';
import { Filter } from '../../../lib/util/filter/Filter';
import type { Entity, ExternalServiceProps } from '../../../lib/types/types';
import { startTestServer } from '../../util/util';

// Drives the external-service branches of CoreRepository / BaseRepository against a REAL OData v4 remote : the
// bookshop `CatalogService` is served in-process on a real port and a second, remote `CatalogService` client is
// connected to it over HTTP (`kind: 'odata'`). Every write is verified by reading the served database directly, and
// the HTTP requests received by the served service are recorded to pin the addressing (`PATCH /Authors(101)`).

const DB_AUTHORS = 'sap.capire.bookshop.Authors';
const DB_BOOKS = 'sap.capire.bookshop.Books';
const SERVICE_PATH = '/odata/v4/catalog';

const readAuthor = async (ID: number): Promise<{ ID: number; placeOfBirth: string } | undefined> =>
  await SELECT.one.from(DB_AUTHORS).columns('ID', 'placeOfBirth').where({ ID });

const readAuthorIds = async (): Promise<number[]> => {
  const rows: { ID: number }[] = await SELECT.from(DB_AUTHORS).columns('ID').orderBy('ID');
  return rows.map((row) => row.ID);
};

const readBookIds = async (): Promise<number[]> => {
  const rows: { ID: number }[] = await SELECT.from(DB_BOOKS).columns('ID').orderBy('ID');
  return rows.map((row) => row.ID);
};

describe('CoreRepository - externalService over a served OData v4 remote', () => {
  const server = startTestServer(__dirname, 'bookshop');

  const requests: string[] = [];
  let remote: ExternalServiceProps;
  let repo: CoreRepository<Author>;

  beforeAll(async () => {
    remote = (await cds.connect.to('CatalogService', {
      kind: 'odata',
      model: cds.model,
      credentials: { url: `${(server as unknown as { url: string }).url}${SERVICE_PATH}` },
    } as never)) as unknown as ExternalServiceProps;

    const served = cds.services.CatalogService;
    served.before(['UPDATE', 'DELETE'], 'Authors', (req) => {
      requests.push(`${req.http?.req.method} ${req.http?.req.originalUrl}`);
    });

    repo = new CoreRepository<Author>(remote.entities.Authors as Entity, remote);
  });

  beforeEach(async () => {
    await server.data.reset();
    requests.length = 0;
  });

  describe('.update()', () => {
    it('should PATCH the row addressed by its key and resolve to true', async () => {
      const result = await repo.update({ ID: 101 }, { placeOfBirth: 'Leeds' });

      expect(result).toBe(true);
      expect(requests).toEqual([`PATCH ${SERVICE_PATH}/Authors(101)`]);
      expect(await readAuthor(101)).toEqual({ ID: 101, placeOfBirth: 'Leeds' });
      expect(await readAuthor(107)).toEqual({ ID: 107, placeOfBirth: 'Thornton, Yorkshire' });
    });

    it('should resolve to false when the remote row does not exist', async () => {
      const result = await repo.update({ ID: 999 }, { placeOfBirth: 'Leeds' });

      expect(result).toBe(false);
      expect(requests).toEqual([`PATCH ${SERVICE_PATH}/Authors(999)`]);
      expect(await readAuthorIds()).toEqual([101, 107, 150, 170]);
    });

    it('should route BaseRepository.update() of an @ExternalService repository through the remote', async () => {
      const externalService = remote;

      class AuthorRepository extends BaseRepository<Authors> {
        static externalService = externalService;

        constructor() {
          super({ name: 'API.Authors' });
        }
      }

      const result = await new AuthorRepository().update({ ID: 150 }, { placeOfBirth: 'Richmond' });

      expect(result).toBe(true);
      expect(requests).toEqual([`PATCH ${SERVICE_PATH}/Authors(150)`]);
      expect(await readAuthor(150)).toEqual({ ID: 150, placeOfBirth: 'Richmond' });
    });
  });

  describe('.findOneAndUpdate()', () => {
    it('should PATCH the found row by its key and resolve to true', async () => {
      const result = await repo.findOneAndUpdate({ ID: 107 }, { placeOfBirth: 'Leeds' });

      expect(result).toBe(true);
      expect(requests).toEqual([`PATCH ${SERVICE_PATH}/Authors(107)`]);
      expect(await readAuthor(107)).toEqual({ ID: 107, placeOfBirth: 'Leeds' });
    });

    it('should PATCH the row found by a non-key property, addressed by its own key', async () => {
      const result = await repo.findOneAndUpdate({ name: 'Charlotte Brontë' }, { placeOfBirth: 'Leeds' });

      expect(result).toBe(true);
      expect(requests).toEqual([`PATCH ${SERVICE_PATH}/Authors(107)`]);
      expect(await readAuthor(107)).toEqual({ ID: 107, placeOfBirth: 'Leeds' });
      expect(await readAuthor(101)).toEqual({ ID: 101, placeOfBirth: 'Thornton, Yorkshire' });
    });

    it('should resolve to false without writing when the remote row does not exist', async () => {
      const result = await repo.findOneAndUpdate({ ID: 999 }, { placeOfBirth: 'Leeds' });

      expect(result).toBe(false);
      expect(requests).toEqual([]);
    });
  });

  describe('.delete()', () => {
    it('should DELETE the row addressed by its key and resolve to true', async () => {
      const result = await repo.delete({ ID: 170 });

      expect(result).toBe(true);
      expect(requests).toEqual([`DELETE ${SERVICE_PATH}/Authors(170)`]);
      expect(await readAuthorIds()).toEqual([101, 107, 150]);
    });

    it('should resolve to false when the remote row does not exist', async () => {
      const result = await repo.delete({ ID: 999 });

      expect(result).toBe(false);
      expect(requests).toEqual([`DELETE ${SERVICE_PATH}/Authors(999)`]);
      expect(await readAuthorIds()).toEqual([101, 107, 150, 170]);
    });
  });

  describe('.deleteMany()', () => {
    it('should DELETE every row addressed by its key and resolve to true', async () => {
      const result = await repo.deleteMany({ ID: 101 }, { ID: 170 });

      expect(result).toBe(true);
      expect([...requests].sort()).toEqual([
        `DELETE ${SERVICE_PATH}/Authors(101)`,
        `DELETE ${SERVICE_PATH}/Authors(170)`,
      ]);
      expect(await readAuthorIds()).toEqual([107, 150]);
    });

    it('should resolve to false when one of the remote rows does not exist, after every deletion has settled', async () => {
      const result = await repo.deleteMany([{ ID: 150 }, { ID: 999 }]);

      expect(result).toBe(false);
      expect(await readAuthorIds()).toEqual([101, 107, 170]);
    });
  });

  describe('.updateMany()', () => {
    it('should PATCH the row addressed by a plain key object and resolve to 1', async () => {
      const result = await repo.updateMany({ ID: 150 }, { placeOfBirth: 'Richmond' });

      expect(result).toBe(1);
      expect(requests).toEqual([`PATCH ${SERVICE_PATH}/Authors(150)`]);
      expect(await readAuthor(150)).toEqual({ ID: 150, placeOfBirth: 'Richmond' });
    });

    it('should throw for a Filter and leave the remote rows untouched', async () => {
      const filter = new Filter<Author>({ field: 'placeOfBirth', operator: 'EQUALS', value: 'Thornton, Yorkshire' });

      await expect(repo.updateMany(filter, { placeOfBirth: 'Leeds' })).rejects.toThrow(
        'updateMany with a filter is not supported on OData external services',
      );
      expect(requests).toEqual([]);
      expect(await readAuthor(101)).toEqual({ ID: 101, placeOfBirth: 'Thornton, Yorkshire' });
    });
  });

  describe('.deleteWhere()', () => {
    it('should DELETE the row addressed by a plain key object and resolve to 1', async () => {
      const result = await repo.deleteWhere({ ID: 101 });

      expect(result).toBe(1);
      expect(requests).toEqual([`DELETE ${SERVICE_PATH}/Authors(101)`]);
      expect(await readAuthorIds()).toEqual([107, 150, 170]);
    });

    it('should throw for a compound Filter and leave the remote rows untouched', async () => {
      const filter = new Filter<Author>(
        'OR',
        new Filter<Author>({ field: 'ID', operator: 'EQUALS', value: 101 }),
        new Filter<Author>({ field: 'ID', operator: 'EQUALS', value: 107 }),
      );

      await expect(repo.deleteWhere(filter)).rejects.toThrow(
        'deleteWhere with a filter is not supported on OData external services',
      );
      expect(requests).toEqual([]);
      expect(await readAuthorIds()).toEqual([101, 107, 150, 170]);
    });
  });

  describe('full-key addressing of keyed writes', () => {
    it.each([
      ['update', () => repo.update({ name: 'Emily Brontë' }, { placeOfBirth: 'Leeds' })],
      ['delete', () => repo.delete({ name: 'Emily Brontë' })],
      ['deleteMany', () => repo.deleteMany({ ID: 107 }, { name: 'Emily Brontë' })],
    ])('%s should throw for a non-key property and leave the remote rows untouched', async (method, call) => {
      await expect(call()).rejects.toThrow(
        `${method} on external services addresses a row by its full key : expected (ID), received (name) !`,
      );
      expect(requests).toEqual([]);
      expect(await readAuthorIds()).toEqual([101, 107, 150, 170]);
    });

    it('rejects a non-key property and leaves every remote row untouched', async () => {
      await UPDATE(DB_BOOKS).set({ stock: 207 }).where({ ID: 251 });
      const booksRepo = new CoreRepository<Book>(remote.entities.Books as Entity, remote);

      await expect(booksRepo.deleteWhere({ stock: 207 })).rejects.toThrow(
        'deleteWhere on external services addresses a row by its full key : expected (ID), received (stock) !',
      );
      await expect(booksRepo.updateMany({ stock: 207 }, { stock: 0 })).rejects.toThrow(
        'updateMany on external services addresses a row by its full key : expected (ID), received (stock) !',
      );
      expect(await readBookIds()).toEqual([201, 203, 207, 251, 252, 271]);
    });
  });

  describe('keyed writes against the served in-process service', () => {
    // `cds.connect.to` of an @ExternalService without credentials serves the mock in-process (kind 'app-service') :
    // a `CoreRepository` built directly on that served service exercises the same 404 answer such a mock produces.
    let inProcessRepo: CoreRepository<Author>;

    beforeAll(() => {
      const served = cds.services.CatalogService as unknown as ExternalServiceProps;
      inProcessRepo = new CoreRepository<Author>(served.entities.Authors as Entity, served);
    });

    it('should resolve false / 0 for a keyed write addressing a row that does not exist', async () => {
      expect(await inProcessRepo.update({ ID: 999 }, { placeOfBirth: 'Leeds' })).toBe(false);
      expect(await inProcessRepo.delete({ ID: 999 })).toBe(false);
      expect(await inProcessRepo.deleteMany({ ID: 999 })).toBe(false);
      expect(await inProcessRepo.updateMany({ ID: 999 }, { placeOfBirth: 'Leeds' })).toBe(0);
      expect(await inProcessRepo.deleteWhere({ ID: 999 })).toBe(0);
      expect(await readAuthorIds()).toEqual([101, 107, 150, 170]);
    });
  });

  describe('.increment() / .decrement() / .incrementMany() / .decrementMany()', () => {
    it.each([
      ['increment', () => repo.increment({ ID: 101 }, 'ID', 1)],
      ['decrement', () => repo.decrement({ ID: 101 }, 'ID', 1)],
      ['incrementMany', () => repo.incrementMany({ ID: 101 }, { ID: 1 })],
      ['decrementMany', () => repo.decrementMany({ ID: 101 }, { ID: 1 })],
    ])('%s should throw and leave the remote rows untouched', async (method, run) => {
      await expect(run()).rejects.toThrow(`${method} is not supported on OData external services`);
      expect(requests).toEqual([]);
      expect(await readAuthorIds()).toEqual([101, 107, 150, 170]);
    });
  });
});
