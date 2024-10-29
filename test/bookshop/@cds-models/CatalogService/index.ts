// This is an automatically generated file. Please do not change its contents manually!
import cds from '@sap/cds';
import * as _ from './..';
import * as __ from './../_';
import * as _sap_capire_bookshop from './../sap/capire/bookshop';
import * as _sap_common from './../sap/common';

export class CatalogService extends cds.Service {}
export default CatalogService;

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
    static readonly actions: Record<never, never>;
  };
}
/**
 * Aspect for entities with canonical universal IDs
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-cuid
 */
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
    declare bookEvent_ID?: __.Key<string> | null;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Author>;
    declare static readonly elements: __.ElementsOf<Author>;
    static readonly actions: Record<never, never>;
  };
}
/**
 * Aspect to capture changes by user and name
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-managed
 */
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
    declare currency_code?: __.Key<string> | null;
    declare image?:
      | Buffer
      | string
      | {
          value: import('stream').Readable;
          $mediaContentType: string;
          $mediaContentDispositionFilename?: string;
          $mediaContentDispositionType?: string;
        }
      | null;
    declare author?: __.Association.to<Author> | null;
    declare author_ID?: __.Key<number> | null;
    declare genre?: __.Association.to<Genre> | null;
    declare genre_ID?: __.Key<number> | null;
    declare reviews?: __.Association.to.many<_sap_capire_bookshop.Reviews>;
    declare stats?: __.Association.to<_sap_capire_bookshop.BookStat> | null;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Book>;
    declare static readonly elements: __.ElementsOf<Book>;
    static readonly actions: Record<never, never>;
  };
}
/**
 * Aspect to capture changes by user and name
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-managed
 */
export class Book extends _BookAspect(__.Entity) {}
Object.defineProperty(Book, 'name', { value: 'CatalogService.Books' });
Object.defineProperty(Book, 'is_singular', { value: true });
export class Books extends Array<Book> {
  $count?: number;
}
Object.defineProperty(Books, 'name', { value: 'CatalogService.Books' });

export function _CurrencyAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Currency extends _sap_common._CodeListAspect(Base) {
    declare code?: __.Key<string>;
    declare symbol?: string | null;
    declare minorUnit?: number | null;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Currency>;
    declare static readonly elements: __.ElementsOf<Currency>;
    static readonly actions: typeof _sap_common.CodeList.actions & Record<never, never>;
  };
}
/**
 * Code list for currencies
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-currencies
 */
export class Currency extends _CurrencyAspect(__.Entity) {}
Object.defineProperty(Currency, 'name', { value: 'sap.common.Currencies' });
Object.defineProperty(Currency, 'is_singular', { value: true });
/**
 * Code list for currencies
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-currencies
 */
export class Currencies extends Array<Currency> {
  $count?: number;
}
Object.defineProperty(Currencies, 'name', { value: 'sap.common.Currencies' });

export function _GenreAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Genre extends _sap_common._CodeListAspect(Base) {
    declare ID?: __.Key<number>;
    declare parent?: __.Association.to<_sap_capire_bookshop.Genre> | null;
    declare parent_ID?: __.Key<number> | null;
    declare children?: __.Composition.of.many<_sap_capire_bookshop.Genres>;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Genre>;
    declare static readonly elements: __.ElementsOf<Genre>;
    static readonly actions: typeof _sap_common.CodeList.actions & Record<never, never>;
  };
}
export class Genre extends _GenreAspect(__.Entity) {}
Object.defineProperty(Genre, 'name', { value: 'sap.capire.bookshop.Genres' });
Object.defineProperty(Genre, 'is_singular', { value: true });
export class Genres extends Array<Genre> {
  $count?: number;
}
Object.defineProperty(Genres, 'name', { value: 'sap.capire.bookshop.Genres' });
