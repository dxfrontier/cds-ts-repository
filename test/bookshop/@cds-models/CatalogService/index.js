// This is an automatically generated file. Please do not change its contents manually!
const cds = require('@sap/cds');
const csn = cds.entities('CatalogService');
// service
const CatalogService = { name: 'CatalogService' };
module.exports = CatalogService;
module.exports.CatalogService = CatalogService;
// BookEvents
module.exports.BookEvent = { is_singular: true, __proto__: csn.BookEvents };
module.exports.BookEvents = csn.BookEvents;
// Authors
module.exports.Author = { is_singular: true, __proto__: csn.Authors };
module.exports.Authors = csn.Authors;
// Books
module.exports.Book = { is_singular: true, __proto__: csn.Books };
module.exports.Books = csn.Books;
// Currencies
module.exports.Currency = { is_singular: true, __proto__: csn.Currencies };
module.exports.Currencies = csn.Currencies;
// Genres
module.exports.Genre = { is_singular: true, __proto__: csn.Genres };
module.exports.Genres = csn.Genres;
// events
// actions
// enums
module.exports.BookEvent.types ??= {
  BOOK_SIGNING: 'BOOK_SIGNING',
  AUTHOR_TALK: 'AUTHOR_TALK',
  BOOK_LUNCH: 'BOOK_LUNCH',
};
