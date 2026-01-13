// This is an automatically generated file. Please do not change its contents manually!
const { createEntityProxy } = require('./../../../_');
// Books
module.exports.Book = createEntityProxy(['sap.capire.bookshop', 'Books'], { target: { is_singular: true } });
module.exports.Books = createEntityProxy(['sap.capire.bookshop', 'Books'], { target: { is_singular: false } });
// BookStats
module.exports.BookStat = createEntityProxy(['sap.capire.bookshop', 'BookStats'], { target: { is_singular: true } });
module.exports.BookStats = createEntityProxy(['sap.capire.bookshop', 'BookStats'], { target: { is_singular: false } });
// Authors
module.exports.Author = createEntityProxy(['sap.capire.bookshop', 'Authors'], { target: { is_singular: true } });
module.exports.Authors = createEntityProxy(['sap.capire.bookshop', 'Authors'], { target: { is_singular: false } });
// Genres
module.exports.Genre = createEntityProxy(['sap.capire.bookshop', 'Genres'], { target: { is_singular: true } });
module.exports.Genres = createEntityProxy(['sap.capire.bookshop', 'Genres'], { target: { is_singular: false } });
// Reviews
module.exports.Review = createEntityProxy(['sap.capire.bookshop', 'Reviews'], { target: { is_singular: true } });
module.exports.Reviews = createEntityProxy(['sap.capire.bookshop', 'Reviews'], { target: { is_singular: false } });
// BookEvents
module.exports.BookEvent = createEntityProxy(['sap.capire.bookshop', 'BookEvents'], {
  target: { is_singular: true },
  customProps: ['types'],
});
module.exports.BookEvents = createEntityProxy(['sap.capire.bookshop', 'BookEvents'], {
  target: { is_singular: false },
});
// Users
module.exports.User = createEntityProxy(['sap.capire.bookshop', 'Users'], { target: { is_singular: true } });
module.exports.Users = createEntityProxy(['sap.capire.bookshop', 'Users'], { target: { is_singular: false } });
// UserActivityLog
module.exports.UserActivityLog = createEntityProxy(['sap.capire.bookshop', 'UserActivityLog'], {
  target: { is_singular: true },
});
module.exports.UserActivityLog_ = createEntityProxy(['sap.capire.bookshop', 'UserActivityLog'], {
  target: { is_singular: false },
});
// Promotions
module.exports.Promotion = createEntityProxy(['sap.capire.bookshop', 'Promotions'], { target: { is_singular: true } });
module.exports.Promotions = createEntityProxy(['sap.capire.bookshop', 'Promotions'], {
  target: { is_singular: false },
});
// Books.texts
module.exports.Books.text = createEntityProxy(['sap.capire.bookshop', 'Books.texts'], {
  target: { is_singular: true },
});
module.exports.Books.texts = createEntityProxy(['sap.capire.bookshop', 'Books.texts'], {
  target: { is_singular: false },
});
// Genres.texts
module.exports.Genres.text = createEntityProxy(['sap.capire.bookshop', 'Genres.texts'], {
  target: { is_singular: true },
});
module.exports.Genres.texts = createEntityProxy(['sap.capire.bookshop', 'Genres.texts'], {
  target: { is_singular: false },
});
// events
// actions
// enums
module.exports.BookEvent.types ??= {
  BOOK_SIGNING: 'BOOK_SIGNING',
  AUTHOR_TALK: 'AUTHOR_TALK',
  BOOK_LUNCH: 'BOOK_LUNCH',
};
