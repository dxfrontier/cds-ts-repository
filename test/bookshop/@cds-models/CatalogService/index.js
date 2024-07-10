// This is an automatically generated file. Please do not change its contents manually!
const cds = require('@sap/cds')
const csn = cds.entities('CatalogService')
module.exports = { name: 'CatalogService' }
module.exports.BookEvent = { is_singular: true, __proto__: csn.BookEvents }
module.exports.BookEvents = csn.BookEvents
module.exports.Author = { is_singular: true, __proto__: csn.Authors }
module.exports.Authors = csn.Authors
module.exports.Book = { is_singular: true, __proto__: csn.Books }
module.exports.Books = csn.Books
module.exports.Currency = { is_singular: true, __proto__: csn.Currencies }
module.exports.Currencies = csn.Currencies
module.exports.Genre = { is_singular: true, __proto__: csn.Genres }
module.exports.Genres = csn.Genres
// events
// actions
// enums
module.exports.BookEvent.types ??= { BOOK_SIGNING: "BOOK_SIGNING", AUTHOR_TALK: "AUTHOR_TALK", BOOK_LUNCH: "BOOK_LUNCH" }
