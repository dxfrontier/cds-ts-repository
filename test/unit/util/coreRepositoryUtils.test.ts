import { Book } from '#cds-models/CatalogService';

import coreRepositoryUtils from '../../../lib/util/coreRepository/coreRepositoryUtils';
import { Filter } from '../../../lib/util/filter/Filter';

// Pure-function tests: no test server / DB needed.

describe('coreRepositoryUtils', () => {
  describe('.isAllSuccess()', () => {
    it('should return false for an empty array', () => {
      expect(coreRepositoryUtils.isAllSuccess([])).toBe(false);
    });

    it('should return true when every item is an empty string', () => {
      expect(coreRepositoryUtils.isAllSuccess(['', ''])).toBe(true);
    });

    it('should return true when every item is 1', () => {
      expect(coreRepositoryUtils.isAllSuccess([1, 1])).toBe(true);
    });

    it('should return false when the items are neither strings nor numbers (unexpected external-service response shape)', () => {
      expect(coreRepositoryUtils.isAllSuccess([true as unknown as number])).toBe(false);
    });
  });

  describe('.resolveAffected()', () => {
    it('should return the number as-is when the result is already a number', () => {
      expect(coreRepositoryUtils.resolveAffected(4)).toBe(4);
      expect(coreRepositoryUtils.resolveAffected(0)).toBe(0);
    });

    it('should return "affected" when the result is a consolidated { affected, rows } object', () => {
      expect(coreRepositoryUtils.resolveAffected({ affected: 3, rows: [] })).toBe(3);
    });

    it('should return 0 when "affected" is present but not a number', () => {
      expect(coreRepositoryUtils.resolveAffected({ affected: '3' })).toBe(0);
    });

    it('should return 0 when the result is neither a number nor an object with "affected"', () => {
      expect(coreRepositoryUtils.resolveAffected(null)).toBe(0);
      expect(coreRepositoryUtils.resolveAffected(undefined)).toBe(0);
      expect(coreRepositoryUtils.resolveAffected('3')).toBe(0);
      expect(coreRepositoryUtils.resolveAffected({})).toBe(0);
    });
  });

  describe('.resolveCount()', () => {
    it('should return 0 when the result is null or undefined', () => {
      expect(coreRepositoryUtils.resolveCount(null)).toBe(0);
      expect(coreRepositoryUtils.resolveCount(undefined)).toBe(0);
    });

    it('should coerce a numeric "total" to a number', () => {
      expect(coreRepositoryUtils.resolveCount({ total: 5 })).toBe(5);
    });

    it('should coerce a string "total" (e.g. from non-sqlite databases) to a number', () => {
      expect(coreRepositoryUtils.resolveCount({ total: '7' })).toBe(7);
    });

    it('should return 0 when "total" cannot be coerced to a number', () => {
      expect(coreRepositoryUtils.resolveCount({ total: 'not-a-number' })).toBe(0);
      expect(coreRepositoryUtils.resolveCount({})).toBe(0);
    });
  });

  describe('.buildMultidimensionalFilters()', () => {
    it('recurses into a raw (non-Filter-wrapped) nested array element and parenthesizes the group', () => {
      // CompoundFilter<T> allows raw nested arrays directly:
      // type CompoundFilter<T> = (Filter<T> | LogicalOperator | CompoundFilter<T>)[];
      const filterA = new Filter<Book>({ field: 'currency_code', operator: 'EQUALS', value: 'GBP' });
      const filterB = new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 });
      const filterC = new Filter<Book>({ field: 'ID', operator: 'EQUALS', value: 201 });

      const raw = new Filter<Book>([[filterA, 'AND', filterB], 'OR', filterC]);

      const sql = coreRepositoryUtils.buildMultidimensionalFilters(raw.filters);

      expect(sql).toBe("(currency_code = 'GBP' AND stock > '0') OR ID = '201'");
    });

    it('keeps preceding conditions when a combined Filter (logical-operator overload) is an element of a compound array', () => {
      // A combined filter stores its connector on `logicalOperator` (not as array tokens),
      // so it must be rendered via buildMultipleFilters without discarding the accumulator.
      const filterA = new Filter<Book>({ field: 'currency_code', operator: 'EQUALS', value: 'GBP' });
      const filterB = new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 });
      const combinedAB = new Filter<Book>('AND', filterA, filterB);
      const filterC = new Filter<Book>({ field: 'ID', operator: 'EQUALS', value: 201 });

      const compound = new Filter<Book>([filterC, 'OR', combinedAB]);

      const sql = coreRepositoryUtils.buildMultidimensionalFilters(compound.filters);

      expect(sql).toBe("ID = '201' OR (currency_code = 'GBP' AND stock > '0')");
    });

    it('ignores an unrecognized element shape (defensive fall-through)', () => {
      const filterA = new Filter<Book>({ field: 'currency_code', operator: 'EQUALS', value: 'GBP' });

      const sql = coreRepositoryUtils.buildMultidimensionalFilters([filterA, 42 as unknown as Filter<Book>]);

      expect(sql).toBe("currency_code = 'GBP'");
    });
  });

  describe('.buildMultipleFilters()', () => {
    it('returns an empty string for a filter-like object with no recognizable shape (defensive branch)', () => {
      expect(coreRepositoryUtils.buildMultipleFilters({} as unknown as Filter<Book>)).toBe('');
    });

    it('falls through to the combined-filters handling when a "value" is present without a "field" (defensive branch)', () => {
      // `filterOptionsFound` only checks for a value/value1 property, not `field`; a malformed
      // filter-like object can satisfy it while still failing `isSingleFilter`.
      expect(coreRepositoryUtils.buildMultipleFilters({ value: 'x' } as unknown as Filter<Book>)).toBe('');
    });
  });

  describe('.mapOperator()', () => {
    it('should throw when constructed with an operator outside the known FilterOperator union', () => {
      // Also exercises Filter's constructor IS NULL / IS NOT NULL guard (lib/util/filter/Filter.ts):
      // since 'UNKNOWN_OPERATOR' matches none of the explicit operator checks, `this.value` is
      // never assigned and the constructor falls through to its (always-true, for valid input)
      // `operator === 'IS NULL' || operator === 'IS NOT NULL'` check with a false result.
      const filter = new Filter<Book>({
        field: 'descr',
        operator: 'UNKNOWN_OPERATOR' as unknown as 'EQUALS',
        value: 'x',
      });

      expect(filter.value).toBeUndefined();
      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow('No operator found');
    });
  });

  describe('.buildSingleFilter() - IN / NOT IN with a non-array value', () => {
    it('should fall through (and eventually throw via mapOperator) when the IN/NOT IN value is not an array', () => {
      // FilterInAndNotIn types `value` as string[] | number[], but the Filter constructor does not
      // validate this at runtime - a hand-crafted / cast value can still be a scalar.
      const filter = new Filter<Book>({
        field: 'ID',
        operator: 'IN',
        value: 'not-an-array' as unknown as number[],
      });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow('No operator found');
    });
  });
});
