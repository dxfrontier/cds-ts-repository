// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './../../..';
import * as __ from './../../../_';
import * as _sap_common from './../../common';
// enum
const BookEvent_types = {
  BOOK_SIGNING: "BOOK_SIGNING",
  AUTHOR_TALK: "AUTHOR_TALK",
  BOOK_LUNCH: "BOOK_LUNCH",
} as const;
type BookEvent_types = "BOOK_SIGNING" | "AUTHOR_TALK" | "BOOK_LUNCH"

export function _BookAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(Base) {
        ID?: number;
        title?: string | null;
        descr?: string | null;
        stock?: number | null;
        price?: number | null;
    /**
    * Type for an association to Currencies
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-currency
    */
        currency?: _.Currency | null;
        currency_code?: string | null;
        image?: Buffer | string | {value: import("stream").Readable, $mediaContentType: string, $mediaContentDispositionFilename?: string, $mediaContentDispositionType?: string} | null;
        author?: __.Association.to<Author> | null;
        author_ID?: number | null;
        genre?: __.Association.to<Genre> | null;
        genre_ID?: number | null;
        reviews?: __.Association.to.many<Reviews>;
        stats?: __.Association.to<BookStat> | null;
      static readonly actions: Record<never, never>
  };
}
export class Book extends _BookAspect(__.Entity) {}
Object.defineProperty(Book, 'name', { value: 'sap.capire.bookshop.Books' })
Object.defineProperty(Book, 'is_singular', { value: true })
export class Books extends Array<Book> {$count?: number}
Object.defineProperty(Books, 'name', { value: 'sap.capire.bookshop.Books' })

export function _BookStatAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(Base) {
        ID?: number;
        views?: number | null;
        averageRating?: number | null;
        book?: __.Association.to<Book> | null;
        book_ID?: number | null;
      static readonly actions: Record<never, never>
  };
}
export class BookStat extends _BookStatAspect(__.Entity) {}
Object.defineProperty(BookStat, 'name', { value: 'sap.capire.bookshop.BookStats' })
Object.defineProperty(BookStat, 'is_singular', { value: true })
export class BookStats extends Array<BookStat> {$count?: number}
Object.defineProperty(BookStats, 'name', { value: 'sap.capire.bookshop.BookStats' })

export function _AuthorAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(Base) {
        ID?: number;
        name?: string | null;
        dateOfBirth?: __.CdsDate | null;
        dateOfDeath?: __.CdsDate | null;
        placeOfBirth?: string | null;
        placeOfDeath?: string | null;
        books?: __.Association.to.many<Books>;
        bookEvent?: __.Association.to<BookEvent> | null;
        bookEvent_ID?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class Author extends _AuthorAspect(__.Entity) {}
Object.defineProperty(Author, 'name', { value: 'sap.capire.bookshop.Authors' })
Object.defineProperty(Author, 'is_singular', { value: true })
export class Authors extends Array<Author> {$count?: number}
Object.defineProperty(Authors, 'name', { value: 'sap.capire.bookshop.Authors' })

export function _GenreAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _sap_common._CodeListAspect(Base) {
        ID?: number;
        parent?: __.Association.to<Genre> | null;
        parent_ID?: number | null;
        children?: __.Composition.of.many<Genres>;
      static readonly actions: Record<never, never>
  };
}
export class Genre extends _GenreAspect(__.Entity) {}
Object.defineProperty(Genre, 'name', { value: 'sap.capire.bookshop.Genres' })
Object.defineProperty(Genre, 'is_singular', { value: true })
export class Genres extends Array<Genre> {$count?: number}
Object.defineProperty(Genres, 'name', { value: 'sap.capire.bookshop.Genres' })

export function _ReviewAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(Base) {
        ID?: number;
        book?: __.Association.to<Book> | null;
        book_ID?: number | null;
        reviewer?: __.Association.to<User> | null;
        reviewer_ID?: number | null;
        rating?: number | null;
        comment?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class Review extends _ReviewAspect(__.Entity) {}
Object.defineProperty(Review, 'name', { value: 'sap.capire.bookshop.Reviews' })
Object.defineProperty(Review, 'is_singular', { value: true })
export class Reviews extends Array<Review> {$count?: number}
Object.defineProperty(Reviews, 'name', { value: 'sap.capire.bookshop.Reviews' })

export function _BookEventAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(_._cuidAspect(Base)) {
        name?: string | null;
        types?: BookEvent_types | null;
        author?: __.Association.to<Author> | null;
      static types = BookEvent_types
      static readonly actions: Record<never, never>
  };
}
export class BookEvent extends _BookEventAspect(__.Entity) {static drafts: typeof BookEvent}
Object.defineProperty(BookEvent, 'name', { value: 'sap.capire.bookshop.BookEvents' })
Object.defineProperty(BookEvent, 'is_singular', { value: true })
export class BookEvents extends Array<BookEvent> {static drafts: typeof BookEvent
$count?: number}
Object.defineProperty(BookEvents, 'name', { value: 'sap.capire.bookshop.BookEvents' })

export function _UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(Base) {
        ID?: number;
        username?: string | null;
        email?: string | null;
        role?: _.Roles | null;
        reviews?: __.Association.to.many<Reviews>;
      static readonly actions: Record<never, never>
  };
}
export class User extends _UserAspect(__.Entity) {}
Object.defineProperty(User, 'name', { value: 'sap.capire.bookshop.Users' })
Object.defineProperty(User, 'is_singular', { value: true })
export class Users extends Array<User> {$count?: number}
Object.defineProperty(Users, 'name', { value: 'sap.capire.bookshop.Users' })

export function _UserActivityLogAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(Base) {
        ID?: number;
        actionType?: string | null;
      static readonly actions: Record<never, never>
  };
}
export class UserActivityLog extends _UserActivityLogAspect(__.Entity) {}
Object.defineProperty(UserActivityLog, 'name', { value: 'sap.capire.bookshop.UserActivityLog' })
Object.defineProperty(UserActivityLog, 'is_singular', { value: true })
export class UserActivityLog_ extends Array<UserActivityLog> {$count?: number}
Object.defineProperty(UserActivityLog_, 'name', { value: 'sap.capire.bookshop.UserActivityLog' })

export function _PromotionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends Base {
        ID?: number;
        name?: string | null;
        description?: string | null;
        startDate?: __.CdsDate | null;
        endDate?: __.CdsDate | null;
        discount?: number | null;
        books?: __.Association.to.many<Books>;
      static readonly actions: Record<never, never>
  };
}
export class Promotion extends _PromotionAspect(__.Entity) {}
Object.defineProperty(Promotion, 'name', { value: 'sap.capire.bookshop.Promotions' })
Object.defineProperty(Promotion, 'is_singular', { value: true })
export class Promotions extends Array<Promotion> {$count?: number}
Object.defineProperty(Promotions, 'name', { value: 'sap.capire.bookshop.Promotions' })
