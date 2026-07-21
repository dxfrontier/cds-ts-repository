import cds from '@sap/cds';

import { BaseRepository } from '../../../lib/core/BaseRepository';
import { BaseRepositoryDraft } from '../../../lib/core/BaseRepositoryDraft';
import { ExternalService } from '../../../lib/decorators/class';
import util from '../../../lib/util/util';
import type { Entity } from '../../../lib/types/types';
import { createFakeExternalService } from '../../util/fakeExternalService';
import { startTestServer } from '../../util/util';

// A real DB is never touched: every constructor test below is routed through a fake external
// service (see test/util/fakeExternalService.ts). The test server is still booted (as in every
// other suite) because the global SELECT/INSERT/UPDATE/DELETE/UPSERT cds.ql query builders are
// only reliably installed once `@sap/cds` is actually bootstrapped.
startTestServer(__dirname, 'bookshop');

describe('util', () => {
  describe('.subtractExternalEntity()', () => {
    it('should extract the segment after the last dot', () => {
      expect(util.subtractExternalEntity('API_BUSINESS_PARTNER.A_BusinessPartner')).toBe('A_BusinessPartner');
    });

    it('should return the whole string unchanged when there is no dot', () => {
      expect(util.subtractExternalEntity('Books')).toBe('Books');
    });
  });

  describe('.findExternalServiceEntity()', () => {
    it('should resolve the mapped entity from the external service entities dictionary', () => {
      const mappedEntity: Entity = { name: 'Mapped.Entity' };
      const externalService = createFakeExternalService(jest.fn(), { Foo: mappedEntity });

      const result = util.findExternalServiceEntity({ name: 'External.Foo' }, externalService);

      expect(result).toBe(mappedEntity);
    });
  });

  describe('.noArgs()', () => {
    it('should return true for an empty array', () => {
      expect(util.noArgs([])).toBe(true);
    });

    it('should return false for a non-empty array', () => {
      expect(util.noArgs([1])).toBe(false);
    });
  });
});

describe('externalService constructor wiring', () => {
  const mappedEntity: Entity = { name: 'API_BUSINESS_PARTNER.A_BusinessPartner' };

  describe('BaseRepository', () => {
    it('should resolve the entity via util.findExternalServiceEntity and route queries through the external service', async () => {
      const run = jest.fn().mockResolvedValue([{ BusinessPartner: '1' }]);
      const fakeService = createFakeExternalService(run, { A_BusinessPartner: mappedEntity });

      class ExternalBookRepository extends BaseRepository<{ BusinessPartner: string }> {
        static externalService = fakeService;

        constructor() {
          // Simulates what @ExternalService('API_BUSINESS_PARTNER') would resolve for
          // `super(A_BusinessPartner)` in a real BusinessPartnerRepository.
          super({ name: 'Original.A_BusinessPartner' });
        }
      }

      const repo = new ExternalBookRepository();

      // The constructor should have swapped `this.entity` for the *mapped* entity.
      expect(repo['entity']).toBe(mappedEntity);

      const result = await repo.getAll();

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ BusinessPartner: '1' }]);

      // The query built by CoreRepository should target the mapped entity's resolved name.
      const queryPassedToRun = run.mock.calls[0][0];
      expect(queryPassedToRun.SELECT.from.ref).toEqual([mappedEntity.name]);
    });
  });

  describe('BaseRepositoryDraft', () => {
    it('should resolve the entity via util.findExternalServiceEntity and route queries through the external service', async () => {
      const run = jest.fn().mockResolvedValue([{ BusinessPartner: '1' }]);
      const fakeService = createFakeExternalService(run, { A_BusinessPartner: mappedEntity });

      class ExternalDraftRepository extends BaseRepositoryDraft<{ BusinessPartner: string }> {
        static externalService = fakeService;

        constructor() {
          super({ name: 'Original.A_BusinessPartner' } as Entity & { BusinessPartner: string });
        }
      }

      const repo = new ExternalDraftRepository();

      expect(repo['entity']).toBe(mappedEntity);

      const result = await repo.getAllDrafts();

      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ BusinessPartner: '1' }]);
    });
  });
});

describe('@ExternalService', () => {
  afterEach(() => {
    // Always restore cds.connect.to: it is a shared singleton and other test files booting a real
    // test server later in the same worker rely on the genuine implementation.
    jest.restoreAllMocks();
  });

  it('should connect via cds.connect.to and attach the resolved service as a static "externalService" property', async () => {
    const fakeService = createFakeExternalService();
    const connectSpy = jest.spyOn(cds.connect, 'to').mockResolvedValue(fakeService as never);

    @ExternalService('SOME_SERVICE')
    class Dummy {}

    // cds.connect.to(service).then(cb) resolves asynchronously - flush the microtask queue before asserting.
    await new Promise((resolve) => setImmediate(resolve));

    expect(connectSpy).toHaveBeenCalledWith('SOME_SERVICE');
    expect(Reflect.get(Dummy, 'externalService')).toBe(fakeService);
  });
});
