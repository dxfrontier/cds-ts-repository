import type { ExternalServiceProps } from '../../lib/types/types';

/**
 * Creates a minimal fake object satisfying `ExternalServiceProps`, used to exercise the
 * `externalService` branches of `CoreRepository` / `BaseRepository` / `BaseRepositoryDraft`
 * without needing a real remote OData/HANA service.
 *
 * `CoreRepository` only ever calls `.run(query)` on this object, so a `jest.fn()` is enough to
 * both drive the branch and assert on the exact CQN query it was invoked with. `.entities` is only
 * read by `util.findExternalServiceEntity` (used by the `BaseRepository` / `BaseRepositoryDraft`
 * constructors when a static `externalService` is present).
 *
 * @param run - A jest mock standing in for `Service['run']`. Defaults to an empty `jest.fn()`,
 * which the caller is expected to configure via `.mockResolvedValueOnce(...)` / `.mockImplementation(...)`.
 * @param entities - A fake `entities` dictionary keyed by the simple (un-namespaced) entity name.
 * @example
 * const run = jest.fn().mockResolvedValue([{ ID: 1 }]);
 * const externalService = createFakeExternalService(run);
 * const coreRepository = new CoreRepository({ name: 'My.Entity' }, externalService);
 */
export const createFakeExternalService = (
  run: jest.Mock = jest.fn(),
  entities: Record<string, unknown> = {},
): ExternalServiceProps =>
  ({
    run,
    entities,
  }) as unknown as ExternalServiceProps;
