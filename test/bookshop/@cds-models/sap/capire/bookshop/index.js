// This is an automatically generated file. Please do not change its contents manually!
const cds = require('@sap/cds')
const csn = cds.entities('sap.capire.bookshop')
module.exports.Book = { is_singular: true, __proto__: csn.Books }
module.exports.Books = csn.Books
module.exports.BookStat = { is_singular: true, __proto__: csn.BookStats }
module.exports.BookStats = csn.BookStats
module.exports.Author = { is_singular: true, __proto__: csn.Authors }
module.exports.Authors = csn.Authors
module.exports.Genre = { is_singular: true, __proto__: csn.Genres }
module.exports.Genres = csn.Genres
module.exports.Review = { is_singular: true, __proto__: csn.Reviews }
module.exports.Reviews = csn.Reviews
module.exports.BookEvent = { is_singular: true, __proto__: csn.BookEvents }
module.exports.BookEvents = csn.BookEvents
module.exports.User = { is_singular: true, __proto__: csn.Users }
module.exports.Users = csn.Users
module.exports.UserActivityLog = { is_singular: true, __proto__: csn.UserActivityLog }
module.exports.UserActivityLog_ = csn.UserActivityLog
module.exports.Promotion = { is_singular: true, __proto__: csn.Promotions }
module.exports.Promotions = csn.Promotions
// events
// actions
// enums
module.exports.BookEvent.types ??= { BOOK_SIGNING: "BOOK_SIGNING", AUTHOR_TALK: "AUTHOR_TALK", BOOK_LUNCH: "BOOK_LUNCH" }
