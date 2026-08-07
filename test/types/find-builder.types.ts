import type { Author, Book, BookEvent } from '#cds-models/CatalogService';
import type { AppendColumns, BaseRepository, DynamicColumnTypes } from '../../lib';

import { Filter } from '../../lib';

/**
 * Compile-only assertions on the `.builder()` type contract : the entity a `Filter` may be typed on and
 * the type every `.columnsFormatter()` column resolves to.
 * Nothing is executed here, the lane is `npm run check:types`.
 */

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

declare const bookRepository: BaseRepository<Book>;

const bookFilter = new Filter<Book>({ field: 'currency_code', operator: 'LIKE', value: 'GBP' });
const authorFilter = new Filter<Author>({ field: 'name', operator: 'EQUALS', value: 'Edgar Allen Poe' });
const bookEventFilter = new Filter<BookEvent>({ field: 'name', operator: 'EQUALS', value: 'Book signing' });

// ********************************************************************************************
// .find() / .findOne() with a Filter on the repository's own entity - these must compile
// ********************************************************************************************

const foundBooks = bookRepository.builder().find(bookFilter);
const foundBook = bookRepository.builder().findOne(bookFilter);

type FoundBooks = Awaited<ReturnType<typeof foundBooks.execute>>;
type FoundBook = Awaited<ReturnType<typeof foundBook.execute>>;

// the rows keep the entity the repository is built on
type _FindRowsAreBooks = Expect<Equal<FoundBooks, Book[] | undefined>>;
type _FindOneRowIsABook = Expect<Equal<FoundBook, Book | undefined>>;

// ********************************************************************************************
// .find() / .findOne() with a Filter on another entity - these must NOT compile
// ********************************************************************************************

// @ts-expect-error a Filter on another entity, the query still runs on Book
bookRepository.builder().find(bookEventFilter);
// @ts-expect-error a Filter on another entity, the query still runs on Book
bookRepository.builder().findOne(bookEventFilter);

// ********************************************************************************************
// .find() / .findOne() never re-type the rows out of the Filter
// ********************************************************************************************

// Two `cds-typer` entities whose elements are all optional and non conflicting (E.g. `Author` and
// `Book`) stay mutually assignable, so such a Filter is not rejected - the rows however keep the
// entity the repository is built on and are NOT re-typed as the Filter's entity.
const rowsOfACrossEntityFilter = bookRepository.builder().find(authorFilter);
const rowOfACrossEntityFilter = bookRepository.builder().findOne(authorFilter);

type CrossEntityRows = Awaited<ReturnType<typeof rowsOfACrossEntityFilter.execute>>;
type CrossEntityRow = Awaited<ReturnType<typeof rowOfACrossEntityFilter.execute>>;

type _CrossEntityRowsStayBooks = Expect<Equal<CrossEntityRows, Book[] | undefined>>;
type _CrossEntityRowStaysABook = Expect<Equal<CrossEntityRow, Book | undefined>>;

// ********************************************************************************************
// .columnsFormatter() - every formatted column is typed out of its aggregate function
// ********************************************************************************************

type LengthColumn = DynamicColumnTypes<[{ column: 'title'; aggregate: 'LENGTH'; renameAs: 'titleLength' }], Book>;

// 'LENGTH' counts the characters, the database returns a number for it
type _LengthIsANumber = Expect<Equal<LengthColumn, { titleLength: number }>>;
type _LengthIsNotAString = Expect<Equal<LengthColumn['titleLength'] extends string ? true : false, false>>;

type UpperColumn = DynamicColumnTypes<[{ column: 'title'; aggregate: 'UPPER'; renameAs: 'titleUpper' }], Book>;

type _UpperIsAString = Expect<Equal<UpperColumn, { titleUpper: string }>>;

// a plain rename keeps the original column type
type RenamedColumn = DynamicColumnTypes<[{ column: 'stock'; renameAs: 'stockRenamed' }], Book>;

type _PlainRenameKeepsTheColumnType = Expect<Equal<RenamedColumn, { stockRenamed: Book['stock'] }>>;
type _PlainRenameOfANumericColumnIsNotAString = Expect<
  Equal<RenamedColumn['stockRenamed'] extends string ? true : false, false>
>;

// ********************************************************************************************
// .columnsFormatter() - the same, as seen through the builder's own return type
// ********************************************************************************************

type BookWithFormattedColumns = AppendColumns<
  Book,
  [
    { column: 'title'; aggregate: 'LENGTH'; renameAs: 'titleLength' },
    { column: 'title'; aggregate: 'UPPER'; renameAs: 'titleUpper' },
    { column: 'stock'; renameAs: 'stockRenamed' },
    { column: 'price'; aggregate: 'AVG'; renameAs: 'averagePrice' },
    { column: 'createdAt'; aggregate: 'YEAR'; renameAs: 'createdYear' },
    { column1: 'title'; column2: 'descr'; aggregate: 'CONCAT'; renameAs: 'summary' },
  ]
>;

type _AppendedLengthIsANumber = Expect<Equal<BookWithFormattedColumns['titleLength'], number | undefined>>;
type _AppendedUpperIsAString = Expect<Equal<BookWithFormattedColumns['titleUpper'], string | undefined>>;
type _AppendedRenameKeepsTheColumnType = Expect<Equal<BookWithFormattedColumns['stockRenamed'], Book['stock']>>;
type _AppendedAverageIsANumber = Expect<Equal<BookWithFormattedColumns['averagePrice'], number | undefined>>;
type _AppendedYearIsANumber = Expect<Equal<BookWithFormattedColumns['createdYear'], number | undefined>>;
type _AppendedConcatIsAString = Expect<Equal<BookWithFormattedColumns['summary'], string | undefined>>;
