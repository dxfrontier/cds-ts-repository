import type { Author, Book } from '#cds-models/CatalogService';
import type { Review } from '#cds-models/sap/capire/bookshop';

import { Filter } from '../../lib';

/**
 * Compile-only assertions on the `Filter` type contract : path expressions and EXISTS / NOT EXISTS.
 * Nothing is executed here, the lane is `npm run check:types`.
 */

// ********************************************************************************************
// Value operators - these must compile
// ********************************************************************************************

new Filter<Book>({ field: 'ID', operator: 'EQUALS', value: 201 });
new Filter<Book>({ field: 'descr', operator: 'LIKE', value: 'Wuthering' });
new Filter<Book>({ field: 'stock', operator: 'BETWEEN', value1: 1, value2: 500 });
new Filter<Book>({ field: 'currency_code', operator: 'IN', value: ['GBP', 'USD'] });
new Filter<Book>({ field: 'descr', operator: 'IS NULL' });

// ********************************************************************************************
// Path expressions - these must compile
// ********************************************************************************************

new Filter<Book>({ field: 'author.name', operator: 'EQUALS', value: 'Edgar Allen Poe' });
new Filter<Book>({ field: 'author.ID', operator: 'EQUALS', value: 150 });
new Filter<Book>({ field: 'author.placeOfBirth', operator: 'LIKE', value: 'Boston' });
new Filter<Book>({ field: 'currency.symbol', operator: 'EQUALS', value: '$' });
new Filter<Book>({ field: 'genre.name', operator: 'IN', value: ['Drama', 'Poetry'] });

// ********************************************************************************************
// EXISTS / NOT EXISTS - these must compile
// ********************************************************************************************

new Filter<Book>({ field: 'reviews', operator: 'EXISTS' });
new Filter<Book>({ field: 'reviews', operator: 'NOT EXISTS' });
new Filter<Book>({ field: 'author', operator: 'EXISTS' });
new Filter<Author>({ field: 'books', operator: 'NOT EXISTS' });

new Filter<Book>({
  field: 'reviews',
  operator: 'EXISTS',
  filters: new Filter<Review>({ field: 'rating', operator: 'GREATER THAN', value: 4 }),
});

new Filter<Book>({
  field: 'author',
  operator: 'NOT EXISTS',
  filters: new Filter<Author>({ field: 'name', operator: 'EQUALS', value: 'Edgar Allen Poe' }),
});

new Filter<Author>({
  field: 'books',
  operator: 'EXISTS',
  filters: new Filter<Book>({
    field: 'reviews',
    operator: 'EXISTS',
    filters: new Filter<Review>({ field: 'comment', operator: 'STARTS_WITH', value: 'Comment' }),
  }),
});

// ********************************************************************************************
// Path expressions - these must NOT compile
// ********************************************************************************************

// @ts-expect-error unknown element on the association target
new Filter<Book>({ field: 'author.nope', operator: 'EQUALS', value: 'x' });
// @ts-expect-error path across a to-many association
new Filter<Book>({ field: 'reviews.rating', operator: 'EQUALS', value: 4 });
// @ts-expect-error only one hop is supported
new Filter<Book>({ field: 'author.bookEvent.name', operator: 'EQUALS', value: 'x' });
// @ts-expect-error the leaf of a path must be a value element, not a to-many association
new Filter<Book>({ field: 'author.books', operator: 'EQUALS', value: 'x' });
// @ts-expect-error the leaf of a path must be a value element, not a to-one association
new Filter<Book>({ field: 'author.bookEvent', operator: 'EQUALS', value: 'x' });
// @ts-expect-error a 'LargeBinary' element is a stream and not an association
new Filter<Book>({ field: 'image.pipe', operator: 'EQUALS', value: 'x' });
// @ts-expect-error a key element is a value and not an association
new Filter<Book>({ field: 'ID.toFixed', operator: 'EQUALS', value: 'x' });

// ********************************************************************************************
// EXISTS / NOT EXISTS - these must NOT compile
// ********************************************************************************************

// @ts-expect-error 'EXISTS' on a 'LargeBinary' element
new Filter<Book>({ field: 'image', operator: 'EXISTS' });
// @ts-expect-error 'EXISTS' on a key element
new Filter<Book>({ field: 'ID', operator: 'EXISTS' });
// @ts-expect-error 'EXISTS' on a value element
new Filter<Book>({ field: 'stock', operator: 'NOT EXISTS' });
// @ts-expect-error 'EXISTS' does not take a value
new Filter<Book>({ field: 'reviews', operator: 'EXISTS', value: 4 });
// @ts-expect-error a value operator does not take an inner filter
new Filter<Book>({
  field: 'stock',
  operator: 'EQUALS',
  value: 4,
  filters: new Filter<Review>({ field: 'rating', operator: 'EQUALS', value: 4 }),
});
