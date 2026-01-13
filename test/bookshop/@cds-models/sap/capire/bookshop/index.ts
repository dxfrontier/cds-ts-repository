// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './../../..';
import * as __ from './../../../_';
import * as _sap_common from './../../common';

// enum
const BookEvent_types = {
  BOOK_SIGNING: 'BOOK_SIGNING',
  AUTHOR_TALK: 'AUTHOR_TALK',
  BOOK_LUNCH: 'BOOK_LUNCH',
} as const;
type BookEvent_types = 'BOOK_SIGNING' | 'AUTHOR_TALK' | 'BOOK_LUNCH';

export function _BookAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Book extends _._managedAspect(Base) {
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
    declare reviews?: __.Association.to.many<Reviews>;
    declare stats?: __.Association.to<BookStat> | null;
    declare texts?: __.Composition.of.many<Books.texts>;
    declare localized?: __.Association.to<Books.text> | null;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Book>;
    declare static readonly elements: __.ElementsOf<Book>;
    declare static readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class Book extends _BookAspect(__.Entity) {}
Object.defineProperty(Book, 'name', { value: 'sap.capire.bookshop.Books' });
Object.defineProperty(Book, 'is_singular', { value: true });
export class Books extends Array<Book> {
  $count?: number;
}
Object.defineProperty(Books, 'name', { value: 'sap.capire.bookshop.Books' });

export function _BookStatAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class BookStat extends _._managedAspect(Base) {
    declare ID?: __.Key<number>;
    declare views?: number | null;
    declare averageRating?: number | null;
    declare book?: __.Association.to<Book> | null;
    declare book_ID?: number | null;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<BookStat>;
    declare static readonly elements: __.ElementsOf<BookStat>;
    declare static readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class BookStat extends _BookStatAspect(__.Entity) {}
Object.defineProperty(BookStat, 'name', { value: 'sap.capire.bookshop.BookStats' });
Object.defineProperty(BookStat, 'is_singular', { value: true });
export class BookStats extends Array<BookStat> {
  $count?: number;
}
Object.defineProperty(BookStats, 'name', { value: 'sap.capire.bookshop.BookStats' });

export function _AuthorAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Author extends _._managedAspect(Base) {
    declare ID?: __.Key<number>;
    declare name?: string | null;
    declare dateOfBirth?: __.CdsDate | null;
    declare dateOfDeath?: __.CdsDate | null;
    declare placeOfBirth?: string | null;
    declare placeOfDeath?: string | null;
    declare books?: __.Association.to.many<Books>;
    declare bookEvent?: __.Association.to<BookEvent> | null;
    declare bookEvent_ID?: string | null;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Author>;
    declare static readonly elements: __.ElementsOf<Author>;
    declare static readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class Author extends _AuthorAspect(__.Entity) {}
Object.defineProperty(Author, 'name', { value: 'sap.capire.bookshop.Authors' });
Object.defineProperty(Author, 'is_singular', { value: true });
export class Authors extends Array<Author> {
  $count?: number;
}
Object.defineProperty(Authors, 'name', { value: 'sap.capire.bookshop.Authors' });

export function _GenreAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Genre extends _sap_common._CodeListAspect(Base) {
    declare ID?: __.Key<number>;
    declare parent?: __.Association.to<Genre> | null;
    declare parent_ID?: number | null;
    declare children?: __.Composition.of.many<Genres>;
    declare texts?: __.Composition.of.many<Genres.texts>;
    declare localized?: __.Association.to<Genres.text> | null;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Genre>;
    declare static readonly elements: __.ElementsOf<Genre>;
    declare static readonly actions: typeof _sap_common.CodeList.actions & globalThis.Record<never, never>;
  };
}
export class Genre extends _GenreAspect(__.Entity) {}
Object.defineProperty(Genre, 'name', { value: 'sap.capire.bookshop.Genres' });
Object.defineProperty(Genre, 'is_singular', { value: true });
export class Genres extends Array<Genre> {
  $count?: number;
}
Object.defineProperty(Genres, 'name', { value: 'sap.capire.bookshop.Genres' });

export function _ReviewAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Review extends _._managedAspect(Base) {
    declare ID?: __.Key<number>;
    declare book?: __.Association.to<Book> | null;
    declare book_ID?: number | null;
    declare reviewer?: __.Association.to<User> | null;
    declare reviewer_ID?: number | null;
    declare rating?: number | null;
    declare comment?: string | null;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Review>;
    declare static readonly elements: __.ElementsOf<Review>;
    declare static readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class Review extends _ReviewAspect(__.Entity) {}
Object.defineProperty(Review, 'name', { value: 'sap.capire.bookshop.Reviews' });
Object.defineProperty(Review, 'is_singular', { value: true });
export class Reviews extends Array<Review> {
  $count?: number;
}
Object.defineProperty(Reviews, 'name', { value: 'sap.capire.bookshop.Reviews' });

export function _BookEventAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class BookEvent extends _._managedAspect(_._cuidAspect(Base)) {
    declare name?: string | null;
    declare types?: BookEvent_types | null;
    declare author?: __.Association.to<Author> | null;
    static types = BookEvent_types;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<BookEvent> & typeof _.cuid.keys;
    declare static readonly elements: __.ElementsOf<BookEvent>;
    declare static readonly actions: typeof _.cuid.actions & typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class BookEvent extends _BookEventAspect(__.Entity) {}
Object.defineProperty(BookEvent, 'name', { value: 'sap.capire.bookshop.BookEvents' });
Object.defineProperty(BookEvent, 'is_singular', { value: true });
export class BookEvents extends Array<BookEvent> {
  $count?: number;
}
Object.defineProperty(BookEvents, 'name', { value: 'sap.capire.bookshop.BookEvents' });

export function _UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class User extends _._managedAspect(Base) {
    declare ID?: __.Key<number>;
    declare username?: string | null;
    declare email?: string | null;
    declare role?: _.Roles | null;
    declare reviews?: __.Association.to.many<Reviews>;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<User>;
    declare static readonly elements: __.ElementsOf<User>;
    declare static readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class User extends _UserAspect(__.Entity) {}
Object.defineProperty(User, 'name', { value: 'sap.capire.bookshop.Users' });
Object.defineProperty(User, 'is_singular', { value: true });
export class Users extends Array<User> {
  $count?: number;
}
Object.defineProperty(Users, 'name', { value: 'sap.capire.bookshop.Users' });

export function _UserActivityLogAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class UserActivityLog extends _._managedAspect(Base) {
    declare ID?: __.Key<number>;
    declare actionType?: string | null;
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<UserActivityLog>;
    declare static readonly elements: __.ElementsOf<UserActivityLog>;
    declare static readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class UserActivityLog extends _UserActivityLogAspect(__.Entity) {}
Object.defineProperty(UserActivityLog, 'name', { value: 'sap.capire.bookshop.UserActivityLog' });
Object.defineProperty(UserActivityLog, 'is_singular', { value: true });
export class UserActivityLog_ extends Array<UserActivityLog> {
  $count?: number;
}
Object.defineProperty(UserActivityLog_, 'name', { value: 'sap.capire.bookshop.UserActivityLog' });

export function _PromotionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Promotion extends Base {
    declare ID?: __.Key<number>;
    declare name?: string | null;
    declare description?: string | null;
    declare startDate?: __.CdsDate | null;
    declare endDate?: __.CdsDate | null;
    declare discount?: number | null;
    declare books?: __.Association.to<Book> | null;
    declare books_ID?: number | null;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Promotion>;
    declare static readonly elements: __.ElementsOf<Promotion>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class Promotion extends _PromotionAspect(__.Entity) {}
Object.defineProperty(Promotion, 'name', { value: 'sap.capire.bookshop.Promotions' });
Object.defineProperty(Promotion, 'is_singular', { value: true });
export class Promotions extends Array<Promotion> {
  $count?: number;
}
Object.defineProperty(Promotions, 'name', { value: 'sap.capire.bookshop.Promotions' });

export namespace Books {
  export function _textAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class text extends _sap_common._TextsAspectAspect(Base) {
      declare ID?: __.Key<number>;
      declare title?: string | null;
      declare descr?: string | null;
      static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
      declare static readonly keys: __.KeysOf<text> & typeof _sap_common.TextsAspect.keys;
      declare static readonly elements: __.ElementsOf<text>;
      declare static readonly actions: typeof _sap_common.TextsAspect.actions & globalThis.Record<never, never>;
    };
  }
  export class text extends _textAspect(__.Entity) {}
  Object.defineProperty(text, 'name', { value: 'sap.capire.bookshop.Books.texts' });
  Object.defineProperty(text, 'is_singular', { value: true });
  export class texts extends Array<text> {
    $count?: number;
  }
  Object.defineProperty(texts, 'name', { value: 'sap.capire.bookshop.Books.texts' });
}
export namespace Genres {
  export function _textAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class text extends _sap_common._TextsAspectAspect(Base) {
      declare name?: string | null;
      declare descr?: string | null;
      declare ID?: __.Key<number>;
      static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
      declare static readonly keys: __.KeysOf<text> & typeof _sap_common.TextsAspect.keys;
      declare static readonly elements: __.ElementsOf<text>;
      declare static readonly actions: typeof _sap_common.TextsAspect.actions & globalThis.Record<never, never>;
    };
  }
  export class text extends _textAspect(__.Entity) {}
  Object.defineProperty(text, 'name', { value: 'sap.capire.bookshop.Genres.texts' });
  Object.defineProperty(text, 'is_singular', { value: true });
  export class texts extends Array<text> {
    $count?: number;
  }
  Object.defineProperty(texts, 'name', { value: 'sap.capire.bookshop.Genres.texts' });
}
