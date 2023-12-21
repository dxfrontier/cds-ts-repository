// This is an automatically generated file. Please do not change its contents manually!
const cds = require('@sap/cds');
const csn = cds.entities('CatalogService');
module.exports = { name: 'CatalogService' };
module.exports.BookEvent = csn.BookEvents;
module.exports.BookEvents = csn.BookEvents;
module.exports.Author = csn.Authors;
module.exports.Authors = csn.Authors;
module.exports.Book = csn.Books;
module.exports.Books = csn.Books;
module.exports.Currency = csn.Currencies;
module.exports.Currencies = csn.Currencies;
module.exports.Genre = csn.Genres;
module.exports.Genres = csn.Genres;
// events
// actions
// enums
module.exports.BookEvent.types = Object.fromEntries(
  Object.entries(cds.model.definitions['CatalogService.BookEvents'].elements.types.enum).map(([k, v]) => [
    k,
    v.val ?? k,
  ]),
);
