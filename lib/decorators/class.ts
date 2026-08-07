import cds from '@sap/cds';

/**
 * Marks a `BaseRepository<T>` / `BaseRepositoryDraft<T>` class as backed by a remote OData service
 * instead of the primary database. Connects lazily via `cds.connect.to(service)`.
 *
 * @remarks
 * `cds.connect.to(service)` fires at class-decoration time and the PENDING promise is attached to the
 * class right away, next to the service name — attachment is lazy, the connection is awaited on the
 * FIRST repository call. Construction order is therefore irrelevant: a repository instantiated before
 * the connection settles still routes remotely, and a failed connection surfaces as a rejected
 * repository call instead of a silent fallback to the primary database. It applies to the whole class:
 * every `CoreRepository` method reroutes through `externalService.run(query)` — except `getLocaleTexts`,
 * `updateLocaleTexts` and `updateOrCreate`, which throw instead. `BaseRepositoryDraft` accepts it too,
 * but its `createDraft` / `createManyDrafts` / `updateOrCreateDraft` throw regardless, because the
 * remote entity has no `.drafts` table.
 *
 * @param service - The name of the external service to connect to.
 * @returns A class decorator defining the service name and the pending `cds.connect.to(service)` promise
 * as the static `externalServiceName` / `externalServicePromise` properties of the decorated class, plus
 * the connected service as the static `externalService` property once that promise resolves.
 *
 * @example
 * ```ts
 * /@ExternalService('API_BUSINESS_PARTNER')
 * class BusinessPartnerRepository extends BaseRepository<A_BusinessPartner> {
 *   constructor() {
 *     super(A_BusinessPartner);
 *   }
 * }
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#externalservice | CDS-TS-Repository - @ExternalService}
 * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § @ExternalService
 */
export function ExternalService(service: string) {
  return function <Target extends new (...args: never) => unknown>(target: Target) {
    const connection = cds.connect.to(service);

    // Attached synchronously : a repository constructed before the connection settles picks these up
    // and awaits the promise itself on its first call.
    Reflect.defineProperty(target, 'externalServiceName', {
      value: service,
    });
    Reflect.defineProperty(target, 'externalServicePromise', {
      value: connection,
    });

    // The connected service is kept on the class for back-compat, it is what the direct-static
    // attachment path reads. The no-op catch sits on this SIDE handle and not on `connection` itself :
    // a failed connection must not crash the process as an unhandled rejection before the first
    // repository call, but has to keep rejecting when that call awaits `externalServicePromise`.
    void connection
      .then((connectedService) => {
        Reflect.defineProperty(target, 'externalService', {
          value: connectedService,
        });
      })
      .catch(() => undefined);
  };
}
