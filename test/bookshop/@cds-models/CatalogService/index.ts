// This is an automatically generated file. Please do not change its contents manually!
import * as _sap_capire_bookshop from './../sap/capire/bookshop';
import * as __ from './../_';
import * as _ from './..';
import * as _sap_common from './../sap/common';
export default { name: 'CatalogService' }
// enum
const BookEvent_types = {
  BOOK_SIGNING: "BOOK_SIGNING",
  AUTHOR_TALK: "AUTHOR_TALK",
  BOOK_LUNCH: "BOOK_LUNCH",
} as const;
type BookEvent_types = "BOOK_SIGNING" | "AUTHOR_TALK" | "BOOK_LUNCH"

export function _BookEventAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class BookEvent extends Base {
        name?: string | null;
        types?: BookEvent_types | null;
        author?: __.Association.to<_sap_capire_bookshop.Author> | null;
        author_ID?: number | null;
      static types = BookEvent_types
      static actions: {
    }
  };
}
export class BookEvent extends _._managedAspect(_._cuidAspect(_BookEventAspect(__.Entity))) {static drafts: typeof BookEvent}
export class BookEvents extends Array<BookEvent> {static drafts: typeof BookEvent}
Object.defineProperty(BookEvent, 'name', { value: 'CatalogService.BookEvents' })
Object.defineProperty(BookEvents, 'name', { value: 'CatalogService.BookEvents' })

export function _AuthorAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Author extends Base {
        ID?: number | null;
        name?: string | null;
        dateOfBirth?: string | null;
        dateOfDeath?: string | null;
        placeOfBirth?: string | null;
        placeOfDeath?: string | null;
        books?: __.Association.to.many<_sap_capire_bookshop.Books>;
        bookEvent?: __.Association.to<_sap_capire_bookshop.BookEvent> | null;
        bookEvent_ID?: string | null;
      static actions: {
    }
  };
}
export class Author extends _._managedAspect(_AuthorAspect(__.Entity)) {}
export class Authors extends Array<Author> {}
Object.defineProperty(Author, 'name', { value: 'CatalogService.Authors' })
Object.defineProperty(Authors, 'name', { value: 'CatalogService.Authors' })

export function _BookAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Book extends Base {
        ID?: number | null;
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
        author?: __.Association.to<_sap_capire_bookshop.Author> | null;
        author_ID?: number | null;
        genre?: __.Association.to<_sap_capire_bookshop.Genre> | null;
        genre_ID?: number | null;
        reviews?: __.Association.to.many<_sap_capire_bookshop.Reviews>;
        stats?: __.Association.to<_sap_capire_bookshop.BookStat> | null;
        stats_ID?: number | null;
      static actions: {
    }
  };
}
export class Book extends _._managedAspect(_BookAspect(__.Entity)) {}
export class Books extends Array<Book> {}
Object.defineProperty(Book, 'name', { value: 'CatalogService.Books' })
Object.defineProperty(Books, 'name', { value: 'CatalogService.Books' })

/**
* Code list for currencies
* 
* See https://cap.cloud.sap/docs/cds/common#entity-currencies
*/
export function _CurrencyAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Currency extends Base {
        code?: string | null;
        symbol?: string | null;
        minorUnit?: number | null;
      static actions: {
    }
  };
}
export class Currency extends _sap_common._CodeListAspect(_CurrencyAspect(__.Entity)) {}
export class Currencies extends Array<Currency> {}
Object.defineProperty(Currency, 'name', { value: 'sap.common.Currencies' })
Object.defineProperty(Currencies, 'name', { value: 'sap.common.Currencies' })

export function _GenreAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Genre extends Base {
        ID?: number | null;
        parent?: __.Association.to<_sap_capire_bookshop.Genre> | null;
        parent_ID?: number | null;
        children?: __.Composition.of.many<_sap_capire_bookshop.Genres>;
      static actions: {
    }
  };
}
export class Genre extends _sap_common._CodeListAspect(_GenreAspect(__.Entity)) {}
export class Genres extends Array<Genre> {}
Object.defineProperty(Genre, 'name', { value: 'sap.capire.bookshop.Genres' })
Object.defineProperty(Genres, 'name', { value: 'sap.capire.bookshop.Genres' })
