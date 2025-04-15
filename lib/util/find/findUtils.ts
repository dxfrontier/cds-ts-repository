import type {
  // Entry,
  Entity,
} from '../../types/types';
import { columnUtils } from './helper/columnUtils';
import { expandUtils } from './helper/expandUtils';

export const findUtils = {
  /**
   * Resolves the name of the entity based on its draft status.
   * @param entity - The entity object.
   * @returns The resolved entity name.
   */
  resolveEntityName(entity: Entity) {
    // Draft entity
    if (entity.drafts != null) {
      return entity.drafts.name;
    }

    // Active entity
    return entity.name;
  },

  columnUtils,
  expandUtils,
};
