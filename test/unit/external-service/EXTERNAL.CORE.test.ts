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
    it('should throw (not supported on external services)', async () => {
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService());

      await expect(repo.updateLocaleTexts({ ID: 1, locale: 'en' }, { name: 'New' })).rejects.toThrow(
        'Currently not supported on External services !',
      );
    });
  });

  describe('.delete()', () => {
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

    it('should return true when the external service reports a numeric 1 (affected-count convention)', async () => {
      const run = jest.fn().mockResolvedValue(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.delete({ ID: 1 });

      expect(result).toBe(true);
    });

    it('should return true when the external service reports { affected: 1 }', async () => {
      const run = jest.fn().mockResolvedValue({ affected: 1 });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.delete({ ID: 1 });

      expect(result).toBe(true);
    });

    it('should return false when the external service reports { affected: 0 }', async () => {
      const run = jest.fn().mockResolvedValue({ affected: 0 });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.delete({ ID: 1 });

      expect(result).toBe(false);
    });

    it('should return false when the external service reports a numeric 0', async () => {
      const run = jest.fn().mockResolvedValue(0);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.delete({ ID: 1 });

      expect(result).toBe(false);
    });
  });

  describe('.deleteMany()', () => {
    it('should return true when every deletion reports an empty string', async () => {
      const run = jest.fn().mockResolvedValue(['', '']);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteMany({ ID: 1 }, { ID: 2 });

      expect(result).toBe(true);
      expect(run).toHaveBeenCalledTimes(1);
      expect(run.mock.calls[0][0]).toHaveLength(2);
    });

    it('should return false when at least one deletion does not report an empty string', async () => {
      const run = jest.fn().mockResolvedValue(['', 'error']);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteMany({ ID: 1 }, { ID: 2 });

      expect(result).toBe(false);
    });

    it('should return true when called with no entries at all (vacuous success)', async () => {
      const run = jest.fn().mockResolvedValue([]);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteMany();

      expect(result).toBe(true);
      expect(run).toHaveBeenCalledWith([]);
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

    it('should return true when the external service reports { affected: 3 }', async () => {
      const run = jest.fn().mockResolvedValue({ affected: 3 });
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteAll();

      expect(result).toBe(true);
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
    it('should return the number of updated rows reported by the external service', async () => {
      const run = jest.fn().mockResolvedValue(4);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.updateMany({ name: 'A' }, { name: 'B' });

      expect(result).toBe(4);
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
    it('should return the number of deleted rows reported by the external service', async () => {
      const run = jest.fn().mockResolvedValue(2);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.deleteWhere({ name: 'A' });

      expect(result).toBe(2);
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

  describe('.increment() / .decrement()', () => {
    it('should return true when the external service reports 1 updated row (increment)', async () => {
      const run = jest.fn().mockResolvedValue(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.increment({ ID: 1 }, 'ID', 5);

      expect(result).toBe(true);
    });

    it('should return false when the external service does not report exactly 1 updated row (increment)', async () => {
      const run = jest.fn().mockResolvedValue(0);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.increment({ ID: 1 }, 'ID');

      expect(result).toBe(false);
    });

    it('should return true when the external service reports 1 updated row (decrement)', async () => {
      const run = jest.fn().mockResolvedValue(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.decrement({ ID: 1 }, 'ID', 2);

      expect(result).toBe(true);
    });

    it('should return false when the external service does not report exactly 1 updated row (decrement)', async () => {
      const run = jest.fn().mockResolvedValue(0);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.decrement({ ID: 1 }, 'ID');

      expect(result).toBe(false);
    });
  });

  describe('.incrementMany() / .decrementMany()', () => {
    it('should return the number reported by the external service (increment, with keys)', async () => {
      const run = jest.fn().mockResolvedValue(3);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.incrementMany({ name: 'A' }, { ID: 5 });

      expect(result).toBe(3);
    });

    it('should return the number reported by the external service (increment, with a Filter)', async () => {
      const run = jest.fn().mockResolvedValue(2);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const filter = new Filter<FakeEntity>({ field: 'name', operator: 'EQUALS', value: 'A' });
      const result = await repo.incrementMany(filter, { ID: 5 });

      expect(result).toBe(2);
    });

    it('should return the number reported by the external service (decrement, with keys)', async () => {
      const run = jest.fn().mockResolvedValue(3);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.decrementMany({ name: 'A' }, { ID: 5 });

      expect(result).toBe(3);
    });

    it('should return the number reported by the external service (decrement, with a Filter)', async () => {
      const run = jest.fn().mockResolvedValue(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const filter = new Filter<FakeEntity>({ field: 'name', operator: 'EQUALS', value: 'A' });
      const result = await repo.decrementMany(filter, { ID: 5 });

      expect(result).toBe(1);
    });

    it('should not apply a where clause when incrementMany is called with falsy keys', async () => {
      const run = jest.fn().mockResolvedValue(7);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.incrementMany(undefined as never, { ID: 5 });

      expect(result).toBe(7);
      const query = run.mock.calls[0][0];
      expect(query.UPDATE.where).toBeUndefined();
    });

    it('should not apply a where clause when decrementMany is called with falsy keys', async () => {
      const run = jest.fn().mockResolvedValue(8);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      const result = await repo.decrementMany(undefined as never, { ID: 5 });

      expect(result).toBe(8);
      const query = run.mock.calls[0][0];
      expect(query.UPDATE.where).toBeUndefined();
    });

    it('should skip explicitly-undefined field values when building the increment expression', async () => {
      const run = jest.fn().mockResolvedValue(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await repo.incrementMany({ name: 'A' }, { ID: 5, unused: undefined } as never);

      const query = run.mock.calls[0][0];
      const data = query.UPDATE.data ?? query.UPDATE.with;
      expect(data).toHaveProperty('ID');
      expect(data).not.toHaveProperty('unused');
    });

    it('should skip explicitly-undefined field values when building the decrement expression', async () => {
      const run = jest.fn().mockResolvedValue(1);
      const repo = new CoreRepository<FakeEntity>(entity, createFakeExternalService(run));

      await repo.decrementMany({ name: 'A' }, { ID: 5, unused: undefined } as never);

      const query = run.mock.calls[0][0];
      const data = query.UPDATE.data ?? query.UPDATE.with;
      expect(data).toHaveProperty('ID');
      expect(data).not.toHaveProperty('unused');
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
