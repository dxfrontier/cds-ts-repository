import cds from '@sap/cds';

import { BaseRepository } from '../../../lib/core/BaseRepository';
import { ExternalService } from '../../../lib/decorators/class';
import type { Entity, ExternalServiceProps } from '../../../lib/types/types';
import { createFakeExternalService } from '../../util/fakeExternalService';
import { startTestServer } from '../../util/util';

// A real DB is never touched: `cds.connect.to` is mocked with a deferred the test controls, so the
// connection settles exactly when the scenario needs it to. The test server is still booted (as in
// every other suite) because the global SELECT/INSERT/UPDATE/DELETE/UPSERT cds.ql query builders are
// only reliably installed once `@sap/cds` is actually bootstrapped.
startTestServer(__dirname, 'bookshop');

type BusinessPartner = { BusinessPartner: string };

const SERVICE_NAME = 'API_BUSINESS_PARTNER';

// The entity handed to `super(...)`: the LOCAL one, as a repository is constructed with the cds-typer
// entity and not with the one the remote service declares.
const localEntity: Entity = { name: 'Local.A_BusinessPartner' };
const remoteEntity: Entity = { name: 'API_BUSINESS_PARTNER.A_BusinessPartner' };

/**
 * A promise plus the handles to settle it, standing in for the pending `cds.connect.to(NAME)`.
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

describe('@ExternalService - lazy attachment', () => {
  afterEach(() => {
    // Always restore cds.connect.to: it is a shared singleton and other test files booting a real
    // test server later in the same worker rely on the genuine implementation.
    jest.restoreAllMocks();
  });

  it('should route through the external service for a repository constructed BEFORE the connection resolves', async () => {
    // Arrange
    const deferred = mockPendingConnection();
    const run = jest.fn().mockResolvedValue([{ BusinessPartner: '1' }]);

    @ExternalService(SERVICE_NAME)
    class LazyBusinessPartnerRepository extends BaseRepository<BusinessPartner> {
      constructor() {
        super(localEntity);
      }
    }

    // The repository exists while the connection is still in flight - the old fire-and-forget
    // attachment turned it into a primary-database repository at exactly this point.
    const repository = new LazyBusinessPartnerRepository();

    deferred.resolve(createFakeExternalService(run, { A_BusinessPartner: remoteEntity }));

    // Act
    const result = await repository.find();

    // Assert : the query never reached the primary database, it was run by the service against the
    // entity that service declares.
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0].SELECT.from.ref).toEqual([remoteEntity.name]);
    expect(result).toEqual([{ BusinessPartner: '1' }]);
  });

  it('should transparently wait for a connection still pending when the repository is used immediately', async () => {
    // Arrange
    const deferred = mockPendingConnection();
    const run = jest.fn().mockResolvedValue([{ BusinessPartner: '2' }]);

    @ExternalService(SERVICE_NAME)
    class LazyBusinessPartnerRepository extends BaseRepository<BusinessPartner> {
      constructor() {
        super(localEntity);
      }
    }

    // Act : the call is started while the connection is still pending
    const pendingFind = new LazyBusinessPartnerRepository().find();

    expect(run).not.toHaveBeenCalled();

    deferred.resolve(createFakeExternalService(run, { A_BusinessPartner: remoteEntity }));

    const result = await pendingFind;

    // Assert
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0].SELECT.from.ref).toEqual([remoteEntity.name]);
    expect(result).toEqual([{ BusinessPartner: '2' }]);
  });

  it('should retarget the query of a builder chain at the entity the service declares', async () => {
    // Arrange
    const deferred = mockPendingConnection();
    const run = jest.fn().mockResolvedValue([{ BusinessPartner: '3' }]);

    @ExternalService(SERVICE_NAME)
    class LazyBusinessPartnerRepository extends BaseRepository<BusinessPartner> {
      constructor() {
        super(localEntity);
      }
    }

    const repository = new LazyBusinessPartnerRepository();

    deferred.resolve(createFakeExternalService(run, { A_BusinessPartner: remoteEntity }));

    // Act : the chain is built against the LOCAL entity, `.execute()` points it at the remote one
    const result = await repository.builder().find({ BusinessPartner: '3' }).execute();

    // Assert
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0].SELECT.from.ref).toEqual([remoteEntity.name]);
    expect(run.mock.calls[0][0].SELECT.where).toBeDefined();
    expect(result).toEqual([{ BusinessPartner: '3' }]);
  });

  it('should surface a failed connection on the first repository call, without an unhandled rejection at decoration time', async () => {
    // Arrange
    const deferred = mockPendingConnection();
    const unhandledRejection = jest.fn();

    process.on('unhandledRejection', unhandledRejection);

    try {
      @ExternalService(SERVICE_NAME)
      class LazyBusinessPartnerRepository extends BaseRepository<BusinessPartner> {
        constructor() {
          super(localEntity);
        }
      }

      const repository = new LazyBusinessPartnerRepository();

      deferred.reject(new Error('connection refused'));

      // Act : let the rejection settle BEFORE anything awaits it - the decorator's side handle is
      // what has to keep it from being reported as unhandled.
      await new Promise((resolve) => setImmediate(resolve));

      // Assert
      expect(unhandledRejection).not.toHaveBeenCalled();
      await expect(repository.find()).rejects.toThrow('connection refused');
    } finally {
      process.off('unhandledRejection', unhandledRejection);
    }
  });

  it('should throw an error naming the entity and the service when the remote entity set has no counterpart', async () => {
    // Arrange
    const deferred = mockPendingConnection();

    @ExternalService(SERVICE_NAME)
    class LazyBusinessPartnerRepository extends BaseRepository<BusinessPartner> {
      constructor() {
        super(localEntity);
      }
    }

    const repository = new LazyBusinessPartnerRepository();

    deferred.resolve(createFakeExternalService(jest.fn(), {}));

    // Act + Assert
    await expect(repository.find()).rejects.toThrow(
      `Entity 'A_BusinessPartner' was not found in the entity set of the service '${SERVICE_NAME}' !`,
    );
  });

  it('should keep the synchronous flow when an already connected service is attached as the static', async () => {
    // Arrange
    const run = jest.fn().mockResolvedValue([{ BusinessPartner: '4' }]);
    const fakeService = createFakeExternalService(run, { A_BusinessPartner: remoteEntity });

    class LegacyBusinessPartnerRepository extends BaseRepository<BusinessPartner> {
      static externalService = fakeService;

      constructor() {
        super(localEntity);
      }
    }

    // Act
    const repository = new LegacyBusinessPartnerRepository();

    // Assert : the entity is swapped by the constructor itself, nothing is resolved lazily
    expect(repository['entity']).toBe(remoteEntity);

    const result = await repository.find();

    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0].SELECT.from.ref).toEqual([remoteEntity.name]);
    expect(result).toEqual([{ BusinessPartner: '4' }]);
  });
});
