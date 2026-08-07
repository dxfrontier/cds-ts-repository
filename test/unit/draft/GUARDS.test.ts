import cds from '@sap/cds';

import { BaseRepositoryDraft } from '../../../lib/core/BaseRepositoryDraft';
import { ExternalService } from '../../../lib/decorators/class';
import type { Entity, ExternalServiceProps } from '../../../lib/types/types';
import { getBookEventRepository } from '../../util/BookEventRepository';
import { createFakeExternalService } from '../../util/fakeExternalService';
import { startTestServer } from '../../util/util';

import type { Book } from '#cds-models/CatalogService';

// Pins `assertDraftCapable`, the guard every public *Draft method of `BaseRepositoryDraft` calls FIRST :
// an attached external service (resolved-static AND still-pending-lazy) and an entity that is not
// draft-enabled (`entity.drafts == null`). Without it, `findUtils.resolveEntityName` silently falls back
// to the ACTIVE table / entity set instead of failing loudly - see the guard's own JSDoc in
// lib/core/BaseRepositoryDraft.ts. The test server is booted (as in every other suite) both because the
// non-draft-enabled `Book` entity only resolves its `.drafts` (`undefined`, here) once CDS is
// bootstrapped (see test/bookshop/@cds-models/_/index.js) and because the global cds.ql query builders
// are only reliably installed once `@sap/cds` is actually bootstrapped.
startTestServer(__dirname, 'bookshop');

// Optional-only on purpose : the guard throws before any field is ever read, so nothing here needs to
// resemble a real entity beyond what the `@ExternalService` wiring requires.
type BusinessPartner = { BusinessPartner?: string };

const SERVICE_NAME = 'API_BUSINESS_PARTNER';
const localEntity: Entity = { name: 'Local.A_BusinessPartner' };
const remoteEntity: Entity = { name: 'API_BUSINESS_PARTNER.A_BusinessPartner' };

// Looks draft-enabled locally (unlike `localEntity`) : used by the lazy-pending scenario below so that a
// guard which checked "draft-enabled" BEFORE "external attached" would pass this check and fall through
// to actually awaiting the pending connection - turning an ordering regression into a jest timeout
// instead of a silent false negative.
const localDraftEnabledEntity: Entity = {
  name: 'Local.A_BusinessPartner',
  drafts: { name: 'Local.A_BusinessPartner_drafts' },
};

/**
 * A promise plus the handles to settle it, standing in for the pending `cds.connect.to(NAME)`.
 * Copied from test/unit/external-service/EXTERNAL.LAZY.test.ts.
 */
const createDeferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
};

/** Mocks `cds.connect.to` with a connection the test settles itself. */
const mockPendingConnection = () => {
  const deferred = createDeferred<ExternalServiceProps>();

  jest.spyOn(cds.connect, 'to').mockReturnValue(deferred.promise as never);

  return deferred;
};

describe('BaseRepositoryDraft - assertDraftCapable guard', () => {
  describe('entity is not draft-enabled', () => {
    let repository: BaseRepositoryDraft<Book>;

    beforeAll(async () => {
      const { Book } = await import('#cds-models/CatalogService');

      // `Books` (test/bookshop/srv/controller/cat-service/catalog-service.cds) carries no
      // `@odata.draft.enabled`, so `.drafts` resolves to `undefined` once CDS is bootstrapped. The
      // singular `Book` export is used (matching test/util/BookEventRepository.ts's convention) - the
      // plural `Books` export also carries the nested `Books.texts` entity as a static, which collides
      // with `Book`'s own `texts` composition field under the stricter `Entity & Draft<T>` constructor
      // parameter type `BaseRepositoryDraft` declares.
      class BookDraftRepository extends BaseRepositoryDraft<Book> {
        constructor() {
          super(Book);
        }
      }

      repository = new BookDraftRepository();
    });

    it('should throw on findDrafts', async () => {
      await expect(repository.findDrafts({})).rejects.toThrow(
        'findDrafts requires a draft-enabled entity, annotate it with @odata.draft.enabled !',
      );
    });

    it('should throw on updateDraft', async () => {
      await expect(repository.updateDraft({ ID: 1 }, { title: 'x' })).rejects.toThrow(
        'updateDraft requires a draft-enabled entity, annotate it with @odata.draft.enabled !',
      );
    });

    it('should throw on deleteManyDrafts', async () => {
      await expect(repository.deleteManyDrafts([{ ID: 1 }])).rejects.toThrow(
        'deleteManyDrafts requires a draft-enabled entity, annotate it with @odata.draft.enabled !',
      );
    });

    it('should throw on builderDraft synchronously, before .find()/.execute() are even reachable', () => {
      expect(() => repository.builderDraft()).toThrow(
        'builderDraft requires a draft-enabled entity, annotate it with @odata.draft.enabled !',
      );
    });

    it('should throw on incrementDraft', async () => {
      await expect(repository.incrementDraft({ ID: 1 }, 'stock', 5)).rejects.toThrow(
        'incrementDraft requires a draft-enabled entity, annotate it with @odata.draft.enabled !',
      );
    });
  });

  describe('external service attached (resolved static)', () => {
    let repository: BaseRepositoryDraft<BusinessPartner>;

    beforeAll(() => {
      const fakeService = createFakeExternalService(jest.fn(), { A_BusinessPartner: remoteEntity });

      class ExternalDraftRepository extends BaseRepositoryDraft<BusinessPartner> {
        static externalService = fakeService;

        constructor() {
          super(localEntity as Entity & BusinessPartner);
        }
      }

      repository = new ExternalDraftRepository();
    });

    it('should throw on findDrafts', async () => {
      await expect(repository.findDrafts({})).rejects.toThrow(
        'findDrafts is currently not supported on External services !',
      );
    });

    it('should throw on updateDraft', async () => {
      await expect(repository.updateDraft({}, { BusinessPartner: 'x' })).rejects.toThrow(
        'updateDraft is currently not supported on External services !',
      );
    });

    it('should throw on deleteManyDrafts', async () => {
      await expect(repository.deleteManyDrafts([{}])).rejects.toThrow(
        'deleteManyDrafts is currently not supported on External services !',
      );
    });

    it('should throw on builderDraft synchronously, before .find()/.execute() are even reachable', () => {
      expect(() => repository.builderDraft()).toThrow('builderDraft is currently not supported on External services !');
    });

    it('should throw on incrementDraft', async () => {
      await expect(repository.incrementDraft({}, 'BusinessPartner' as never, 5)).rejects.toThrow(
        'incrementDraft is currently not supported on External services !',
      );
    });
  });

  describe('external service attached (lazy, connection still pending)', () => {
    afterEach(() => {
      // Always restore cds.connect.to: it is a shared singleton and other test files booting a real
      // test server later in the same worker rely on the genuine implementation.
      jest.restoreAllMocks();
    });

    it('should refuse representative *Draft methods without ever awaiting a connection that never settles', async () => {
      // Arrange : the deferred is NEVER settled - a jest timeout here means the guard awaited the
      // connection instead of throwing synchronously off the decorator's presence. `localDraftEnabledEntity`
      // would pass the draft-enabled check if it were ever reached, isolating this to the external-first
      // ordering itself (see amendment on assertDraftCapable's own JSDoc).
      mockPendingConnection();

      @ExternalService(SERVICE_NAME)
      class LazyDraftRepository extends BaseRepositoryDraft<BusinessPartner> {
        constructor() {
          super(localDraftEnabledEntity as Entity & BusinessPartner);
        }
      }

      const repository = new LazyDraftRepository();

      // Act + Assert : createDraft is the highest-risk method - a remote INSERT would carry draft-only
      // fields the remote entity set does not declare - findDrafts and updateDraft cover the read and
      // write shapes of every other guarded method.
      await expect(repository.createDraft({})).rejects.toThrow(
        'createDraft is currently not supported on External services !',
      );
      await expect(repository.findDrafts({})).rejects.toThrow(
        'findDrafts is currently not supported on External services !',
      );
      await expect(repository.updateDraft({}, { BusinessPartner: 'x' })).rejects.toThrow(
        'updateDraft is currently not supported on External services !',
      );
    });
  });

  describe('draft-enabled, non-external repository (guard stays silent)', () => {
    let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;

    beforeAll(async () => {
      bookEventDraftRepository = await getBookEventRepository();
    });

    it('should not throw and should read through normally', async () => {
      await expect(bookEventDraftRepository.getAllDrafts()).resolves.toBeDefined();
    });
  });
});
