import type { ColumnFormatter } from '../../../types/types';
import { constants } from '../../../constants/constants';

export const columnUtils = {
  /**
   * Gets the names of expanded associations from the columns array.
   * Expanded associations are objects with a 'ref' property (the association name)
   * and an 'expand' property.
   * @param columns - An array of column expressions.
   * @returns A Set of expanded association names.
   */
  getExpandedAssociationNames(columns: any[] | undefined): Set<string> {
    const expandedNames = new Set<string>();

    columns?.forEach((col) => {
      // Expanded associations have a structure like: { ref: ['reviews'], expand: [...] }
      if (col && typeof col === 'object' && 'ref' in col && 'expand' in col) {
        const refName = Array.isArray(col.ref) ? col.ref[0] : col.ref;
        if (typeof refName === 'string') {
          expandedNames.add(refName);
        }
      }
    });

    return expandedNames;
  },

  /**
   * Filters out columns that are already expanded to avoid "Duplicate definition" errors.
   * @param columnsToAdd - An array of column names to add.
   * @param existingColumns - The existing columns array from the SELECT query.
   * @returns The filtered array of columns that are not already expanded.
   */
  filterExpandedColumns(columnsToAdd: string[], existingColumns: any[] | undefined): string[] {
    const expandedNames = columnUtils.getExpandedAssociationNames(existingColumns);

    if (expandedNames.size === 0) {
      return columnsToAdd;
    }

    return columnsToAdd.filter((col) => !expandedNames.has(col as string));
  },

  /**
   * Removes the expand operator ('*') from the column expressions array.
   * @param columns - An array of column expressions.
   */
  removeExpandOperator(columns: any[] | undefined) {
    columns?.some((item, index) => {
      const column = item;
      if (column === constants.COMMON.ALL_FIELDS) {
        columns?.splice(index, 1);

        return true; // STOP '*' found
      }

      return false;
    });
  },

  /**
   * Removes simple column references that match the given association names.
   * This prevents "Duplicate definition" errors when a column is both a simple
   * reference and an expanded association.
   * @param columns - An array of column expressions.
   * @param associationNames - An array of association names to remove as simple refs.
   */
  removeSimpleColumnRefs(columns: any[] | undefined, associationNames: string[]) {
    if (!columns || associationNames.length === 0) {
      return;
    }

    const namesToRemove = new Set(associationNames);

    // Iterate backwards to safely remove items
    for (let i = columns.length - 1; i >= 0; i--) {
      const col = columns[i];

      // Simple column refs are either strings or objects with { ref: ['columnName'] } but without 'expand'
      if (typeof col === 'string' && namesToRemove.has(col)) {
        columns.splice(i, 1);
      } else if (
        col &&
        typeof col === 'object' &&
        'ref' in col &&
        !('expand' in col) &&
        Array.isArray(col.ref) &&
        col.ref.length === 1 &&
        namesToRemove.has(col.ref[0])
      ) {
        columns.splice(i, 1);
      }
    }
  },

  /**
   * Builds aggregate columns for SQL based on the provided column formatters.
   * @param columns - An array of column formatters.
   * @returns An array of SQL aggregate column strings.
   */
  buildAggregateColumns<T, ColumnKeys extends ColumnFormatter<T>>(...columns: ColumnKeys) {
    return columns.map((item) => {
      const twoColumns = 'column1' in item && 'column2' in item;
      if (twoColumns) {
        const column1 = item.column1 as string;
        const column2 = item.column2 as string;

        return `${item.aggregate}(${column1}, ' ',${column2}) as ${item.renameAs}`;
      }

      const oneColumn = 'aggregate' in item && 'column' in item;
      if (oneColumn) {
        const column = item.column as string;

        return `${item.aggregate}(${column}) as ${item.renameAs}`;
      }

      // Just rename the column
      return `${item.column as string} as ${item.renameAs}`;
    });
  },
};
