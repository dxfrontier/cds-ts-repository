// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './..';
import * as __ from './../_';
import * as _sap_capire_bookshop from './../sap/capire/bookshop';
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
  return class extends _._managedAspect(_._cuidAspect(Base)) {
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        ID?: string;
        name?: string | null;
        types?: BookEvent_types | null;
        author?: __.Association.to<Author> | null;
      static types = BookEvent_types
      static readonly actions: Record<never, never>
  };
}
export class BookEvent extends _BookEventAspect(__.Entity) {static drafts: typeof BookEvent}
Object.defineProperty(BookEvent, 'name', { value: 'CatalogService.BookEvents' })
Object.defineProperty(BookEvent, 'is_singular', { value: true })
export class BookEvents extends Array<BookEvent> {static drafts: typeof BookEvent
$count?: number}
Object.defineProperty(BookEvents, 'name', { value: 'CatalogService.BookEvents' })

export function _AuthorAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(Base) {
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
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
Object.defineProperty(Author, 'name', { value: 'CatalogService.Authors' })
Object.defineProperty(Author, 'is_singular', { value: true })
export class Authors extends Array<Author> {$count?: number}
Object.defineProperty(Authors, 'name', { value: 'CatalogService.Authors' })

export function _BookAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _._managedAspect(Base) {
        createdAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: __.CdsTimestamp | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
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
        reviews?: __.Association.to.many<_sap_capire_bookshop.Reviews>;
        stats?: __.Association.to<_sap_capire_bookshop.BookStat> | null;
      static readonly actions: Record<never, never>
  };
}
export class Book extends _BookAspect(__.Entity) {}
Object.defineProperty(Book, 'name', { value: 'CatalogService.Books' })
Object.defineProperty(Book, 'is_singular', { value: true })
export class Books extends Array<Book> {$count?: number}
Object.defineProperty(Books, 'name', { value: 'CatalogService.Books' })

/**
* Code list for currencies
* 
* See https://cap.cloud.sap/docs/cds/common#entity-currencies
*/
export function _CurrencyAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _sap_common._CodeListAspect(Base) {
        code?: string;
        symbol?: string | null;
        minorUnit?: number | null;
      static readonly actions: Record<never, never>
  };
}
export class Currency extends _CurrencyAspect(__.Entity) {}
Object.defineProperty(Currency, 'name', { value: 'sap.common.Currencies' })
Object.defineProperty(Currency, 'is_singular', { value: true })
export class Currencies extends Array<Currency> {$count?: number}
Object.defineProperty(Currencies, 'name', { value: 'sap.common.Currencies' })

export function _GenreAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extends _sap_common._CodeListAspect(Base) {
        ID?: number;
        parent?: __.Association.to<_sap_capire_bookshop.Genre> | null;
        parent_ID?: number | null;
        children?: __.Composition.of.many<_sap_capire_bookshop.Genres>;
      static readonly actions: Record<never, never>
  };
}
export class Genre extends _GenreAspect(__.Entity) {}
Object.defineProperty(Genre, 'name', { value: 'sap.capire.bookshop.Genres' })
Object.defineProperty(Genre, 'is_singular', { value: true })
export class Genres extends Array<Genre> {$count?: number}
Object.defineProperty(Genres, 'name', { value: 'sap.capire.bookshop.Genres' })
