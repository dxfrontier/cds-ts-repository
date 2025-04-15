/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type { Association, struct, type } from '@sap/cds';
import { AutoExpandLevels } from '../../../types/types';

import type { AssociationFunction, ExpandStructure, ValueExpand } from '../../../types/types';
import { constants } from '../../../constants/constants';

export const expandUtils = {
  /**
   * Checks if property levels are found in the auto-expand levels structure.
   * @param value - The auto-expand levels structure.
   * @returns Returns true if property levels are found, false otherwise.
   */
  isPropertyLevelsFound(value: AutoExpandLevels): value is AutoExpandLevels {
    return Object.prototype.hasOwnProperty.call(value, 'levels') && value.levels !== undefined;
  },

  /**
   * Checks if the given element is expandable.
   * @param element - The element object.
   * @returns Returns true if the element is expandable, false otherwise.
   */
  isElementExpandable(
    element: type &
      struct &
      Association & {
        key?: boolean | undefined;
        virtual?: boolean | undefined;
        unique?: boolean | undefined;
        notNull?: boolean | undefined;
      } & Partial<{ name: string }>,
  ): boolean {
    return (
      (element.type === 'cds.Association' || element.type === 'cds.Composition') &&
      element.name !== 'DraftAdministrativeData' &&
      element.name !== 'texts' &&
      element.name !== 'currency' &&
      element.name !== 'SiblingEntity'
    );
  },

  processExpandAll: (association: (func: (linkedEntity: AssociationFunction) => void) => void): void => {
    association((linkedEntity: AssociationFunction) => {
      linkedEntity(constants.COMMON.ALL_FIELDS);
    });
  },

  exposeFieldsOnly: (fields: unknown[], linkedEntity: AssociationFunction): void => {
    fields.forEach((item: unknown) => {
      linkedEntity(item);
    });
  },

  processOnlySelect: (
    association: (func: (linkedEntity: AssociationFunction) => void) => void,
    value: ValueExpand,
  ): void => {
    association((linkedEntity: AssociationFunction) => {
      expandUtils.exposeFieldsOnly(value.select, linkedEntity);
    });
  },

  processSelectAndExpand: (
    association: (func: (linkedEntity: AssociationFunction) => void) => void,
    value: ValueExpand,
  ): void => {
    association((linkedEntity: AssociationFunction) => {
      expandUtils.exposeFieldsOnly(value.select, linkedEntity);
      expandUtils.buildDeepExpand(value.expand, linkedEntity);
    });
  },

  /**
   * Checks if the provided value represents a single expand.
   * @param value - The expand value.
   * @returns Returns true if the value represents a single expand, false otherwise.
   */
  // move it to FindUtils maybe
  isSingleExpand(value: unknown[]): boolean {
    return typeof value === 'string';
  },

  /**
   * Checks if the given value represents an empty expand structure (all fields).
   * @param value - The expand structure value.
   * @returns Returns true if the value represents an empty expand structure, false otherwise.
   */
  isExpandAll(value: ExpandStructure): boolean {
    return typeof value === 'object' && Object.keys(value).length === 0;
  },

  /**
   * Checks if the given value represents a select and expand structure.
   * @param value - The expand structure value.
   * @returns Returns true if the value represents a select and expand structure, false otherwise.
   */
  isSelectAndExpand(value: ExpandStructure): boolean {
    return 'select' in value && 'expand' in value;
  },

  /**
   * Checks if the given value represents a select only structure.
   * @param value - The expand structure value.
   * @returns Returns true if the value represents a select only structure, false otherwise.
   */
  isSelectOnly(value: ExpandStructure): boolean {
    return 'select' in value && !('expand' in value);
  },

  /**
   * Checks if the given value represents an expand only structure.
   * @param value - The expand structure value.
   * @returns Returns true if the value represents an expand only structure, false otherwise.
   */
  isExpandOnly(value: ExpandStructure): boolean {
    return 'expand' in value;
  },

  processOnlyExpand: (
    association: (func: (linkedEntity: AssociationFunction) => void) => void,
    value: ValueExpand,
  ): void => {
    association((linkedEntity: AssociationFunction) => {
      expandUtils.expandFirstLevel(linkedEntity);
      expandUtils.buildDeepExpand(value.expand, linkedEntity);
    });
  },

  expandFirstLevel: (columnProjection: (func: string) => void): void => {
    columnProjection(constants.COMMON.ALL_FIELDS);
  },

  buildDeepExpand: (expandStructure: ExpandStructure, columnProjection: any): void => {
    for (const key in expandStructure) {
      const value = expandStructure[key];
      const association = columnProjection[key];

      // Empty object, expand all
      if (expandUtils.isExpandAll(value)) {
        expandUtils.processExpandAll(association);
      }
      // Both select and expand
      else if (expandUtils.isSelectAndExpand(value)) {
        expandUtils.processSelectAndExpand(association, value);
      }
      // Only select
      else if (expandUtils.isSelectOnly(value)) {
        expandUtils.processOnlySelect(association, value);
      }
      // Only expand
      else if (expandUtils.isExpandOnly(value)) {
        expandUtils.processOnlyExpand(association, value);
      } else {
        throw new Error(constants.MESSAGES.DEEP_EXPAND_NOT_EXIST);
      }
    }
  },

  buildSingleExpand: (columnProjection: Function[], associations: any[]): void => {
    associations.forEach((association) => {
      columnProjection[association]((linkedEntity: AssociationFunction) => {
        linkedEntity(constants.COMMON.ALL_FIELDS);
      });
    });
  },

  buildAutoExpandStructure(elements: any | undefined, associations: any[], depth = 1): ExpandStructure {
    const value = associations[0];

    if (expandUtils.isPropertyLevelsFound(value) && value.levels !== undefined) {
      if (depth > value.levels) {
        return {}; // STOP when reached depth
      }
    }

    return expandUtils.buildStructure(elements, associations, depth);
  },

  buildStructure(elements: any | undefined, associations: any[], depth: number): ExpandStructure {
    const expandStructure: ExpandStructure = {};

    for (const key in elements) {
      const element = elements[key];

      if (expandUtils.isElementExpandable(element)) {
        expandStructure[key] = {
          expand: expandUtils.buildAutoExpandStructure(element._target.elements, associations, depth + 1),
        };
      }
    }

    return expandStructure;
  },
};
