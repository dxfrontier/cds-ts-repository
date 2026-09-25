import cds from '@sap/cds';

/**
 * Marks a `BaseRepository<T>` / `BaseRepositoryDraft<T>` class as backed by a remote OData service
 * instead of the primary database. Connects lazily via `cds.connect.to(service)`.
 *
 * @remarks
 * `cds.connect.to(service)` fires at class-decoration time but is NOT awaited: the static
 * `externalService` property lands on the class only once that promise resolves, inside a `.then()`
 * callback. A repository instantiated before it resolves is built as if the decorator were absent —
 * it silently queries the primary database instead of throwing — so construct repositories once
 * bootstrap has settled, not at import time. Once attached, it applies to the whole class: every
 * `CoreRepository` method reroutes through `externalService.run(query)` — except `getLocaleTexts` and
 * `updateOrCreate`, which throw instead, along with any other method that cannot run on an OData
 * external service; see each method's `@remarks` and the README `@ExternalService` section for the full
 * list. `BaseRepositoryDraft` accepts it too, but its `createDraft` / `createManyDrafts` /
 * `updateOrCreateDraft` throw regardless, because the remote entity has no `.drafts` table.
 *
 * @param service - The name of the external service to connect to.
 * @returns A class decorator that, once `cds.connect.to(service)` resolves, defines the connected
 * service as a static `externalService` property on the decorated class.
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
    cds.connect.to(service).then((service) => {
      Reflect.defineProperty(target, 'externalService', {
        value: service,
      });
    });
  };
}
