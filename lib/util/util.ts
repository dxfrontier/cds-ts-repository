import type { Entity, ExternalServiceBinding, ExternalServiceDescriptor, ExternalServiceProps } from '../types/types';

export const util = {
  /**
   * Re-resolves an entity from the entity set of an external service.
   * @param entity - The entity the repository was constructed with.
   * @param externalService - The connected external service.
   * @param serviceName - Optional name of that service, used in the error message when it cannot be read off the service.
   * @returns Returns the entity as the external service declares it.
   * @throws {Error} When the entity has no counterpart in the external service's entity set.
   * @example
   * findExternalServiceEntity({ name: 'API_BUSINESS_PARTNER.A_BusinessPartner' }, externalService)
   */
  findExternalServiceEntity(entity: Entity, externalService: ExternalServiceProps, serviceName?: string): Entity {
    const remoteEntity = this.subtractExternalEntity(entity.name);
    const foundEntity = externalService.entities[remoteEntity];

    if (foundEntity == null) {
      const service = serviceName ?? (Reflect.get(externalService, 'name') as string | undefined) ?? 'external service';

      throw new Error(`Entity '${remoteEntity}' was not found in the entity set of the service '${service}' !`);
    }

    return foundEntity;
  },

  /**
   * Checks whether a repository is bound to a service which is not connected yet.
   * @param externalService - The binding attached to the repository.
   * @returns Returns true when the binding is a descriptor of a pending connection, false when it is the connected service.
   */
  isExternalServiceDescriptor(externalService: ExternalServiceBinding): externalService is ExternalServiceDescriptor {
    return 'promise' in externalService;
  },

  /**
   * Resolves the remote counterparts of an external service binding, awaiting the connection when it is
   * still pending.
   *
   * The connection is awaited on every call : `cds.connect.to(name)` is memoized by CDS itself, so
   * re-awaiting it is cheap - the callers memoize the resolved target anyway when they run more than one
   * query. An already connected service is passed through together with the entity it was constructed
   * with, which was swapped at construction time.
   * @param entity - The entity the repository was constructed with.
   * @param externalService - The connected service or the descriptor of the pending connection.
   * @returns A promise resolving to the connected service and the entity to target on it.
   * @throws {Error} When the connection fails, or when the entity has no counterpart in the service's entity set.
   */
  async resolveExternalTarget(
    entity: Entity,
    externalService: ExternalServiceBinding,
  ): Promise<{ service: ExternalServiceProps; entity: Entity }> {
    if (!this.isExternalServiceDescriptor(externalService)) {
      return { service: externalService, entity };
    }

    const service = (await externalService.promise) as unknown as ExternalServiceProps;

    return { service, entity: this.findExternalServiceEntity(entity, service, externalService.name) };
  },

  /**
   * Points an already built `SELECT` at another entity.
   *
   * The builders assemble their query synchronously, against the entity known at chain time - which is
   * the LOCAL one while the connection of a lazily attached external service is still pending. The
   * `from` reference is replaced right before the query is handed to the remote service, everything else
   * (`where`, `columns`, `orderBy`, ...) is entity agnostic and stays as it was chained.
   * @param query - The built query to retarget.
   * @param entityName - The name of the entity the query has to target.
   */
  retargetQuery(query: SELECT<any>, entityName: string): void {
    query.SELECT.from = { ref: [entityName] };

    // `cds.infer` caches the resolved target on the query itself (`_target`) as soon as `.elements` is
    // read off the builder ; a pinned target would override the rewritten `from` when the remote service
    // resolves the query, so the cache is dropped and recomputed from the mutated `from`.
    Reflect.deleteProperty(query, '_target');
  },

  /**
   * This function will from a string the entity.
   * @param entity - The entity name
   * @returns Returns formatted entity
   * @example
   * subtractExternalEntity('API_BUSINESS_PARTNER.A_BusinessPartner')
   *
   * @returns Returns the subtracted entity E.g 'A_BusinessPartner'
   */
  subtractExternalEntity(entity: string): string {
    return entity.substring(entity.lastIndexOf('.') + 1);
  },

  /**
   * Checks if the provided array contains no arguments.
   * @param value - The array of arguments.
   * @returns Returns true if the array contains no arguments, false otherwise.
   */
  noArgs(value: unknown[]): boolean {
    return value.length === 0;
  },
};

export default util;
