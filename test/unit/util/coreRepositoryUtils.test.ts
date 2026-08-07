import { Author, Book } from '#cds-models/CatalogService';
import { Review } from '#cds-models/sap/capire/bookshop';

import coreRepositoryUtils from '../../../lib/util/coreRepository/coreRepositoryUtils';
import { Filter } from '../../../lib/util/filter/Filter';

// Pure-function tests: no test server / DB needed.

describe('coreRepositoryUtils', () => {
  describe('.isAllSuccess()', () => {
    it('should return true for an empty array (vacuous success)', () => {
      expect(coreRepositoryUtils.isAllSuccess([])).toBe(true);
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

  describe('.resolveExternalWriteSuccess()', () => {
    it("should treat '' as a 204-style success for both expectations", () => {
      expect(coreRepositoryUtils.resolveExternalWriteSuccess('', 'one')).toBe(true);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess('', 'some')).toBe(true);
    });

    it('should treat undefined and null as a 204-style success', () => {
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(undefined, 'one')).toBe(true);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(null, 'one')).toBe(true);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(undefined, 'some')).toBe(true);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(null, 'some')).toBe(true);
    });

    it("should require exactly one affected row for 'one'", () => {
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(1, 'one')).toBe(true);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess({ affected: 1 }, 'one')).toBe(true);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(0, 'one')).toBe(false);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(2, 'one')).toBe(false);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess({ affected: 0 }, 'one')).toBe(false);
    });

    it("should require at least one affected row for 'some'", () => {
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(3, 'some')).toBe(true);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess({ affected: 3 }, 'some')).toBe(true);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(0, 'some')).toBe(false);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess({ affected: 0 }, 'some')).toBe(false);
    });

    it('should treat unrecognized shapes as a failure', () => {
      expect(coreRepositoryUtils.resolveExternalWriteSuccess('error', 'one')).toBe(false);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess('2', 'one')).toBe(false);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess({ rows: [] }, 'some')).toBe(false);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess(-1, 'one')).toBe(false);
      expect(coreRepositoryUtils.resolveExternalWriteSuccess({ affected: undefined }, 'some')).toBe(false);
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

  describe('.buildSingleFilter() - EXISTS / NOT EXISTS', () => {
    it('should build a bare "exists" predicate when no inner filter is given', () => {
      const filter = new Filter<Author>({ field: 'books', operator: 'EXISTS' });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe('exists books');
    });

    it('should build a bare "not exists" predicate when no inner filter is given', () => {
      const filter = new Filter<Author>({ field: 'books', operator: 'NOT EXISTS' });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe('not exists books');
    });

    it('should build the inner predicate of the association between square brackets', () => {
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 }),
      });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("exists books[stock > '0']");
    });

    it('should build a combined (AND / OR) inner predicate', () => {
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'NOT EXISTS',
        filters: new Filter<Book>(
          'AND',
          new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 }),
          new Filter<Book>({ field: 'currency_code', operator: 'EQUALS', value: 'GBP' }),
        ),
      });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe(
        "not exists books[(stock > '0' AND currency_code = 'GBP')]",
      );
    });

    it('should build a nested "exists" as the inner predicate of another "exists"', () => {
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({
          field: 'reviews',
          operator: 'EXISTS',
          filters: new Filter<Review>({ field: 'rating', operator: 'GREATER THAN', value: 4 }),
        }),
      });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("exists books[exists reviews[rating > '4']]");
    });
  });

  describe('.buildQueryKeys() - routing of EXISTS / NOT EXISTS filters', () => {
    it('should route an EXISTS filter carrying an inner filter to the single-filter branch', () => {
      // Regression: `filters` is also the property used to detect combined / compound filters,
      // an EXISTS filter must not be routed to buildMultipleFilters / buildMultidimensionalFilters.
      const filter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 }),
      });

      expect(coreRepositoryUtils.buildQueryKeys(filter)).toBe("exists books[stock > '0']");
    });

    it('should keep an EXISTS filter combined with the logical-operator overload', () => {
      // Regression: an EXISTS filter has no value, so buildMultipleFilters would treat it as a
      // combined filter and silently drop the `exists` predicate.
      const filter = new Filter<Author>(
        'AND',
        new Filter<Author>({
          field: 'books',
          operator: 'EXISTS',
          filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 }),
        }),
        new Filter<Author>({ field: 'name', operator: 'EQUALS', value: 'Edgar Allen Poe' }),
      );

      expect(coreRepositoryUtils.buildQueryKeys(filter)).toBe(
        "(exists books[stock > '0'] AND name = 'Edgar Allen Poe')",
      );
    });

    it('should keep an EXISTS filter used as an element of a multidimensional filter', () => {
      const existsFilter = new Filter<Author>({
        field: 'books',
        operator: 'EXISTS',
        filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 }),
      });
      const bareExistsFilter = new Filter<Author>({ field: 'bookEvent', operator: 'NOT EXISTS' });
      const nameFilter = new Filter<Author>({ field: 'name', operator: 'EQUALS', value: 'Edgar Allen Poe' });

      const filter = new Filter<Author>([[existsFilter, 'AND', nameFilter], 'OR', bareExistsFilter]);

      expect(coreRepositoryUtils.buildQueryKeys(filter)).toBe(
        "(exists books[stock > '0'] AND name = 'Edgar Allen Poe') OR not exists bookEvent",
      );
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
