import { Author, Book } from '#cds-models/CatalogService';
import { Review } from '#cds-models/sap/capire/bookshop';

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

  describe('.buildSingleFilter() - string values are always literals', () => {
    it('doubles an embedded single quote inside the quoted literal (EQUALS)', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: "O'Reilly' x" });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("title = 'O''Reilly'' x'");
    });

    it('keeps a legit apostrophe value doubled the same way (LIKE family)', () => {
      // The 'LIKE' overload wraps the raw value in '%' itself (see Filter's constructor).
      const filter = new Filter<Book>({ field: 'title', operator: 'LIKE', value: "O'Reilly" });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("title LIKE '%O''Reilly%'");
    });

    it('escapes each quoted IN item independently', () => {
      const filter = new Filter<Book>({
        field: 'title',
        operator: 'IN',
        value: ["Jane Eyre's Copy", 'Catweazle'],
      });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("title IN ('Jane Eyre''s Copy','Catweazle')");
    });

    it('renders a string BETWEEN bound as a quoted, escaped literal', () => {
      const filter = new Filter<Book>({
        field: 'title',
        operator: 'BETWEEN',
        value1: "A's Edition",
        value2: 'Z',
      });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("(title BETWEEN 'A''s Edition' AND 'Z')");
    });

    it('emits a finite number BETWEEN bound unquoted', () => {
      const filter = new Filter<Book>({ field: 'stock', operator: 'BETWEEN', value1: 11, value2: 333 });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe('(stock BETWEEN 11 AND 333)');
    });
  });

  describe('.buildSingleFilter() - field path validation', () => {
    it('throws when the field is not a valid CDS element path', () => {
      const filter = new Filter<Book>({
        field: 'title name' as unknown as 'title',
        operator: 'EQUALS',
        value: 'x',
      });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(/valid CDS element path/);
    });

    it('accepts a one-hop path expression across a to-one association', () => {
      const filter = new Filter<Book>({ field: 'author.name', operator: 'EQUALS', value: 'Edgar Allen Poe' });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("author.name = 'Edgar Allen Poe'");
    });

    it('accepts a field segment containing a combining mark, like the CDS compiler does', () => {
      // U+093E (DEVANAGARI VOWEL SIGN AA) is a combining mark (Unicode category Mc): not in \p{L},
      // but accepted by the CDS compiler lexer's identifier rule (\p{ID_Continue}).
      const filter = new Filter<Book>({ field: 'नाम' as unknown as 'title', operator: 'EQUALS', value: 'x' });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("नाम = 'x'");
    });
  });

  describe('.buildSingleFilter() - non-primitive values are rejected', () => {
    it('throws when the value is a plain object', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: { x: 1 } as unknown as string });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(
        /must be a string, a finite number, a bigint or null/,
      );
    });

    it('throws when the value is NaN', () => {
      const filter = new Filter<Book>({ field: 'stock', operator: 'EQUALS', value: NaN });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(
        /must be a string, a finite number, a bigint or null/,
      );
    });

    it('throws when the value is a function', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: (() => 1) as unknown as string });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(
        /must be a string, a finite number, a bigint or null/,
      );
    });

    it('throws when the value is a symbol', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: Symbol('x') as unknown as string });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(
        /must be a string, a finite number, a bigint or null/,
      );
    });

    it('throws when the value is Infinity', () => {
      const filter = new Filter<Book>({ field: 'stock', operator: 'EQUALS', value: Infinity });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(
        /must be a string, a finite number, a bigint or null/,
      );
    });

    it('throws when the value is undefined', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: undefined as unknown as string });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(
        /must be a string, a finite number, a bigint or null/,
      );
    });

    it('throws when an array value is used with a non-IN operator', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'EQUALS', value: ['a'] as unknown as string });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(
        /must be a string, a finite number, a bigint or null/,
      );
    });

    it('throws when a BETWEEN bound is a plain object', () => {
      const filter = new Filter<Book>({
        field: 'stock',
        operator: 'BETWEEN',
        value1: {} as unknown as number,
        value2: 333,
      });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow(
        /must be a finite number, a bigint, a boolean or a string/,
      );
    });
  });

  describe('.buildSingleFilter() - a bigint value is accepted, quoted like a number', () => {
    it('renders an EQUALS bigint value quoted', () => {
      const filter = new Filter<Book>({ field: 'ID', operator: 'EQUALS', value: 10n as unknown as string });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("ID = '10'");
    });
  });

  describe('.buildSingleFilter() - a boolean value is accepted by the LIKE family', () => {
    it('renders a LIKE boolean value wrapped in the literal', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'LIKE', value: true as unknown as string });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("title LIKE '%true%'");
    });

    it('renders a STARTS_WITH boolean value wrapped in the literal', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'STARTS_WITH', value: false as unknown as string });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("title LIKE 'false%'");
    });

    it('renders an ENDS_WITH boolean value wrapped in the literal', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'ENDS_WITH', value: true as unknown as string });

      expect(coreRepositoryUtils.buildSingleFilter(filter)).toBe("title LIKE '%true'");
    });
  });

  describe('.buildSingleFilter() - an operator outside the declared union throws', () => {
    it('throws via mapOperator for an operator that is not part of FilterOperator', () => {
      const filter = new Filter<Book>({ field: 'title', operator: 'FOO' as unknown as 'EQUALS', value: 'x' });

      expect(() => coreRepositoryUtils.buildSingleFilter(filter)).toThrow('No operator found');
    });
  });
});
