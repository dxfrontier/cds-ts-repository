// This is an automatically generated file. Please do not change its contents manually!
const { createEntityProxy } = require('./../_');
// service
const CatalogService = { name: 'CatalogService' };
module.exports = CatalogService;
module.exports.CatalogService = CatalogService;
// BookEvents
module.exports.BookEvent = createEntityProxy(['CatalogService', 'BookEvents'], {
  target: { is_singular: true },
  customProps: ['types'],
});
module.exports.BookEvents = createEntityProxy(['CatalogService', 'BookEvents'], { target: { is_singular: false } });
// Authors
module.exports.Author = createEntityProxy(['CatalogService', 'Authors'], { target: { is_singular: true } });
module.exports.Authors = createEntityProxy(['CatalogService', 'Authors'], { target: { is_singular: false } });
// Books
module.exports.Book = createEntityProxy(['CatalogService', 'Books'], { target: { is_singular: true } });
module.exports.Books = createEntityProxy(['CatalogService', 'Books'], { target: { is_singular: false } });
// Currencies
module.exports.Currency = createEntityProxy(['CatalogService', 'Currencies'], { target: { is_singular: true } });
module.exports.Currencies = createEntityProxy(['CatalogService', 'Currencies'], { target: { is_singular: false } });
// Genres
module.exports.Genre = createEntityProxy(['CatalogService', 'Genres'], { target: { is_singular: true } });
module.exports.Genres = createEntityProxy(['CatalogService', 'Genres'], { target: { is_singular: false } });
// Books.texts
module.exports.Books.text = createEntityProxy(['CatalogService', 'Books.texts'], { target: { is_singular: true } });
module.exports.Books.texts = createEntityProxy(['CatalogService', 'Books.texts'], { target: { is_singular: false } });
// Currencies.texts
module.exports.Currencies.text = createEntityProxy(['CatalogService', 'Currencies.texts'], {
  target: { is_singular: true },
});
module.exports.Currencies.texts = createEntityProxy(['CatalogService', 'Currencies.texts'], {
  target: { is_singular: false },
});
// Genres.texts
module.exports.Genres.text = createEntityProxy(['CatalogService', 'Genres.texts'], { target: { is_singular: true } });
module.exports.Genres.texts = createEntityProxy(['CatalogService', 'Genres.texts'], { target: { is_singular: false } });
// events
// actions
// enums
module.exports.BookEvent.types ??= {
  BOOK_SIGNING: 'BOOK_SIGNING',
  AUTHOR_TALK: 'AUTHOR_TALK',
  BOOK_LUNCH: 'BOOK_LUNCH',
};
