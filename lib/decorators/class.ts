import cds from '@sap/cds';

/**
 * A decorator to mark a class as handling an external service.
 * It connects the class to the specified external service via SAP Cloud SDK's `cds.connect.to` method.
 *
 * @param service - The name of the external service to connect to.
 * @example
 * ```ts
 * /@ExternalService('API_BUSINESS_PARTNER')
 * class BookRepository extends BaseRepository<A_BusinessPartner> {
 * constructor() {
 *   super(A_BusinessPartner);
 * }
 * ```
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#externalservice | CDS-TS-Repository - @ExternalService}
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
