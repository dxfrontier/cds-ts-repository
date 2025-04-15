import type { ColumnFormatter } from '../../../types/types';
import { constants } from '../../../constants/constants';

export const columnUtils = {
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

    /*
        Workaround using reverse
        When .getExpand(['reviews']) is firstly called before .columns(['currency_code','reviews']) somehow this causes duplicates and gives an error.
        If this is being reversed, this works as expected
      */
    columns?.reverse();
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
