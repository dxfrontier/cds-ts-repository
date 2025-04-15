import type { Entity, ExternalServiceProps } from '../types/types';

export const util = {
  findExternalServiceEntity(entity: Entity, externalService: ExternalServiceProps): Entity {
    return externalService.entities[this.subtractExternalEntity(entity.name)];
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
