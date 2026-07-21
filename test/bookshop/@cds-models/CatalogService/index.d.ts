// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './..';
import * as _sap_capire_bookshop from './../sap/capire/bookshop';
import * as __ from './../_';
import * as _sap_common from './../sap/common';

export default class {}

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
    types?: _sap_capire_bookshop.BookEvent_types | null;
    author?: __.Association.to<Author> | null;
  } & InstanceType<TBase>;
  types: typeof _sap_capire_bookshop.BookEvent_types;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<BookEvent>;
  readonly elements: __.ElementsOf<BookEvent>;
  readonly actions: globalThis.Record<never, never>;
};
export class BookEvent extends _BookEventAspect(__.Entity) {
  static drafts: __.DraftOf<BookEvent>;
}
export class BookEvents extends Array<BookEvent> {
  static drafts: __.DraftsOf<BookEvent>;
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
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Author>;
  readonly elements: __.ElementsOf<Author>;
  readonly actions: globalThis.Record<never, never>;
};
export class Author extends _AuthorAspect(__.Entity) {}
export class Authors extends Array<Author> {
  $count?: number;
}

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
    reviews?: __.Association.to.many<_sap_capire_bookshop.Reviews>;
    stats?: __.Association.to<_sap_capire_bookshop.BookStat> | null;
    texts?: __.Composition.of.many<Books.texts>;
    localized?: __.Association.to<Books.text> | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Book>;
  readonly elements: __.ElementsOf<Book>;
  readonly actions: globalThis.Record<never, never>;
};
export class Book extends _BookAspect(__.Entity) {}
export class Books extends Array<Book> {
  $count?: number;
}

// entity 'Currency'
export declare function _CurrencyAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    name?: string | null;
    descr?: string | null;
    code?: __.Key<string>;
    symbol?: string | null;
    minorUnit?: number | null;
    texts?: __.Composition.of.many<Currencies.texts>;
    localized?: __.Association.to<Currencies.text> | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Currency>;
  readonly elements: __.ElementsOf<Currency>;
  readonly actions: globalThis.Record<never, never>;
};
/**
 * Code list for currencies
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-currencies
 */
export class Currency extends _CurrencyAspect(__.Entity) {}
/**
 * Code list for currencies
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-currencies
 */
export class Currencies extends Array<Currency> {
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
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Genre>;
  readonly elements: __.ElementsOf<Genre>;
  readonly actions: globalThis.Record<never, never>;
};
export class Genre extends _GenreAspect(__.Entity) {}
export class Genres extends Array<Genre> {
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
    } & InstanceType<TBase>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text>;
    readonly elements: __.ElementsOf<text>;
    readonly actions: globalThis.Record<never, never>;
  };
  export class text extends _textAspect(__.Entity) {}
  export class texts extends Array<text> {
    $count?: number;
  }
}
export namespace Currencies {
  // entity 'text'
  export function _textAspect<TBase extends new (...args: any[]) => object>(
    Base: TBase,
  ): {
    new (...args: any[]): {
      /** Type for a language code */
      locale?: __.Key<_sap_common.Locale>;
      name?: string | null;
      descr?: string | null;
      code?: __.Key<string>;
    } & InstanceType<TBase>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text>;
    readonly elements: __.ElementsOf<text>;
    readonly actions: globalThis.Record<never, never>;
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
    } & InstanceType<TBase>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text>;
    readonly elements: __.ElementsOf<text>;
    readonly actions: globalThis.Record<never, never>;
  };
  export class text extends _textAspect(__.Entity) {}
  export class texts extends Array<text> {
    $count?: number;
  }
}
