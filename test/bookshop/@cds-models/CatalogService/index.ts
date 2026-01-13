// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './..';
import * as __ from './../_';
import * as _sap_capire_bookshop from './../sap/capire/bookshop';
import * as _sap_common from './../sap/common';

export default class {}

// enum
const BookEvent_types = {
  BOOK_SIGNING: 'BOOK_SIGNING',
  AUTHOR_TALK: 'AUTHOR_TALK',
  BOOK_LUNCH: 'BOOK_LUNCH',
} as const;
type BookEvent_types = 'BOOK_SIGNING' | 'AUTHOR_TALK' | 'BOOK_LUNCH';

export function _BookEventAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class BookEvent extends Base {
    declare createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    declare createdBy?: _.User | null;
    declare modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    declare modifiedBy?: _.User | null;
    declare ID?: __.Key<string>;
    declare name?: string | null;
    declare types?: BookEvent_types | null;
    declare author?: __.Association.to<Author> | null;
    static types = BookEvent_types;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<BookEvent>;
    declare static readonly elements: __.ElementsOf<BookEvent>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class BookEvent extends _BookEventAspect(__.Entity) {
  static drafts: __.DraftOf<BookEvent>;
}
Object.defineProperty(BookEvent, 'name', { value: 'CatalogService.BookEvents' });
Object.defineProperty(BookEvent, 'is_singular', { value: true });
export class BookEvents extends Array<BookEvent> {
  static drafts: __.DraftsOf<BookEvent>;
  $count?: number;
}
Object.defineProperty(BookEvents, 'name', { value: 'CatalogService.BookEvents' });

export function _AuthorAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Author extends Base {
    declare createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    declare createdBy?: _.User | null;
    declare modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    declare modifiedBy?: _.User | null;
    declare ID?: __.Key<number>;
    declare name?: string | null;
    declare dateOfBirth?: __.CdsDate | null;
    declare dateOfDeath?: __.CdsDate | null;
    declare placeOfBirth?: string | null;
    declare placeOfDeath?: string | null;
    declare books?: __.Association.to.many<Books>;
    declare bookEvent?: __.Association.to<BookEvent> | null;
    declare bookEvent_ID?: string | null;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Author>;
    declare static readonly elements: __.ElementsOf<Author>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class Author extends _AuthorAspect(__.Entity) {}
Object.defineProperty(Author, 'name', { value: 'CatalogService.Authors' });
Object.defineProperty(Author, 'is_singular', { value: true });
export class Authors extends Array<Author> {
  $count?: number;
}
Object.defineProperty(Authors, 'name', { value: 'CatalogService.Authors' });

export function _BookAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Book extends Base {
    declare createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    declare createdBy?: _.User | null;
    declare modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    declare modifiedBy?: _.User | null;
    declare ID?: __.Key<number>;
    declare title?: string | null;
    declare descr?: string | null;
    declare stock?: number | null;
    declare price?: number | null;
    /**
     * Type for an association to Currencies
     *
     * See https://cap.cloud.sap/docs/cds/common#type-currency
     */
    declare currency?: _.Currency | null;
    declare currency_code?: string | null;
    declare image?: import('stream').Readable | null;
    declare isAvailable?: boolean | null;
    declare author?: __.Association.to<Author> | null;
    declare author_ID?: number | null;
    declare genre?: __.Association.to<Genre> | null;
    declare genre_ID?: number | null;
    declare reviews?: __.Association.to.many<_sap_capire_bookshop.Reviews>;
    declare stats?: __.Association.to<_sap_capire_bookshop.BookStat> | null;
    declare texts?: __.Composition.of.many<Books.texts>;
    declare localized?: __.Association.to<Books.text> | null;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Book>;
    declare static readonly elements: __.ElementsOf<Book>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class Book extends _BookAspect(__.Entity) {}
Object.defineProperty(Book, 'name', { value: 'CatalogService.Books' });
Object.defineProperty(Book, 'is_singular', { value: true });
export class Books extends Array<Book> {
  $count?: number;
}
Object.defineProperty(Books, 'name', { value: 'CatalogService.Books' });

export function _CurrencyAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Currency extends Base {
    declare name?: string | null;
    declare descr?: string | null;
    declare code?: __.Key<string>;
    declare symbol?: string | null;
    declare minorUnit?: number | null;
    declare texts?: __.Composition.of.many<Currencies.texts>;
    declare localized?: __.Association.to<Currencies.text> | null;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Currency>;
    declare static readonly elements: __.ElementsOf<Currency>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
/**
 * Code list for currencies
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-currencies
 */
export class Currency extends _CurrencyAspect(__.Entity) {}
Object.defineProperty(Currency, 'name', { value: 'CatalogService.Currencies' });
Object.defineProperty(Currency, 'is_singular', { value: true });
/**
 * Code list for currencies
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-currencies
 */
export class Currencies extends Array<Currency> {
  $count?: number;
}
Object.defineProperty(Currencies, 'name', { value: 'CatalogService.Currencies' });

export function _GenreAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Genre extends Base {
    declare name?: string | null;
    declare descr?: string | null;
    declare ID?: __.Key<number>;
    declare parent?: __.Association.to<Genre> | null;
    declare parent_ID?: number | null;
    declare children?: __.Composition.of.many<Genres>;
    declare texts?: __.Composition.of.many<Genres.texts>;
    declare localized?: __.Association.to<Genres.text> | null;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Genre>;
    declare static readonly elements: __.ElementsOf<Genre>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class Genre extends _GenreAspect(__.Entity) {}
Object.defineProperty(Genre, 'name', { value: 'CatalogService.Genres' });
Object.defineProperty(Genre, 'is_singular', { value: true });
export class Genres extends Array<Genre> {
  $count?: number;
}
Object.defineProperty(Genres, 'name', { value: 'CatalogService.Genres' });

export namespace Books {
  export function _textAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class text extends Base {
      /** Type for a language code */
      declare locale?: __.Key<_sap_common.Locale>;
      declare ID?: __.Key<number>;
      declare title?: string | null;
      declare descr?: string | null;
      static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
      declare static readonly keys: __.KeysOf<text>;
      declare static readonly elements: __.ElementsOf<text>;
      declare static readonly actions: globalThis.Record<never, never>;
    };
  }
  export class text extends _textAspect(__.Entity) {}
  Object.defineProperty(text, 'name', { value: 'CatalogService.Books.texts' });
  Object.defineProperty(text, 'is_singular', { value: true });
  export class texts extends Array<text> {
    $count?: number;
  }
  Object.defineProperty(texts, 'name', { value: 'CatalogService.Books.texts' });
}
export namespace Currencies {
  export function _textAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class text extends Base {
      /** Type for a language code */
      declare locale?: __.Key<_sap_common.Locale>;
      declare name?: string | null;
      declare descr?: string | null;
      declare code?: __.Key<string>;
      static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
      declare static readonly keys: __.KeysOf<text>;
      declare static readonly elements: __.ElementsOf<text>;
      declare static readonly actions: globalThis.Record<never, never>;
    };
  }
  export class text extends _textAspect(__.Entity) {}
  Object.defineProperty(text, 'name', { value: 'CatalogService.Currencies.texts' });
  Object.defineProperty(text, 'is_singular', { value: true });
  export class texts extends Array<text> {
    $count?: number;
  }
  Object.defineProperty(texts, 'name', { value: 'CatalogService.Currencies.texts' });
}
export namespace Genres {
  export function _textAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class text extends Base {
      /** Type for a language code */
      declare locale?: __.Key<_sap_common.Locale>;
      declare name?: string | null;
      declare descr?: string | null;
      declare ID?: __.Key<number>;
      static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
      declare static readonly keys: __.KeysOf<text>;
      declare static readonly elements: __.ElementsOf<text>;
      declare static readonly actions: globalThis.Record<never, never>;
    };
  }
  export class text extends _textAspect(__.Entity) {}
  Object.defineProperty(text, 'name', { value: 'CatalogService.Genres.texts' });
  Object.defineProperty(text, 'is_singular', { value: true });
  export class texts extends Array<text> {
    $count?: number;
  }
  Object.defineProperty(texts, 'name', { value: 'CatalogService.Genres.texts' });
}
