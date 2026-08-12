import type { Author, Authors, Book, BookEvents, Books } from '#cds-models/CatalogService';
import type { BaseRepository, BaseRepositoryDraft } from '../../lib';

import { Filter } from '../../lib';

/**
 * Compile-only assertions on the plural `cds-typer` spelling of a `Filter` : `Filter<Books>` is the very
 * same filter as `Filter<Book>` and is accepted everywhere a `Filter` is.
 * Nothing is executed here, the lane is `npm run check:types`.
 */

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

declare const bookRepository: BaseRepository<Book>;
declare const pluralBookRepository: BaseRepository<Books>;
declare const pluralBookDraftRepository: BaseRepositoryDraft<Books>;

const pluralFilter = new Filter<Books>({ field: 'ID', operator: 'EQUALS', value: 201 });
const singularFilter = new Filter<Book>({ field: 'ID', operator: 'EQUALS', value: 201 });

// ********************************************************************************************
// A plural Filter is typed on the singular entity - these must compile
// ********************************************************************************************

new Filter<Books>({ field: 'title', operator: 'EQUALS', value: 'The Raven' });
new Filter<Books>({ field: 'stock', operator: 'BETWEEN', value1: 1, value2: 500 });
new Filter<Books>({ field: 'currency_code', operator: 'IN', value: ['GBP', 'USD'] });
new Filter<Books>({ field: 'author.name', operator: 'EQUALS', value: 'Edgar Allen Poe' });
new Filter<Authors>({ field: 'books', operator: 'EXISTS' });

// ********************************************************************************************
// A plural Filter is typed on the singular entity - these must NOT compile
// ********************************************************************************************

// @ts-expect-error unknown element on the singular entity
new Filter<Books>({ field: 'nope', operator: 'EQUALS', value: 'x' });
// @ts-expect-error the members of the generated array type are not elements of the entity
new Filter<Books>({ field: 'length', operator: 'EQUALS', value: 1 });
// @ts-expect-error path across a to-many association of the singular entity
new Filter<Books>({ field: 'reviews.rating', operator: 'EQUALS', value: 4 });

// ********************************************************************************************
// The plural and the singular spelling are interchangeable
// ********************************************************************************************

const pluralAsSingular: Filter<Book> = pluralFilter;
const singularAsPlural: Filter<Books> = singularFilter;

type _APluralFilterIsASingularFilter = Expect<Equal<typeof pluralAsSingular, Filter<Book>>>;
type _ASingularFilterIsAPluralFilter = Expect<Equal<typeof singularAsPlural, Filter<Books>>>;

// ********************************************************************************************
// .builder() takes a plural Filter and keeps typing the rows on the repository's entity
// ********************************************************************************************

const foundBooks = bookRepository.builder().find(pluralFilter);
const foundBook = bookRepository.builder().findOne(pluralFilter);

type FoundBooks = Awaited<ReturnType<typeof foundBooks.execute>>;
type FoundBook = Awaited<ReturnType<typeof foundBook.execute>>;

type _PluralFilterRowsAreBooks = Expect<Equal<FoundBooks, Book[] | undefined>>;
type _PluralFilterRowIsABook = Expect<Equal<FoundBook, Book | undefined>>;

// ********************************************************************************************
// The flat and the bulk methods take a plural Filter
// ********************************************************************************************

pluralBookRepository.find(pluralFilter);
pluralBookRepository.countWhere(pluralFilter);
pluralBookRepository.updateMany(pluralFilter, { stock: 100 });
pluralBookRepository.deleteWhere(pluralFilter);
pluralBookRepository.incrementMany(pluralFilter, { stock: 1 });
pluralBookRepository.decrementMany(pluralFilter, { stock: 1 });

// ********************************************************************************************
// The draft methods take a plural Filter, on top of the active one they already accept
// ********************************************************************************************

pluralBookDraftRepository.findDrafts(pluralFilter);
pluralBookDraftRepository.countDraftsWhere(pluralFilter);
pluralBookDraftRepository.findDrafts(singularFilter);
pluralBookDraftRepository.countDraftsWhere(singularFilter);

// ********************************************************************************************
// The plural and the singular spelling mix freely inside the combining overloads
// ********************************************************************************************

new Filter('AND', pluralFilter, singularFilter);
new Filter<Books>('OR', pluralFilter, singularFilter);
new Filter<Books>([pluralFilter, 'AND', singularFilter]);

new Filter<Authors>({
  field: 'books',
  operator: 'EXISTS',
  filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 100 }),
});

new Filter<Author>({
  field: 'books',
  operator: 'EXISTS',
  filters: new Filter<Books>({ field: 'stock', operator: 'GREATER THAN', value: 100 }),
});

// ********************************************************************************************
// A plural Filter on another entity is rejected, exactly like the singular one
// ********************************************************************************************

const pluralBookEventFilter = new Filter<BookEvents>({ field: 'name', operator: 'EQUALS', value: 'Book signing' });

// @ts-expect-error a Filter on another entity, the query still runs on Book
bookRepository.builder().find(pluralBookEventFilter);
// @ts-expect-error a Filter on another entity, the query still runs on Book
bookRepository.builder().findOne(pluralBookEventFilter);
// @ts-expect-error a Filter on another entity, the query still runs on Book
pluralBookRepository.find(pluralBookEventFilter);
