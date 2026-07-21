// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './../../..';
import * as __ from './../../../_';
import * as _sap_common from './../../common';

// enum
export const BookEvent_types: {
  BOOK_SIGNING: 'BOOK_SIGNING';
  AUTHOR_TALK: 'AUTHOR_TALK';
  BOOK_LUNCH: 'BOOK_LUNCH';
};
export type BookEvent_types = 'BOOK_SIGNING' | 'AUTHOR_TALK' | 'BOOK_LUNCH';

// entity 'Book'
export declare function _BookAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    createdBy?: _.User | null;
    modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    modifiedBy?: _.User | null;
    ID?: __.Key<number>;
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
    image?: import('stream').Readable | null;
    isAvailable?: boolean | null;
    author?: __.Association.to<Author> | null;
    author_ID?: number | null;
    genre?: __.Association.to<Genre> | null;
    genre_ID?: number | null;
    reviews?: __.Association.to.many<Reviews>;
    stats?: __.Association.to<BookStat> | null;
    texts?: __.Composition.of.many<Books.texts>;
    localized?: __.Association.to<Books.text> | null;
  } & InstanceType<ReturnType<typeof _._managedAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Book>;
  readonly elements: __.ElementsOf<Book>;
  readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
};
export class Book extends _BookAspect(__.Entity) {}
export class Books extends Array<Book> {
  $count?: number;
}

// entity 'BookStat'
export declare function _BookStatAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    createdBy?: _.User | null;
    modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    modifiedBy?: _.User | null;
    ID?: __.Key<number>;
    views?: number | null;
    averageRating?: number | null;
    book?: __.Association.to<Book> | null;
    book_ID?: number | null;
  } & InstanceType<ReturnType<typeof _._managedAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<BookStat>;
  readonly elements: __.ElementsOf<BookStat>;
  readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
};
export class BookStat extends _BookStatAspect(__.Entity) {}
export class BookStats extends Array<BookStat> {
  $count?: number;
}

// entity 'Author'
export declare function _AuthorAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    createdBy?: _.User | null;
    modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    modifiedBy?: _.User | null;
    ID?: __.Key<number>;
    name?: string | null;
    dateOfBirth?: __.CdsDate | null;
    dateOfDeath?: __.CdsDate | null;
    placeOfBirth?: string | null;
    placeOfDeath?: string | null;
    books?: __.Association.to.many<Books>;
    bookEvent?: __.Association.to<BookEvent> | null;
    bookEvent_ID?: string | null;
  } & InstanceType<ReturnType<typeof _._managedAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Author>;
  readonly elements: __.ElementsOf<Author>;
  readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
};
export class Author extends _AuthorAspect(__.Entity) {}
export class Authors extends Array<Author> {
  $count?: number;
}

// entity 'Genre'
export declare function _GenreAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    name?: string | null;
    descr?: string | null;
    ID?: __.Key<number>;
    parent?: __.Association.to<Genre> | null;
    parent_ID?: number | null;
    children?: __.Composition.of.many<Genres>;
    texts?: __.Composition.of.many<Genres.texts>;
    localized?: __.Association.to<Genres.text> | null;
  } & InstanceType<ReturnType<typeof _sap_common._CodeListAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Genre>;
  readonly elements: __.ElementsOf<Genre>;
  readonly actions: typeof _sap_common.CodeList.actions & globalThis.Record<never, never>;
};
export class Genre extends _GenreAspect(__.Entity) {}
export class Genres extends Array<Genre> {
  $count?: number;
}

// entity 'Review'
export declare function _ReviewAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    createdBy?: _.User | null;
    modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    modifiedBy?: _.User | null;
    ID?: __.Key<number>;
    book?: __.Association.to<Book> | null;
    book_ID?: number | null;
    reviewer?: __.Association.to<User> | null;
    reviewer_ID?: number | null;
    rating?: number | null;
    comment?: string | null;
  } & InstanceType<ReturnType<typeof _._managedAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Review>;
  readonly elements: __.ElementsOf<Review>;
  readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
};
export class Review extends _ReviewAspect(__.Entity) {}
export class Reviews extends Array<Review> {
  $count?: number;
}

// entity 'BookEvent'
export declare function _BookEventAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    createdBy?: _.User | null;
    modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    modifiedBy?: _.User | null;
    ID?: __.Key<string>;
    name?: string | null;
    types?: BookEvent_types | null;
    author?: __.Association.to<Author> | null;
  } & InstanceType<ReturnType<typeof _._managedAspect<ReturnType<typeof _._cuidAspect<TBase>>>>>;
  types: typeof BookEvent_types;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<BookEvent> & typeof _.cuid.keys;
  readonly elements: __.ElementsOf<BookEvent>;
  readonly actions: typeof _.managed.actions & typeof _.cuid.actions & globalThis.Record<never, never>;
};
export class BookEvent extends _BookEventAspect(__.Entity) {}
export class BookEvents extends Array<BookEvent> {
  $count?: number;
}

// entity 'User'
export declare function _UserAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    createdBy?: _.User | null;
    modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    modifiedBy?: _.User | null;
    ID?: __.Key<number>;
    username?: string | null;
    email?: string | null;
    role?: _.Roles | null;
    reviews?: __.Association.to.many<Reviews>;
  } & InstanceType<ReturnType<typeof _._managedAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<User>;
  readonly elements: __.ElementsOf<User>;
  readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
};
export class User extends _UserAspect(__.Entity) {}
export class Users extends Array<User> {
  $count?: number;
}

// entity 'UserActivityLog'
export declare function _UserActivityLogAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    createdBy?: _.User | null;
    modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    modifiedBy?: _.User | null;
    ID?: __.Key<number>;
    actionType?: string | null;
  } & InstanceType<ReturnType<typeof _._managedAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<UserActivityLog>;
  readonly elements: __.ElementsOf<UserActivityLog>;
  readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
};
export class UserActivityLog extends _UserActivityLogAspect(__.Entity) {}
export class UserActivityLog_ extends Array<UserActivityLog> {
  $count?: number;
}

// entity 'Promotion'
export declare function _PromotionAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    ID?: __.Key<number>;
    name?: string | null;
    description?: string | null;
    startDate?: __.CdsDate | null;
    endDate?: __.CdsDate | null;
    discount?: number | null;
    books?: __.Association.to<Book> | null;
    books_ID?: number | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Promotion>;
  readonly elements: __.ElementsOf<Promotion>;
  readonly actions: globalThis.Record<never, never>;
};
export class Promotion extends _PromotionAspect(__.Entity) {}
export class Promotions extends Array<Promotion> {
  $count?: number;
}

export namespace Books {
  // entity 'text'
  export function _textAspect<TBase extends new (...args: any[]) => object>(
    Base: TBase,
  ): {
    new (...args: any[]): {
      /** Type for a language code */
      locale?: __.Key<_sap_common.Locale>;
      ID?: __.Key<number>;
      title?: string | null;
      descr?: string | null;
    } & InstanceType<ReturnType<typeof _sap_common._TextsAspectAspect<TBase>>>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text> & typeof _sap_common.TextsAspect.keys;
    readonly elements: __.ElementsOf<text>;
    readonly actions: typeof _sap_common.TextsAspect.actions & globalThis.Record<never, never>;
  };
  export class text extends _textAspect(__.Entity) {}
  export class texts extends Array<text> {
    $count?: number;
  }
}
export namespace Genres {
  // entity 'text'
  export function _textAspect<TBase extends new (...args: any[]) => object>(
    Base: TBase,
  ): {
    new (...args: any[]): {
      /** Type for a language code */
      locale?: __.Key<_sap_common.Locale>;
      name?: string | null;
      descr?: string | null;
      ID?: __.Key<number>;
    } & InstanceType<ReturnType<typeof _sap_common._TextsAspectAspect<TBase>>>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text> & typeof _sap_common.TextsAspect.keys;
    readonly elements: __.ElementsOf<text>;
    readonly actions: typeof _sap_common.TextsAspect.actions & globalThis.Record<never, never>;
  };
  export class text extends _textAspect(__.Entity) {}
  export class texts extends Array<text> {
    $count?: number;
  }
}
