import { columnUtils } from '../../../lib/util/find/helper/columnUtils';

// Pure-function tests: no test server / DB needed. These exercise columnUtils' internal helpers
// directly - some of the shapes constructed below (e.g. a plain string column ref) are not
// currently producible through the public builder API because cds.ql normalizes every string
// passed to `.columns(...)` into a `{ ref: [...] }` object (verified empirically), but the helper
// still defends against them, so they are covered here as direct unit tests instead.

describe('columnUtils', () => {
  describe('.getExpandedAssociationNames()', () => {
    it('should ignore a { ref, expand } column whose resolved ref is not a string', () => {
      // Array.isArray(col.ref) ? col.ref[0] : col.ref - covers both the non-array `ref` shape and
      // the resulting non-string `refName` in a single case.
      const result = columnUtils.getExpandedAssociationNames([{ ref: 123, expand: ['*'] }]);

      expect(result.size).toBe(0);
    });
  });

  describe('.filterExpandedColumns()', () => {
    it('should return the columns unchanged when none of the existing columns are already expanded', () => {
      const result = columnUtils.filterExpandedColumns(['ID', 'reviews'], ['*']);

      expect(result).toEqual(['ID', 'reviews']);
    });

    it('should drop columns that are already expanded', () => {
      const existingColumns = [{ ref: ['reviews'], expand: ['*'] }];

      const result = columnUtils.filterExpandedColumns(['ID', 'reviews'], existingColumns);

      expect(result).toEqual(['ID']);
    });
  });

  describe('.removeExpandOperator()', () => {
    it('should scan past non-star columns while searching for the expand-all operator', () => {
      const columns: unknown[] = [{ ref: ['ID'] }, '*', { ref: ['reviews'] }];

      columnUtils.removeExpandOperator(columns);

      expect(columns).toEqual([{ ref: ['ID'] }, { ref: ['reviews'] }]);
    });

    it('should do nothing when there is no expand-all operator present', () => {
      const columns: unknown[] = [{ ref: ['ID'] }, { ref: ['reviews'] }];

      columnUtils.removeExpandOperator(columns);

      expect(columns).toEqual([{ ref: ['ID'] }, { ref: ['reviews'] }]);
    });
  });

  describe('.removeSimpleColumnRefs()', () => {
    it('should do nothing when columns is undefined', () => {
      expect(() => columnUtils.removeSimpleColumnRefs(undefined, ['reviews'])).not.toThrow();
    });

    it('should do nothing when there are no association names to remove', () => {
      const columns: unknown[] = [{ ref: ['ID'] }];

      columnUtils.removeSimpleColumnRefs(columns, []);

      expect(columns).toEqual([{ ref: ['ID'] }]);
    });

    it('should remove a plain string column ref matching an association name being expanded', () => {
      const columns: unknown[] = ['reviews', { ref: ['ID'] }];

      columnUtils.removeSimpleColumnRefs(columns, ['reviews']);

      expect(columns).toEqual([{ ref: ['ID'] }]);
    });

    it('should remove a { ref: [...] } column matching an association name being expanded', () => {
      const columns: unknown[] = [{ ref: ['ID'] }, { ref: ['reviews'] }];

      columnUtils.removeSimpleColumnRefs(columns, ['reviews']);

      expect(columns).toEqual([{ ref: ['ID'] }]);
    });

    it('should not remove an already-expanded { ref, expand } column', () => {
      const columns: unknown[] = [{ ref: ['reviews'], expand: ['*'] }];

      columnUtils.removeSimpleColumnRefs(columns, ['reviews']);

      expect(columns).toEqual([{ ref: ['reviews'], expand: ['*'] }]);
    });
  });

  describe('.buildAggregateColumns()', () => {
    it('should just rename the column when no aggregate function is specified', () => {
      const result = columnUtils.buildAggregateColumns({ column: 'stock', renameAs: 'stockRenamed' } as never);

      expect(result).toEqual(['stock as stockRenamed']);
    });

    it('should build a single-column aggregate expression', () => {
      const result = columnUtils.buildAggregateColumns({
        column: 'price',
        aggregate: 'AVG',
        renameAs: 'avgPrice',
      } as never);

      expect(result).toEqual(['AVG(price) as avgPrice']);
    });

    it('should build a two-column aggregate expression', () => {
      const result = columnUtils.buildAggregateColumns({
        column1: 'title',
        column2: 'descr',
        aggregate: 'CONCAT',
        renameAs: 'combined',
      } as never);

      expect(result).toEqual(["CONCAT(title, ' ',descr) as combined"]);
    });
  });
});
