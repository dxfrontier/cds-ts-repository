import cds from '@sap/cds';

import { CoreRepository } from '../../../lib/core/CoreRepository';
import { Filter } from '../../../lib/util/filter/Filter';
import { createFakeExternalService } from '../../util/fakeExternalService';
import { startTestServer } from '../../util/util';

import type { Entity } from '../../../lib/types/types';

// A real DB is never touched here - every CoreRepository call is routed through a fake external
// service (see test/util/fakeExternalService.ts). The test server is still booted (as in every
// other suite) because the global SELECT/INSERT/UPDATE/DELETE/UPSERT cds.ql query builders that
// CoreRepository relies on are only reliably installed once `@sap/cds` is actually bootstrapped.

type FakeEntity = { ID?: number; name?: string };

const entity: Entity = { name: 'EXTERNAL.FakeEntity' };

// Shape of the error a remote OData service rejects with (probed on @sap/cds 10.0.5 / 10.1.1) : CAP wraps the
// upstream answer into a 502 and keeps the upstream HTTP status on `reason.response.status`.
const remoteError = (status: number, message: string): Error =>
  Object.assign(new Error(`Error during request to remote service: ${message}`), {
    statusCode: 502,
    reason: { message, status, response: { status } },
  });

// Entity representation a remote OData v4 service answers a successful `PATCH /Entity(<key>)` with.
const patchedEntity = { ID: 1, name: 'New', modifiedAt: '2026-09-25T09:26:01.234Z', modifiedBy: 'anonymous' };

// Key-addressed CQN : the keys live on the target ref (`PATCH /Entity(1)`), never in a `where` clause.
const keyedRef = (where: unknown[]) => ({ ref: [{ id: 'EXTERNAL.FakeEntity', where }] });
const ID_EQUALS_1 = [{ ref: ['ID'] }, '=', { val: 1 }];

describe('CoreRepository - externalService', () => {
  startTestServer(__dirname, 'bookshop');

  describe('.create()', () => {
    it('should run the INSERT through the external service and wrap the result', async () => {
      const run = jest.fn().mockResolvedValue({ ID: 1, name: 'Created' });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.create({ name: 'Created' });

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ query: { INSERT: { entries: [{ ID: 1, name: 'Created' }] } } });
    });
  });

  describe('.createMany()', () => {
    it('should run one INSERT per entry through the external service and collect the results', async () => {
      const run = jest.fn().mockResolvedValueOnce({ ID: 1 }).mockResolvedValueOnce({ ID: 2 });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.createMany({ name: 'A' }, { name: 'B' });

      expect(run).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ query: { INSERT: { entries: [{ ID: 1 }, { ID: 2 }] } } });
    });
  });

  describe('.getAll()', () => {
    it('should run the SELECT through the external service', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }, { ID: 2 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.getAll();

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ ID: 1 }, { ID: 2 }]);
    });
  });

  describe('.getDistinctColumns()', () => {
    it('should build a SELECT with columns + groupBy and run it through the external service', async () => {
      const run = jest.fn().mockResolvedValue([{ name: 'A' }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.getDistinctColumns('name');

      expect(run).toHaveBeenCalledTimes(1);
      const query = run.mock.calls[0][0];
      expect(query.SELECT.columns).toBeDefined();
      expect(query.SELECT.groupBy).toBeDefined();
      expect(result).toEqual([{ name: 'A' }]);
    });
  });

  describe('.paginate()', () => {
    it('should run the SELECT (with limit/skip) through the external service', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.paginate({ limit: 1, skip: 2 });

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ ID: 1 }]);
    });
  });

  describe('.getLocaleTexts()', () => {
    it('should throw (not supported on external services)', async () => {
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService());

      await expect(repo.getLocaleTexts('name')).rejects.toThrow('Currently not supported on External services !');
    });
  });

  describe('.find()', () => {
    it('should run the SELECT through the external service without keys', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.find();

      expect(run).toHaveBeenCalledTimes(1);
      const query = run.mock.calls[0][0];
      expect(query.SELECT.where).toBeUndefined();
      expect(result).toEqual([{ ID: 1 }]);
    });

    it('should run the SELECT through the external service with a Filter', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const filter = new Filter<FakeEntity>({ field: 'name', operator: 'EQUALS', value: 'A' });
      const result = await repo.find(filter);

      expect(run).toHaveBeenCalledTimes(1);
      const query = run.mock.calls[0][0];
      expect(query.SELECT.where).toBeDefined();
      expect(result).toEqual([{ ID: 1 }]);
    });
  });

  describe('.findOneAndUpdate()', () => {
    it('should return false without updating when no entity is found', async () => {
      const run = jest.fn().mockResolvedValueOnce(undefined);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.findOneAndUpdate({ ID: 1 }, { name: 'New' });

      expect(result).toBe(false);
      expect(run).toHaveBeenCalledTimes(1);
    });

    it('should find then update through the external service and return true when 1 row is updated', async () => {
      const run = jest.fn().mockResolvedValueOnce({ ID: 1, name: 'Old' }).mockResolvedValueOnce(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.findOneAndUpdate({ ID: 1 }, { name: 'New' });

      expect(result).toBe(true);
      expect(run).toHaveBeenCalledTimes(2);
    });

    it('should address the update by key and return true when the remote answers with the entity', async () => {
      const run = jest.fn().mockResolvedValueOnce({ ID: 1, name: 'Old' }).mockResolvedValueOnce(patchedEntity);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.findOneAndUpdate({ ID: 1 }, { name: 'New' });

      expect(result).toBe(true);
      const query = run.mock.calls[1][0];
      expect(query.UPDATE.entity).toEqual(keyedRef(ID_EQUALS_1));
      expect(query.UPDATE.where).toBeUndefined();
      expect(query.UPDATE.data).toEqual({ name: 'New' });
    });

    it('should return false when the remote answers the update with 404', async () => {
      const run = jest
        .fn()
        .mockResolvedValueOnce({ ID: 1, name: 'Old' })
        .mockRejectedValueOnce(remoteError(404, 'Not Found'));
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.findOneAndUpdate({ ID: 1 }, { name: 'New' });

      expect(result).toBe(false);
    });

    it('should return false when the update does not report exactly 1 affected row', async () => {
      const run = jest.fn().mockResolvedValueOnce({ ID: 1, name: 'Old' }).mockResolvedValueOnce(0);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.findOneAndUpdate({ ID: 1 }, { name: 'New' });

      expect(result).toBe(false);
    });
  });

  describe('.findOne()', () => {
    it('should run SELECT.one through the external service', async () => {
      const run = jest.fn().mockResolvedValue({ ID: 1 });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.findOne({ ID: 1 });

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ID: 1 });
    });
  });

  describe('.update()', () => {
    it('should build a key-addressed UPDATE without a where clause', async () => {
      const run = jest.fn().mockResolvedValue(patchedEntity);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await repo.update({ ID: 1 }, { name: 'New' });

      expect(run).toHaveBeenCalledTimes(1);
      const query = run.mock.calls[0][0];
      expect(query.UPDATE.entity).toEqual(keyedRef(ID_EQUALS_1));
      expect(query.UPDATE.where).toBeUndefined();
      expect(query.UPDATE.data).toEqual({ name: 'New' });
    });

    it('should return true when the remote answers with the updated entity (200)', async () => {
      const run = jest.fn().mockResolvedValue(patchedEntity);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.update({ ID: 1 }, { name: 'New' });

      expect(result).toBe(true);
    });

    it.each([[''], [undefined], [null]])(
      'should return true when the remote answers with no content (%p)',
      async (value) => {
        const run = jest.fn().mockResolvedValue(value);
        const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

        const result = await repo.update({ ID: 1 }, { name: 'New' });

        expect(result).toBe(true);
      },
    );

    it('should return true when the result carries exactly 1 affected row', async () => {
      const run = jest.fn().mockResolvedValue(Object.assign([], { affected: 1 }));
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.update({ ID: 1 }, { name: 'New' });

      expect(result).toBe(true);
    });

    it('should return false when the remote answers with 404 (no such row)', async () => {
      const run = jest.fn().mockRejectedValue(remoteError(404, 'Not Found'));
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.update({ ID: 1 }, { name: 'New' });

      expect(result).toBe(false);
    });

    it('should rethrow every other remote error unchanged', async () => {
      const error = remoteError(400, 'Element "ID" does not contain a valid Integer');
      const run = jest.fn().mockRejectedValue(error);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.update({ ID: 1 }, { name: 'New' })).rejects.toBe(error);
    });

    it.each([
      ['code', { code: 404 }],
      ['status', { status: 404 }],
      ['statusCode', { statusCode: 404 }],
    ])('should return false for an in-process 404 carried on `%s` (no upstream reason)', async (_, shape) => {
      const run = jest.fn().mockRejectedValue(Object.assign(new Error('Not Found'), shape));
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.update({ ID: 1 }, { name: 'New' })).resolves.toBe(false);
      await expect(repo.delete({ ID: 1 })).resolves.toBe(false);
      await expect(repo.updateMany({ ID: 1 }, { name: 'New' })).resolves.toBe(0);
      await expect(repo.deleteWhere({ ID: 1 })).resolves.toBe(0);
    });

    it('should rethrow an in-process error without upstream reason that is not a 404', async () => {
      const error = Object.assign(new Error('Forbidden'), { code: 403 });
      const run = jest.fn().mockRejectedValue(error);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.update({ ID: 1 }, { name: 'New' })).rejects.toBe(error);
    });

    it('should rethrow an error whose reason is null unchanged', async () => {
      const error = Object.assign(new Error('boom'), { reason: null });
      const run = jest.fn().mockRejectedValue(error);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.update({ ID: 1 }, { name: 'New' })).rejects.toBe(error);
    });

    it('should rethrow an error raised before the request is sent unchanged', async () => {
      const error = Object.assign(new Error('Filtering is not supported to specify the subject of UPDATE requests'), {
        status: 400,
      });
      const run = jest.fn().mockRejectedValue(error);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.update({ ID: 1 }, { name: 'New' })).rejects.toBe(error);
    });

    it('should return true when the external service reports 1 updated row', async () => {
      const run = jest.fn().mockResolvedValue(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.update({ ID: 1 }, { name: 'New' });

      expect(result).toBe(true);
    });

    it('should return false when the external service does not report exactly 1 updated row', async () => {
      const run = jest.fn().mockResolvedValue(0);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.update({ ID: 1 }, { name: 'New' });

      expect(result).toBe(false);
    });
  });

  describe('.updateOrCreate()', () => {
    it('should throw (not supported on external services)', async () => {
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService());

      await expect(repo.updateOrCreate({ ID: 1, name: 'A' })).rejects.toThrow(
        'Currently not supported on External services, please use update instead !',
      );
    });
  });

  describe('.updateLocaleTexts()', () => {
    it('should build a key-addressed UPDATE of the .texts entity without a where clause', async () => {
      const run = jest.fn().mockResolvedValue({ ID: 1, locale: 'en', name: 'New' });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.updateLocaleTexts({ ID: 1, locale: 'en' }, { name: 'New' });

      expect(result).toBe(true);
      const query = run.mock.calls[0][0];
      expect(query.UPDATE.entity).toEqual({
        ref: [
          {
            id: 'EXTERNAL.FakeEntity.texts',
            where: [{ ref: ['ID'] }, '=', { val: 1 }, 'and', { ref: ['locale'] }, '=', { val: 'en' }],
          },
        ],
      });
      expect(query.UPDATE.where).toBeUndefined();
    });

    it('should rethrow a remote 404 unchanged', async () => {
      const error = remoteError(404, 'Invalid resource path "EXTERNAL.texts"');
      const run = jest.fn().mockRejectedValue(error);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.updateLocaleTexts({ ID: 1, locale: 'en' }, { name: 'New' })).rejects.toBe(error);
    });

    it('should return true when the external service reports 1 updated row', async () => {
      const run = jest.fn().mockResolvedValue(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.updateLocaleTexts({ ID: 1, locale: 'en' }, { name: 'New' });

      expect(result).toBe(true);
    });

    it('should return false when the external service does not report exactly 1 updated row', async () => {
      const run = jest.fn().mockResolvedValue(0);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.updateLocaleTexts({ ID: 1, locale: 'en' }, { name: 'New' });

      expect(result).toBe(false);
    });
  });

  describe('.delete()', () => {
    it('should build a key-addressed DELETE without a where clause', async () => {
      const run = jest.fn().mockResolvedValue('');
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await repo.delete({ ID: 1 });

      const query = run.mock.calls[0][0];
      expect(query.DELETE.from).toEqual(keyedRef(ID_EQUALS_1));
      expect(query.DELETE.where).toBeUndefined();
    });

    it('should return false when the remote answers with 404 (no such row)', async () => {
      const run = jest.fn().mockRejectedValue(remoteError(404, 'Not Found'));
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.delete({ ID: 1 });

      expect(result).toBe(false);
    });

    it('should rethrow every other remote error unchanged', async () => {
      const error = remoteError(403, 'Forbidden');
      const run = jest.fn().mockRejectedValue(error);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.delete({ ID: 1 })).rejects.toBe(error);
    });

    it("should return true when the external service reports '' (success)", async () => {
      const run = jest.fn().mockResolvedValue('');
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.delete({ ID: 1 });

      expect(result).toBe(true);
    });

    it("should return false when the external service does not report ''", async () => {
      const run = jest.fn().mockResolvedValue('error');
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.delete({ ID: 1 });

      expect(result).toBe(false);
    });
  });

  describe('.deleteMany()', () => {
    it('should return true when every deletion reports an empty string', async () => {
      const run = jest.fn().mockResolvedValue('');
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteMany({ ID: 1 }, { ID: 2 });

      expect(result).toBe(true);
      expect(run).toHaveBeenCalledTimes(2);
    });

    it('should run one key-addressed DELETE per entry', async () => {
      const run = jest.fn().mockResolvedValue('');
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await repo.deleteMany([{ ID: 1 }, { ID: 2 }]);

      const [[first], [second]] = run.mock.calls;
      expect(first.DELETE.from).toEqual(keyedRef(ID_EQUALS_1));
      expect(second.DELETE.from).toEqual(keyedRef([{ ref: ['ID'] }, '=', { val: 2 }]));
      expect(first.DELETE.where).toBeUndefined();
      expect(second.DELETE.where).toBeUndefined();
    });

    it('should return false when the remote answers one of the deletions with 404', async () => {
      const run = jest.fn().mockRejectedValue(remoteError(404, 'Not Found'));
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteMany({ ID: 1 }, { ID: 2 });

      expect(result).toBe(false);
    });

    it('should rethrow every other remote error unchanged', async () => {
      const error = remoteError(500, 'Internal Server Error');
      const run = jest.fn().mockRejectedValue(error);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.deleteMany({ ID: 1 }, { ID: 2 })).rejects.toBe(error);
    });

    it('should return false when at least one deletion does not report an empty string', async () => {
      const run = jest.fn().mockResolvedValueOnce('').mockResolvedValueOnce('error');
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteMany({ ID: 1 }, { ID: 2 });

      expect(result).toBe(false);
    });

    it('should return false when called with no entries at all', async () => {
      const run = jest.fn();
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteMany();

      expect(result).toBe(false);
      expect(run).not.toHaveBeenCalled();
    });
  });

  describe('.deleteAll()', () => {
    it('should return true when the external service reports > 0 deleted rows', async () => {
      const run = jest.fn().mockResolvedValue(5);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteAll();

      expect(result).toBe(true);
    });

    it('should return false when the external service reports 0 deleted rows', async () => {
      const run = jest.fn().mockResolvedValue(0);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteAll();

      expect(result).toBe(false);
    });
  });

  describe('.exists()', () => {
    it('should return true when the external service returns matching rows', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.exists({ ID: 1 });

      expect(result).toBe(true);
    });

    it('should return false when the external service returns no rows', async () => {
      const run = jest.fn().mockResolvedValue([]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.exists({ ID: 1 });

      expect(result).toBe(false);
    });
  });

  describe('.count()', () => {
    it('should return the length of the rows returned by the external service', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }, { ID: 2 }, { ID: 3 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.count();

      expect(result).toBe(3);
    });
  });

  describe('.findFirst()', () => {
    it('should run SELECT.one ordered ascending through the external service', async () => {
      const run = jest.fn().mockResolvedValue({ ID: 1 });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.findFirst('ID');

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ID: 1 });
    });
  });

  describe('.findLast()', () => {
    it('should run SELECT.one ordered descending through the external service', async () => {
      const run = jest.fn().mockResolvedValue({ ID: 9 });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.findLast('ID');

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ID: 9 });
    });
  });

  describe('.countWhere()', () => {
    it('should return the length of the rows returned by the external service (no keys)', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }, { ID: 2 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.countWhere();

      expect(result).toBe(2);
      const query = run.mock.calls[0][0];
      expect(query.SELECT.where).toBeUndefined();
    });

    it('should apply the filter keys before running through the external service', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.countWhere({ ID: 1 });

      expect(result).toBe(1);
      const query = run.mock.calls[0][0];
      expect(query.SELECT.where).toBeDefined();
    });
  });

  describe('.updateMany()', () => {
    it('should build a key-addressed UPDATE for a plain key object and return 1 on success', async () => {
      const run = jest.fn().mockResolvedValue(patchedEntity);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.updateMany({ ID: 1 }, { name: 'New' });

      expect(result).toBe(1);
      const query = run.mock.calls[0][0];
      expect(query.UPDATE.entity).toEqual(keyedRef(ID_EQUALS_1));
      expect(query.UPDATE.where).toBeUndefined();
    });

    it('should return 0 when the remote answers with 404 (no such row)', async () => {
      const run = jest.fn().mockRejectedValue(remoteError(404, 'Not Found'));
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.updateMany({ ID: 1 }, { name: 'New' });

      expect(result).toBe(0);
    });

    it('should throw for a Filter without calling the external service', async () => {
      const run = jest.fn();
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const filter = new Filter<FakeEntity>({ field: 'name', operator: 'EQUALS', value: 'A' });

      await expect(repo.updateMany(filter, { name: 'B' })).rejects.toThrow(
        'updateMany with a filter is not supported on OData external services, address the rows by key instead !',
      );
      expect(run).not.toHaveBeenCalled();
    });

    it('should not apply a where clause when called with falsy (empty-object) keys', async () => {
      const run = jest.fn().mockResolvedValue(4);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      // buildQueryKeys(undefined) resolves to undefined ("falsy"): exercises the `if (filterKeys)`
      // guard's false branch directly (BaseRepository always supplies keys, so this can only be
      // reached by calling CoreRepository directly).
      const result = await repo.updateMany(undefined as never, { name: 'B' });

      expect(result).toBe(4);
      const query = run.mock.calls[0][0];
      expect(query.UPDATE.where).toBeUndefined();
    });
  });

  describe('.deleteWhere()', () => {
    it('should build a key-addressed DELETE for a plain key object and return 1 on success', async () => {
      const run = jest.fn().mockResolvedValue('');
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteWhere({ ID: 1 });

      expect(result).toBe(1);
      const query = run.mock.calls[0][0];
      expect(query.DELETE.from).toEqual(keyedRef(ID_EQUALS_1));
      expect(query.DELETE.where).toBeUndefined();
    });

    it('should return 0 when the remote answers with 404 (no such row)', async () => {
      const run = jest.fn().mockRejectedValue(remoteError(404, 'Not Found'));
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteWhere({ ID: 1 });

      expect(result).toBe(0);
    });

    it('should throw for a compound Filter without calling the external service', async () => {
      const run = jest.fn();
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const filter = new Filter<FakeEntity>(
        'AND',
        new Filter<FakeEntity>({ field: 'name', operator: 'EQUALS', value: 'A' }),
        new Filter<FakeEntity>({ field: 'ID', operator: 'GREATER THAN', value: 1 }),
      );

      await expect(repo.deleteWhere(filter)).rejects.toThrow(
        'deleteWhere with a filter is not supported on OData external services, address the rows by key instead !',
      );
      expect(run).not.toHaveBeenCalled();
    });

    it('should not apply a where clause when called with no keys', async () => {
      const run = jest.fn().mockResolvedValue(6);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteWhere();

      expect(result).toBe(6);
      const query = run.mock.calls[0][0];
      expect(query.DELETE.where).toBeUndefined();
    });
  });

  describe('.increment() / .decrement() / .incrementMany() / .decrementMany()', () => {
    it.each([
      ['increment', (repo: CoreRepository<FakeEntity>) => repo.increment({ ID: 1 }, 'ID', 5)],
      ['decrement', (repo: CoreRepository<FakeEntity>) => repo.decrement({ ID: 1 }, 'ID', 2)],
      ['incrementMany', (repo: CoreRepository<FakeEntity>) => repo.incrementMany({ ID: 1 }, { ID: 5 })],
      ['decrementMany', (repo: CoreRepository<FakeEntity>) => repo.decrementMany({ ID: 1 }, { ID: 5 })],
      [
        'incrementMany',
        (repo: CoreRepository<FakeEntity>) =>
          repo.incrementMany(new Filter<FakeEntity>({ field: 'name', operator: 'EQUALS', value: 'A' }), { ID: 5 }),
      ],
    ])('%s should throw without calling the external service', async (method, call) => {
      const run = jest.fn();
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(call(repo)).rejects.toThrow(`${method} is not supported on OData external services !`);
      expect(run).not.toHaveBeenCalled();
    });
  });

  describe('.incrementMany() / .decrementMany() - database path', () => {
    // No external service here : the expression reaches the primary database, whose `run` is stubbed to capture it.
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should skip explicitly-undefined field values when building the increment expression', async () => {
      const run = jest.spyOn(cds.db, 'run').mockResolvedValue(1 as never);
      const repo = new CoreRepository<FakeEntity>(entity);

      await repo.incrementMany({ name: 'A' }, { ID: 5, unused: undefined } as never);

      const query = run.mock.calls[0][0] as unknown as { UPDATE: { data?: object; with?: object } };
      const data = query.UPDATE.data ?? query.UPDATE.with;
      expect(data).toHaveProperty('ID');
      expect(data).not.toHaveProperty('unused');
    });

    it('should skip explicitly-undefined field values when building the decrement expression', async () => {
      const run = jest.spyOn(cds.db, 'run').mockResolvedValue(1 as never);
      const repo = new CoreRepository<FakeEntity>(entity);

      await repo.decrementMany({ name: 'A' }, { ID: 5, unused: undefined } as never);

      const query = run.mock.calls[0][0] as unknown as { UPDATE: { data?: object; with?: object } };
      const data = query.UPDATE.data ?? query.UPDATE.with;
      expect(data).toHaveProperty('ID');
      expect(data).not.toHaveProperty('unused');
    });
  });

  describe('full-key addressing of keyed writes', () => {
    // Entity definition as a connected remote service resolves it : `keys` lists the key elements.
    const keyedEntity = { name: 'EXTERNAL.FakeEntity', keys: { ID: { key: true, type: 'cds.Integer' } } } as Entity;

    it.each([
      ['update', (repo: CoreRepository<FakeEntity>) => repo.update({ name: 'A' }, { name: 'B' })],
      ['delete', (repo: CoreRepository<FakeEntity>) => repo.delete({ name: 'A' })],
      ['deleteMany', (repo: CoreRepository<FakeEntity>) => repo.deleteMany({ ID: 1 }, { name: 'A' })],
      ['updateMany', (repo: CoreRepository<FakeEntity>) => repo.updateMany({ name: 'A' }, { name: 'B' })],
      ['deleteWhere', (repo: CoreRepository<FakeEntity>) => repo.deleteWhere({ name: 'A' })],
    ])('%s should throw for a non-key property without calling the external service', async (method, call) => {
      const run = jest.fn().mockResolvedValue('');
      const repo = new CoreRepository<FakeEntity>(keyedEntity, createFakeExternalService(run));

      await expect(call(repo)).rejects.toThrow(
        `${method} on external services addresses a row by its full key : expected (ID), received (name) !`,
      );
      expect(run).not.toHaveBeenCalled();
    });

    it('should throw when a non-key property is passed next to the key', async () => {
      const run = jest.fn().mockResolvedValue(patchedEntity);
      const repo = new CoreRepository<FakeEntity>(keyedEntity, createFakeExternalService(run));

      await expect(repo.update({ ID: 1, name: 'A' }, { name: 'B' })).rejects.toThrow(
        'update on external services addresses a row by its full key : expected (ID), received (ID, name) !',
      );
      expect(run).not.toHaveBeenCalled();
    });

    it('should throw when a key element of a composite key is missing or undefined', async () => {
      const run = jest.fn().mockResolvedValue('');
      const compositeEntity = {
        name: 'EXTERNAL.FakeEntity',
        keys: { ID: { key: true }, code: { key: true } },
      } as unknown as Entity;
      const repo = new CoreRepository<FakeEntity & { code?: string }>(compositeEntity, createFakeExternalService(run));

      await expect(repo.delete({ ID: 1 })).rejects.toThrow(
        'delete on external services addresses a row by its full key : expected (ID, code), received (ID) !',
      );
      await expect(repo.delete({ ID: 1, code: undefined })).rejects.toThrow(
        'delete on external services addresses a row by its full key : expected (ID, code), received (ID) !',
      );
      expect(run).not.toHaveBeenCalled();
    });

    it("should resolve the key elements from the external service's entities when the entity carries none", async () => {
      const run = jest.fn().mockResolvedValue('');
      const externalService = createFakeExternalService(run, { FakeEntity: keyedEntity });
      const repo = new CoreRepository<FakeEntity>(entity, externalService);

      await expect(repo.delete({ name: 'A' })).rejects.toThrow(
        'delete on external services addresses a row by its full key : expected (ID), received (name) !',
      );
      expect(run).not.toHaveBeenCalled();
    });

    it('should ignore association keys and accept IsActiveEntity as an optional key element', async () => {
      const run = jest.fn().mockResolvedValue('');
      const draftEntity = {
        name: 'EXTERNAL.FakeEntity',
        keys: {
          ID: { key: true },
          author: { key: true, isAssociation: true },
          author_ID: { key: true },
          IsActiveEntity: { key: true, virtual: true },
        },
      } as unknown as Entity;
      const repo = new CoreRepository<FakeEntity & { author_ID?: number; IsActiveEntity?: boolean }>(
        draftEntity,
        createFakeExternalService(run),
      );

      await expect(repo.delete({ ID: 1, author_ID: 2 })).resolves.toBe(true);
      await expect(repo.delete({ ID: 1, author_ID: 2, IsActiveEntity: true })).resolves.toBe(true);
      await expect(repo.delete({ ID: 1 })).rejects.toThrow(
        'delete on external services addresses a row by its full key : expected (ID, author_ID), received (ID) !',
      );
      expect(run).toHaveBeenCalledTimes(2);
    });

    it('findOneAndUpdate should address the update by the key of the found row', async () => {
      const run = jest.fn().mockResolvedValueOnce({ ID: 7, name: 'Old' }).mockResolvedValueOnce(patchedEntity);
      const repo = new CoreRepository<FakeEntity>(keyedEntity, createFakeExternalService(run));

      const result = await repo.findOneAndUpdate({ name: 'Old' }, { name: 'New' });

      expect(result).toBe(true);
      const query = run.mock.calls[1][0];
      expect(query.UPDATE.entity).toEqual(keyedRef([{ ref: ['ID'] }, '=', { val: 7 }]));
      expect(query.UPDATE.data).toEqual({ name: 'New' });
    });
  });

  describe('result of a keyed write on an OData external service', () => {
    it.each([['odata'], ['odata-v2'], ['odata-v4']])(
      'should return true for any resolved result of a %s service',
      async (kind) => {
        // A remote entity with an element named `value` or `affected` : CAP resolves the PATCH to that element's value.
        const run = jest
          .fn()
          .mockResolvedValueOnce('abc')
          .mockResolvedValueOnce(5)
          .mockResolvedValueOnce({ affected: 0 });
        const repo = new CoreRepository<FakeEntity>(entity, Object.assign(createFakeExternalService(run), { kind }));

        expect(await repo.update({ ID: 1 }, { name: 'abc' })).toBe(true);
        expect(await repo.update({ ID: 1 }, { name: 'abc' })).toBe(true);
        expect(await repo.update({ ID: 1 }, { name: 'abc' })).toBe(true);
      },
    );

    it('should keep requiring exactly 1 affected row from a non-OData service', async () => {
      const run = jest.fn().mockResolvedValueOnce(0).mockResolvedValueOnce('abc');
      const repo = new CoreRepository<FakeEntity>(
        entity,
        Object.assign(createFakeExternalService(run), { kind: 'app-service' }),
      );

      expect(await repo.update({ ID: 1 }, { name: 'abc' })).toBe(false);
      expect(await repo.update({ ID: 1 }, { name: 'abc' })).toBe(false);
    });
  });

  describe('.deleteMany() - settling every deletion', () => {
    // Mirrors `srv.run([...])` of a remote service : every query of an array is dispatched through `Promise.all`.
    const createRemoteRun = (handlers: Record<number, () => Promise<unknown>>) =>
      jest.fn((query: unknown) => {
        const deleteOne = (single: { DELETE: { from: { ref: [{ where: [unknown, string, { val: number }] }] } } }) =>
          handlers[single.DELETE.from.ref[0].where[2].val]();

        return Array.isArray(query) ? Promise.all(query.map(deleteOne)) : deleteOne(query as never);
      });

    const later = <V>(settle: () => V) => new Promise<V>((resolve) => setTimeout(() => resolve(settle()), 20));

    it('should rethrow a later non-404 error instead of resolving false on an earlier 404', async () => {
      const forbidden = remoteError(403, 'Forbidden');
      const run = createRemoteRun({
        1: async () => '',
        2: async () => Promise.reject(remoteError(404, 'Not Found')),
        3: () => later(() => undefined).then(() => Promise.reject(forbidden)),
      });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await expect(repo.deleteMany({ ID: 1 }, { ID: 2 }, { ID: 3 })).rejects.toBe(forbidden);
    });

    it('should resolve false only after every other deletion has settled', async () => {
      let slowDeletionSettled = false;
      const run = createRemoteRun({
        1: () =>
          later(() => {
            slowDeletionSettled = true;
            return '';
          }),
        2: async () => Promise.reject(remoteError(404, 'Not Found')),
      });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteMany({ ID: 1 }, { ID: 2 });

      expect(result).toBe(false);
      expect(slowDeletionSettled).toBe(true);
    });
  });

  describe('.builder()', () => {
    it('.find().execute() should run through the external service', async () => {
      const run = jest.fn().mockResolvedValue([{ ID: 1 }]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.builder().find({ ID: 1 }).execute();

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ ID: 1 }]);
    });

    it('.findOne().execute() should run through the external service', async () => {
      const run = jest.fn().mockResolvedValue({ ID: 1 });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.builder().findOne({ ID: 1 }).execute();

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ID: 1 });
    });
  });
});
