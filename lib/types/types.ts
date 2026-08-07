import type { QueryAPI, Request } from '@sap/cds';

import type { LanguageCode } from 'iso-639-1';

import type FindBuilder from '../util/find/FindBuilder';
import type { Filter } from '../util/filter/Filter';
import type FindOneBuilder from '../util/find/FindOneBuilder';

import type { Service } from '@sap/cds';

/**
 * Describes the connected remote service a repository delegates its queries to.
 *
 * @remarks
 * Built by `@ExternalService('NAME')` out of the service returned by `cds.connect.to(NAME)` and stored
 * on the repository's constructor. `entities` re-resolves the entity from the remote entity set and
 * `run` REPLACES the plain `await query` execution path of every repository method. A consumer never
 * builds this object, applying the decorator is what produces it.
 *
 * @example
 * ```ts
 * /@ExternalService('API_BUSINESS_PARTNER')
 * class BusinessPartnerRepository extends BaseRepository<A_BusinessPartner> {
 *   constructor() {
 *     super(A_BusinessPartner);
 *   }
 * }
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#externalservice | CDS-TS-Repository - @ExternalService}
 */
type ExternalServiceProps = {
  entities: Service['entities'];
  run: QueryAPI['run'];
};

/**
 * Describes the remote service a repository is bound to BEFORE that service is connected : its name
 * and the pending `cds.connect.to(name)` promise.
 *
 * @remarks
 * What `@ExternalService('NAME')` stores on the decorated class SYNCHRONOUSLY, at decoration time. The
 * promise is only awaited on the first repository call, which is what makes construction order
 * irrelevant : a repository built before the connection settles still routes remotely. The entity is
 * re-resolved from the connected service's entity set at that same moment, so a failed connection
 * surfaces as a rejected repository call instead of a silent fallback to the primary database.
 *
 * @example
 * ```ts
 * /@ExternalService('API_BUSINESS_PARTNER')
 * class BusinessPartnerRepository extends BaseRepository<A_BusinessPartner> {
 *   constructor() {
 *     super(A_BusinessPartner);
 *   }
 * }
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#externalservice | CDS-TS-Repository - @ExternalService}
 */
type ExternalServiceDescriptor = {
  name: string;
  promise: Promise<Service>;
};

/**
 * Describes what a repository holds internally for a remote service : the already connected service or
 * the descriptor of a connection still in flight.
 *
 * @remarks
 * `CoreRepository`, `FindBuilder` and `FindOneBuilder` accept both forms : the presence of the binding
 * is the SYNCHRONOUS answer to "is this repository remote", while the entity and the service itself are
 * resolved on the first call when the binding is a descriptor. A consumer never builds it, applying
 * `@ExternalService` is what produces it.
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#externalservice | CDS-TS-Repository - @ExternalService}
 */
type ExternalServiceBinding = ExternalServiceProps | ExternalServiceDescriptor;

/**
 * Describes the repository class as seen from its own constructor : a constructable optionally carrying
 * the external service attached by the decorator.
 *
 * @remarks
 * `BaseRepository` and `BaseRepositoryDraft` cast `this.constructor` to it to find out whether
 * `@ExternalService` was applied. The decorator attaches `externalServiceName` and
 * `externalServicePromise` synchronously and `externalService` once the connection resolves, so a
 * repository is remote as soon as the NAME is there — all three are `undefined` on a plain database
 * repository, and that absence is what selects the primary-database execution path.
 *
 * @example
 * ```ts
 * const constructor = this.constructor as BaseRepositoryConstructor;
 * const isRemote = (constructor.externalServiceName ?? constructor.externalService) !== undefined;
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#externalservice | CDS-TS-Repository - @ExternalService}
 */
type BaseRepositoryConstructor = {
  new (...args: any[]): unknown;
  externalService?: ExternalServiceProps;
  externalServiceName?: string;
  externalServicePromise?: Promise<Service>;
};

/**
 * Narrows a plural `cds-typer` type to its singular entity type, leaving an already singular type
 * untouched.
 *
 * @remarks
 * Applied by `BaseRepository<T>` and `BaseRepositoryDraft<T>` on every method signature, which is why
 * a repository declared on the plural type still creates, filters and returns single entity objects.
 * The generated plural types are arrays (`Books` is `Book[]`), so the element type is taken.
 *
 * @example
 * ```ts
 * class BookRepository extends BaseRepository<Books> {
 *   constructor() {
 *     super(Books);
 *   }
 *   // this.create() takes a single Book, this.getAll() resolves to Book[]
 * }
 * ```
 */
type ExtractSingular<T> = T extends any[] ? T[number] : T;

/**
 * Describes the `cds-typer` entity a repository is constructed with, reduced to what the query building
 * needs.
 *
 * @remarks
 * `name` is the fully qualified CDS name every query is built from, `elements` the CDS metadata
 * `.getExpand({ levels })` walks and `drafts` the draft sibling `BaseRepositoryDraft` targets. Both
 * extras are optional : an entity re-resolved from an external service's entity set has no `.drafts`,
 * which is why the draft create / upsert methods refuse that path.
 *
 * @example
 * ```ts
 * class BookRepository extends BaseRepository<Books> {
 *   constructor() {
 *     super(Books); // the cds-typer entity, matching Entity
 *   }
 * }
 * ```
 */
type Entity = { name: string } & Partial<{
  elements: unknown;
  drafts: { name: string };
}>;

/**
 * Describes a partial entity : every element optional.
 *
 * @remarks
 * The shape of both the keys and the fields-to-update parameters of the repository methods (`create`,
 * `find`, `update`, `delete`, ...), which is what allows filtering on a single key while the entity
 * declares many elements.
 *
 * @example
 * ```ts
 * const keys: Entry<Book> = { ID: 201 };
 * const updated = await this.update(keys, { stock: 100 });
 * ```
 */
type Entry<T> = Partial<T>;

/**
 * Describes one entry or a list of entries.
 *
 * @remarks
 * The variadic parameter of the bulk methods (`createMany`, `updateOrCreate`, `deleteMany`), which is
 * why they accept both a spread of objects and a single array of them.
 *
 * @example
 * ```ts
 * await this.createMany({ title: 'Book 1' }, { title: 'Book 2' });
 * // or a single array
 * await this.createMany([{ title: 'Book 1' }, { title: 'Book 2' }]);
 * ```
 */
type Entries<T> = Entry<T> | Entry<T>[];

/**
 * Describes a draft row : the singular entity plus the draft administrative elements.
 *
 * @remarks
 * The parameter and result type of every `*Draft` method of `BaseRepositoryDraft`, the draft
 * counterpart of `Entry<T>` — so `IsActiveEntity`, `HasActiveEntity`, `HasDraftEntity` and
 * `DraftAdministrativeData_DraftUUID` can be filtered on and set. A plural `cds-typer` type is narrowed
 * first, exactly like `BaseRepository` does.
 *
 * @example
 * ```ts
 * const drafts = await this.findDrafts({ IsActiveEntity: false });
 * ```
 */
type Draft<T> = EntryDraft<ExtractSingular<T>>;

/**
 * Adds the draft administrative elements to an entity type.
 *
 * @remarks
 * The building block behind `Draft<T>` and `DraftEntries<T>`, kept apart because it takes an already
 * singular entity type and performs no narrowing of its own.
 *
 * @example
 * ```ts
 * const draft: EntryDraft<Book> = { ID: 201, title: 'The Raven', IsActiveEntity: false };
 * ```
 */
type EntryDraft<T> = T & DraftAdministrativeFields;

/**
 * Describes one draft entry or a list of draft entries.
 *
 * @remarks
 * The `Entries<T>` counterpart for the variadic draft methods (`createManyDrafts`,
 * `updateOrCreateDraft`, `deleteManyDrafts`), accepting both a spread of objects and a single array.
 *
 * @example
 * ```ts
 * await this.createManyDrafts({ ID: 201, title: 'Book 1' }, { ID: 202, title: 'Book 2' });
 * ```
 */
type DraftEntries<T> = EntryDraft<T> | EntryDraft<T>[];

/**
 * Describes the draft administrative elements CAP maintains on every draft row.
 *
 * @remarks
 * All four are optional and nullable : they are supplied by CAP, or defaulted by `BaseRepositoryDraft`
 * (which generates `DraftAdministrativeData_DraftUUID` when the caller omits it), and are never
 * required from the caller. `IsActiveEntity: false` is what identifies a row as a draft.
 *
 * @example
 * ```ts
 * const draft = await this.findOneDraft({ ID: 201, IsActiveEntity: false });
 * ```
 */
type DraftAdministrativeFields = {
  IsActiveEntity?: boolean | null;
  HasActiveEntity?: boolean | null;
  HasDraftEntity?: boolean | null;
  DraftAdministrativeData_DraftUUID?: string | null;
};

/**
 * Describes the callback CDS-QL hands over for an expanded association inside a column projection.
 *
 * @remarks
 * Used by the `.getExpand()` internals, where calling it with a column name exposes that column on the
 * expanded entity and calling it with `'*'` exposes all of them. A consumer of the builder never writes
 * it, it is exported for typing custom expand helpers.
 *
 * @example
 * ```ts
 * const exposeAll = (linkedEntity: AssociationFunction) => linkedEntity('*');
 * ```
 */
type AssociationFunction = (...args: unknown[]) => unknown;

/**
 * Describes what `create` / `createMany` (and their draft twins) resolve to : the executed `INSERT`
 * query, the persisted entries readable under `query.INSERT.entries`.
 *
 * @remarks
 * Mirrors the shape of the CDS insert result, so the entries handed to the database can be read back.
 * On the external service path the repository assembles the same shape from the remote responses, one
 * entry per `INSERT` sent.
 *
 * @example
 * ```ts
 * const created = await this.create({ title: 'The Raven', stock: 123 });
 * const [book] = created.query.INSERT.entries;
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#create | CDS-TS-Repository - create}
 */
type InsertResult<T> = {
  query: {
    INSERT: {
      entries: T[];
    };
  };
};

type LooseAutocomplete<T extends string> = T | Omit<string, T>;

/**
 * Describes the language code carried by the localized `.texts` rows.
 *
 * @remarks
 * Added to every row returned by `getLocaleTexts` and intersected with the keys of
 * `updateLocaleTexts`. The value autocompletes the ISO 639-1 codes while still accepting any string,
 * so region variants (E.g. `'de-CH'`) stay valid.
 *
 * @example
 * ```ts
 * const updated = await this.updateLocaleTexts({ locale: 'de', ID: 201 }, { title: 'Der Rabe' });
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#updatelocaletexts | CDS-TS-Repository - updateLocaleTexts}
 */
type Locale = {
  locale: LooseAutocomplete<LanguageCode>;
};

/**
 * Describes a column selection : one element name or an array of them.
 *
 * @remarks
 * The variadic parameter of `getDistinctColumns`, `getLocaleTexts`, `.columns()`, `.orderAsc()`,
 * `.orderDesc()`, `.groupBy()` and `.getExpand()`, which is what makes the spread form and the array
 * form interchangeable on all of them.
 *
 * @example
 * ```ts
 * await this.getDistinctColumns('currency_code', 'ID');
 * // or
 * await this.getDistinctColumns(['currency_code', 'ID']);
 * ```
 */
type Columns<T> = keyof T | (keyof T)[];

/**
 * Resolves a column selection to the element names the result is narrowed to.
 *
 * @remarks
 * Flattens the array form to its members and passes the spread form through, so
 * `Pick<T, ShowOnlyColumns<T, K>>` types the result of `.columns()` and `getDistinctColumns` down to
 * exactly what was asked for. A name which is not an element of `T` resolves to `never`.
 *
 * @example
 * ```ts
 * // results is typed as Pick<Book, 'ID' | 'title'>[]
 * const results = await this.builder().find().columns('ID', 'title').execute();
 * ```
 */
type ShowOnlyColumns<T, K> = K extends (keyof T)[] ? K[number] : K extends keyof T ? K : never;

/**
 * Describes the entry point of the chainable query API, returned by `.builder()` and `.builderDraft()`.
 *
 * @remarks
 * Only starts a query : `find` opens a `FindBuilder` over many rows, `findOne` a `FindOneBuilder` over a
 * single one, each keyed by plain keys or by a `Filter`. Nothing is sent to the database until a
 * terminal call (`.execute()`, `.executeAndCount()`, `.forEach()`, `.pipeline()`, `.stream()`).
 *
 * @example
 * ```ts
 * const results = await this.builder().find({ currency_code: 'GBP' }).orderAsc('title').execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#builder | CDS-TS-Repository - builder}
 */
type FindReturn<T> = {
  /**
   * Starts an unfiltered query over the whole table.
   *
   * @remarks
   * The chain stays inert until a terminal call, so ordering, pagination and column narrowing are all
   * applied before anything reaches the database.
   *
   * @returns A `FindBuilder` over every entry of the table.
   *
   * @example
   * ```ts
   * const results = await this.builder().find().execute();
   * ```
   */
  find(): FindBuilder<T, string>;

  /**
   * Starts a query filtered by the provided keys.
   *
   * @remarks
   * The keys are combined with `AND` and compared for equality only, use the `Filter` overload for
   * anything else.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A `FindBuilder` over the matching entries.
   *
   * @example
   * ```ts
   * const results = await this.builder().find({ name: 'Customer 1', company: 'home' }).execute();
   * ```
   */
  find<Keys extends Entry<T>>(keys: Entry<T>): FindBuilder<T, Keys>;

  /**
   * Starts a query filtered by a `Filter` instance.
   *
   * @remarks
   * Covers every operator `Filter` supports, including the combined, compound and association
   * (`'EXISTS'`) forms. The `Filter` is typed on the repository's own entity, so the rows keep that
   * type instead of the `Filter`'s : one built on an entity incompatible with it is a compile error.
   *
   * @param filter - A `Filter` instance describing the where clause.
   * @returns A `FindBuilder` over the matching entries.
   *
   * @example
   * ```ts
   * const filter = new Filter<Book>({ field: 'currency_code', operator: 'LIKE', value: 'GBP' });
   * const results = await this.builder().find(filter).execute();
   * ```
   */
  find(filter: Filter<T>): FindBuilder<T, string>;

  /**
   * Starts a query for a single entry filtered by the provided keys.
   *
   * @remarks
   * Builds a `SELECT.one`, so the terminal call resolves to one row or `undefined`. The returned
   * `FindOneBuilder` deliberately offers no ordering, grouping or pagination.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A `FindOneBuilder` over the single matching entry.
   *
   * @example
   * ```ts
   * const result = await this.builder().findOne({ name: 'Customer 1', company: 'home' }).execute();
   * ```
   */
  findOne<Keys extends Entry<T>>(keys: Entry<T>): FindOneBuilder<T, Keys>;

  /**
   * Starts a query for a single entry filtered by a `Filter` instance.
   *
   * @remarks
   * The first row matching the filter is returned, `undefined` when none does. The `Filter` is typed on
   * the repository's own entity, so the row keeps that type instead of the `Filter`'s : one built on an
   * entity incompatible with it is a compile error.
   *
   * @param filter - A `Filter` instance describing the where clause.
   * @returns A `FindOneBuilder` over the first matching entry.
   *
   * @example
   * ```ts
   * const filter = new Filter<Book>({ field: 'currency_code', operator: 'LIKE', value: 'GBP' });
   * const result = await this.builder().findOne(filter).execute();
   * ```
   */
  findOne(filter: Filter<T>): FindOneBuilder<T, string>;
};

// Start Filter types

/**
 * Constrains how two or more filters are combined.
 *
 * @example
 * ```ts
 * const combined = new Filter<Book>('OR', filterOne, filterTwo);
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#filter | CDS-TS-Repository - Filter}
 */
type LogicalOperator = 'AND' | 'OR';

type FilterOperatorWhenNoValue = 'IS NULL' | 'IS NOT NULL';

type FilterOperatorWhenSingleValue =
  | 'EQUALS'
  | 'NOT EQUAL'
  | 'LIKE'
  | 'STARTS_WITH'
  | 'ENDS_WITH'
  | 'LESS THAN'
  | 'LESS THAN OR EQUALS'
  | 'GREATER THAN'
  | 'GREATER THAN OR EQUALS';
type FilterOperatorWhenTwoValues = 'BETWEEN' | 'NOT BETWEEN';
type FilterOperatorWhenArrayValues = 'IN' | 'NOT IN';

/**
 * Operators asserting the existence of an association : they are applied on an association
 * element (and not on a value) and are translated to the CQL `exists` / `not exists` predicates.
 */
type FilterOperatorWhenAssociation = 'EXISTS' | 'NOT EXISTS';

/**
 * Constrains the operator of a `Filter` to the supported comparison, range, list, null and association
 * operators.
 *
 * @remarks
 * The operator picks which value members the filter options must carry : `value` for the comparison
 * operators, `value1` and `value2` for `'BETWEEN'` / `'NOT BETWEEN'`, an array `value` for `'IN'` /
 * `'NOT IN'`, none for `'IS NULL'` / `'IS NOT NULL'` and an optional inner `filters` for `'EXISTS'` /
 * `'NOT EXISTS'`. `'LIKE'`, `'STARTS_WITH'` and `'ENDS_WITH'` wrap the value in `%` themselves, so the
 * wildcards must NOT be passed in.
 *
 * @example
 * ```ts
 * const filter = new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 100 });
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#filter | CDS-TS-Repository - Filter}
 */
type FilterOperator =
  | FilterOperatorWhenSingleValue
  | FilterOperatorWhenTwoValues
  | FilterOperatorWhenArrayValues
  | FilterOperatorWhenNoValue
  | FilterOperatorWhenAssociation;

/**
 * Constrains the value a filter compares against.
 *
 * @remarks
 * `null` is part of the union on purpose : it is what `'IS NULL'` / `'IS NOT NULL'` set internally and
 * what `'NOT EQUAL'` compares against to select the non-null rows. The list operators (`'IN'`,
 * `'NOT IN'`) take a `string[]` / `number[]` instead.
 *
 * @example
 * ```ts
 * const filter = new Filter<Book>({ field: 'ID', operator: 'NOT EQUAL', value: null });
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#filter | CDS-TS-Repository - Filter}
 */
type FilterValue = string | number | null | boolean;

/**
 * Extracts the elements of `T` holding a value which a filter operator can be applied on.
 *
 * Everything is matched through its primitive type, which also keeps the key elements : the
 * `cds-typer` brands them as an intersection (`Key<number>` is `number & { ... }`) and the
 * date / time elements are generated as `string` types.
 */
type ValueKeys<T> = {
  [K in keyof T]-?: 0 extends 1 & T[K]
    ? never
    : NonNullable<T[K]> extends string | number | boolean | bigint
      ? K
      : never;
}[keyof T];

/**
 * Extracts the elements of `T` pointing to another entity : to-one associations (an object) and
 * to-many associations (an array of objects).
 *
 * Everything holding a value is left out : primitives, the primitive intersections branding the
 * key elements (`Key<number>` is `number & { ... }`), the streams behind the `LargeBinary`
 * elements, functions and the `Date` objects / binary buffers (`Uint8Array` also covers `Buffer`).
 *
 * Only ES lib types may be referenced here : a global from `@types/node` (E.g. `Buffer`) resolves
 * to an error type when the consumer has no Node typings loaded, which silently collapses this
 * type (and everything built on it, like `AssociationPath`) to `any`.
 *
 * The `0 extends 1 & T[K]` arm (here and in `ValueKeys`) drops the elements explicitly typed
 * `any` : a conditional on `any` takes both branches, so they would otherwise show up as
 * associations and leak `${string}` patterns into `AssociationPath`. An unresolvable element
 * type (E.g. the `import('stream').Readable` behind a `LargeBinary` element when the Node
 * typings are missing) cannot be guarded against : the checker's error type infects every
 * conditional touching it and collapses the union to `any`.
 */
type AssociationKeys<T> = {
  [K in keyof T]-?: 0 extends 1 & T[K]
    ? never
    : NonNullable<T[K]> extends string | number | boolean | bigint
      ? never
      : NonNullable<T[K]> extends Date | Uint8Array | ((...args: any[]) => any) | { pipe: (...args: any[]) => any }
        ? never
        : NonNullable<T[K]> extends object
          ? K
          : never;
}[keyof T];

/**
 * Extracts the elements of `T` pointing to a single entity (a non-array object), the only ones
 * which can be traversed with a path expression.
 */
type ToOneAssociationKeys<T> = {
  [K in AssociationKeys<T> & keyof T]: NonNullable<T[K]> extends readonly any[] ? never : K;
}[AssociationKeys<T> & keyof T];

/**
 * Resolves the entity behind an association element : the item type for a to-many association,
 * the object type itself for a to-one association.
 */
type AssociationTarget<Association> =
  NonNullable<Association> extends readonly (infer Item)[] ? Item : NonNullable<Association>;

/**
 * Dotted path expressions built from the to-one associations of `T` (E.g. `'author.name'`), the
 * leaf being a value element of the association target.
 *
 * Limited to a single hop on purpose, deeper paths would blow up on the circular entity types
 * generated by the `cds-typer`.
 */
type AssociationPath<T> = {
  [K in ToOneAssociationKeys<T> & keyof T & string]: `${K}.${Extract<ValueKeys<NonNullable<T[K]>>, string>}`;
}[ToOneAssociationKeys<T> & keyof T & string];

/**
 * Constrains the field of the value based filter operators to an element of `T` or to a one-hop path
 * expression across a to-one association of `T`.
 *
 * @remarks
 * Path expressions are limited to a single hop (E.g. `'author.name'`), deeper ones would blow up on the
 * circular entity types generated by the `cds-typer`. The association operators (`'EXISTS'`,
 * `'NOT EXISTS'`) do NOT use this type, they take the association element itself.
 *
 * @example
 * ```ts
 * const filter = new Filter<Book>({ field: 'author.name', operator: 'EQUALS', value: 'Edgar Allen Poe' });
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#filter | CDS-TS-Repository - Filter}
 */
type FilterField<T> = keyof T | AssociationPath<T>;

type FilterSingleValue = {
  operator: FilterOperatorWhenSingleValue;
  value: FilterValue;
};

type FilterBetween = {
  operator: FilterOperatorWhenTwoValues;
  value1: FilterValue;
  value2: FilterValue;
};

type FilterInAndNotIn = {
  operator: FilterOperatorWhenArrayValues;
  value: string[] | number[];
};

type FilterNoValue = {
  operator: FilterOperatorWhenNoValue;
};

/**
 * Filter options asserting the existence of an association of `T`.
 *
 * The `field` is restricted to the association elements of `T` and the optional `filters` is a
 * `Filter` typed on the entity behind that association, applied as an inner predicate
 * (E.g. `exists books[stock > 0]`). Omitting `filters` asserts the bare existence of the
 * association (E.g. `exists books`).
 */
type FilterExists<T> = {
  [K in AssociationKeys<T> & keyof T]: {
    field: K;
    operator: FilterOperatorWhenAssociation;
    filters?: Filter<AssociationTarget<T[K]>>;
  };
}[AssociationKeys<T> & keyof T];

/**
 * Describes the discriminated union accepted by the options constructor of `Filter`.
 *
 * @remarks
 * The `operator` discriminates which members are required, so picking one narrows the object literal
 * and a member belonging to another operator becomes a compile error. The association arm is the
 * exception to the `field` typing : it is restricted to the associations of `T` and its optional
 * `filters` is a `Filter` typed on the association target instead of on `T`.
 *
 * @example
 * ```ts
 * const between = new Filter<Book>({ field: 'stock', operator: 'BETWEEN', value1: 10, value2: 100 });
 * // the association arm, asserting that the author has books
 * const exists = new Filter<Author>({ field: 'books', operator: 'EXISTS' });
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#filter | CDS-TS-Repository - Filter}
 */
type FilterOptions<T> =
  | ({
      field: FilterField<T>;
    } & (FilterSingleValue | FilterBetween | FilterInAndNotIn | FilterNoValue))
  | FilterExists<T>;

/**
 * Describes the multidimensional filter array : filters, logical operators and nested arrays of both.
 *
 * @remarks
 * The parameter of the array constructor of `Filter`, where the operators sit BETWEEN the filters they
 * combine (E.g. `[filterOne, 'AND', filterTwo]`). Nesting an array groups its members, which is how
 * precedence is expressed.
 *
 * @example
 * ```ts
 * const filters = new Filter<Book>([filterOne, 'AND', filterTwo, 'OR', filterThree]);
 * const results = await this.find(filters);
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#filter | CDS-TS-Repository - Filter}
 */
type CompoundFilter<T> = (Filter<T> | LogicalOperator | CompoundFilter<T>)[];

// End Filter types

// Start .columnsFormatter types

/**
 * Constrains the aggregate functions applicable on a numeric column.
 *
 * @remarks
 * Offered on the `.columnsFormatter()` of `.find()` only : `.findOne()` narrows them away, as an
 * aggregate over a single row is meaningless. The formatted column is typed as `number`.
 *
 * @example
 * ```ts
 * const results = await this.builder().find()
 *   .columnsFormatter({ column: 'price', aggregate: 'AVG', renameAs: 'averagePrice' })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter | CDS-TS-Repository - columnsFormatter}
 */
type NumericAggregateFunctions =
  'AVG' | 'MIN' | 'MAX' | 'SUM' | 'ABS' | 'CEILING' | 'TOTAL' | 'COUNT' | 'ROUND' | 'FLOOR';

/**
 * Constrains the extraction functions applicable on a date / time column.
 *
 * @remarks
 * Each one extracts a single part out of the value, so the formatted column is typed as `number`.
 * Offered on both `.find()` and `.findOne()`.
 *
 * @example
 * ```ts
 * const results = await this.builder().find()
 *   .columnsFormatter({ column: 'createdAt', aggregate: 'YEAR', renameAs: 'createdYear' })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter | CDS-TS-Repository - columnsFormatter}
 */
type DateAggregateFunctions = 'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND';

// The single string column functions, split by the type the database returns for them
type StringReturningStringFunctions = 'LOWER' | 'UPPER' | 'TRIM';

type NumberReturningStringFunctions = 'LENGTH';

/**
 * Constrains the functions applicable on a single string column.
 *
 * @remarks
 * Offered on both `.find()` and `.findOne()`. The formatted column is typed out of the function applied
 * on it : `'LOWER'`, `'UPPER'` and `'TRIM'` produce a `string`, while `'LENGTH'` produces the `number`
 * of characters the database returns.
 *
 * @example
 * ```ts
 * const results = await this.builder().find()
 *   .columnsFormatter({ column: 'title', aggregate: 'UPPER', renameAs: 'titleUpper' })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter | CDS-TS-Repository - columnsFormatter}
 */
type StringAggregateFunctions = StringReturningStringFunctions | NumberReturningStringFunctions;

/**
 * Constrains the string functions taking two columns, currently only `'CONCAT'`.
 *
 * @remarks
 * Uses the `column1` / `column2` form instead of `column` and is emitted with a space between the two
 * columns. The formatted column is typed as `string`.
 *
 * @example
 * ```ts
 * const results = await this.builder().find()
 *   .columnsFormatter({ column1: 'title', column2: 'descr', aggregate: 'CONCAT', renameAs: 'summary' })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter | CDS-TS-Repository - columnsFormatter}
 */
type StringAggregateTwoColumnsFunctions = 'CONCAT';

/**
 * Constrains the temporal difference functions computing the distance between two date / time columns.
 *
 * @remarks
 * Introduced in recent `@sap/cds` releases : native on `HANA` and emulated by the other database
 * services (E.g. `@cap-js/sqlite`). Uses the `column1` / `column2` form and, unlike `'CONCAT'`, takes
 * its two columns directly without an interleaved separator. Each returns a numeric difference.
 *
 * @example
 * ```ts
 * const results = await this.builder().find()
 *   .columnsFormatter({ column1: 'dateOfBirth', column2: 'dateOfDeath', aggregate: 'DAYS_BETWEEN', renameAs: 'age' })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter | CDS-TS-Repository - columnsFormatter}
 */
type TemporalTwoColumnsFunctions = 'DAYS_BETWEEN' | 'MONTHS_BETWEEN' | 'YEARS_BETWEEN' | 'SECONDS_BETWEEN';

type AggregateNumberUsingColumn = {
  aggregate?: NumericAggregateFunctions;
};

type AggregateDateUsingColumn = {
  aggregate?: DateAggregateFunctions;
};

type AggregateStringUsingColumn = {
  aggregate?: StringAggregateFunctions;
};

type AggregateStringTwoColumnsUsingColumn<T> = {
  aggregate?: StringAggregateTwoColumnsFunctions;
  column1: keyof T;
  column2: keyof T;
  renameAs: string;
};

type AggregateTemporalTwoColumnsUsingColumn<T> = {
  aggregate: TemporalTwoColumnsFunctions;
  column1: keyof T;
  column2: keyof T;
  renameAs: string;
};

type BaseAggregateFields<T> = {
  renameAs: string;
  column: keyof T;
};

type BuilderTypes = 'FIND_ONE' | 'FIND';

type AggregateFields<T, K = BuilderTypes> =
  | (BaseAggregateFields<T> &
      /* 
        If it's 'findOne' then remove the AggregateNumberUsingColumn as this works only when we have more than 1 entry in the table
        If it's 'find' this means the result will have more than 1 item and we can apply 'AVG', 'MAX', 'MIN' ... 
       **/
      (K extends 'FIND_ONE'
        ? AggregateStringUsingColumn | AggregateDateUsingColumn
        : AggregateStringUsingColumn | AggregateNumberUsingColumn | AggregateDateUsingColumn))
  | AggregateStringTwoColumnsUsingColumn<T>
  | AggregateTemporalTwoColumnsUsingColumn<T>;

/**
 * Resolves the type of every formatted column out of the aggregate function applied on it.
 *
 * @remarks
 * Keyed by `renameAs` : the numeric, date and temporal functions produce a `number`, `'LENGTH'` a
 * `number` as well, the remaining string functions produce a `string` and a plain rename KEEPS the type
 * the renamed column has on the entity. The first generic parameter is the list of formatters, the
 * second the entity they are applied on.
 *
 * @example
 * ```ts
 * // { averagePrice: number }
 * type Formatted = DynamicColumnTypes<[{ column: 'price'; aggregate: 'AVG'; renameAs: 'averagePrice' }], Book>;
 * ```
 */
type DynamicColumnTypes<T extends AggregateFields<K>[], K> = {
  [Renamed in T[number]['renameAs']]: Renamed extends Extract<
    T[number],
    {
      aggregate:
        | NumericAggregateFunctions
        | DateAggregateFunctions
        | TemporalTwoColumnsFunctions
        | NumberReturningStringFunctions;
    }
  >['renameAs']
    ? number
    : Renamed extends Extract<
          T[number],
          { aggregate: StringReturningStringFunctions | StringAggregateTwoColumnsFunctions }
        >['renameAs']
      ? string
      : // Just renaming keeps the type the column has on the entity `K`
        Extract<T[number], { renameAs: Renamed }> extends { column: infer Column extends keyof K }
        ? K[Column]
        : string;
};

/**
 * Describes the list of column formatters accepted by `.columnsFormatter()`.
 *
 * @remarks
 * Every entry either renames a column (`column` plus `renameAs`), applies an aggregate on it, or
 * combines two columns (`column1` plus `column2`) with `'CONCAT'` or a temporal difference function.
 * The second generic parameter is the builder kind : `'FIND_ONE'` removes the numeric aggregates, which
 * only make sense over more than one row.
 *
 * @example
 * ```ts
 * const results = await this.builder().find()
 *   .columnsFormatter(
 *     { column: 'price', aggregate: 'AVG', renameAs: 'averagePrice' }, // aggregating
 *     { column: 'stock', renameAs: 'stockRenamed' }, // just renaming
 *   )
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter | CDS-TS-Repository - columnsFormatter}
 */
type ColumnFormatter<T, K = BuilderTypes> = AggregateFields<T, K>[];

/**
 * Adds the formatted columns of `K` to the entity type `T`.
 *
 * @remarks
 * The step behind `AppendColumns` : the renamed and aggregated columns are added as OPTIONAL members,
 * so a formatted column has to be null-checked before it is used.
 *
 * @example
 * ```ts
 * // Book & { averagePrice?: number }
 * type WithAverage = AddNewFields<Book, [{ column: 'price'; aggregate: 'AVG'; renameAs: 'averagePrice' }]>;
 * ```
 */
type AddNewFields<T, K extends ColumnFormatter<T>> = T & Partial<DynamicColumnTypes<K, T>>;

/**
 * Widens a tuple of column formatters to an array of its members.
 *
 * @remarks
 * The bridge between the `const` inferred tuple of `.columnsFormatter()` and `DynamicColumnTypes`,
 * which indexes the list with `[number]`.
 *
 * @example
 * ```ts
 * type Names = GetColumnNames<Book, [{ column: 'price'; aggregate: 'AVG'; renameAs: 'averagePrice' }]>;
 * ```
 */
type GetColumnNames<T, K extends ColumnFormatter<T>> = K[number][];

/**
 * Describes the entity type `.columnsFormatter()` returns : `T` plus its formatted columns.
 *
 * @remarks
 * The formatted columns are OPTIONAL and typed out of their aggregate (`number` for the numeric, date,
 * temporal and `'LENGTH'` functions, `string` for the remaining string ones and the original column type
 * for a plain rename), while every original element of `T` is kept — narrowing the result down to the
 * formatted columns only is the job of `.columns()`.
 *
 * @example
 * ```ts
 * // every Book element, plus an optional numeric averagePrice
 * const results = await this.builder().find()
 *   .columnsFormatter({ column: 'price', aggregate: 'AVG', renameAs: 'averagePrice' })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter | CDS-TS-Repository - columnsFormatter}
 */
type AppendColumns<T, K extends ColumnFormatter<T>> = T & AddNewFields<T, GetColumnNames<T, K>>;

// End .columnsFormatter types

// Start deep expand of getExpand method

type Unpacked<T> = T extends (infer U)[]
  ? { expand?: Expand<U>; select?: (keyof U)[] }
  : { expand?: Expand<T>; select?: (keyof T)[] };

/**
 * Describes the auto-expand depth of `.getExpand({ levels })`.
 *
 * @remarks
 * `levels` starts at 1 and expands every association of the entity that many hops deep, instead of
 * naming them one by one. Part of `Expand<T>`, which is why the depth form and the named form share the
 * same overload.
 *
 * @example
 * ```ts
 * const results = await this.builder().find().getExpand({ levels: 2 }).execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#getexpand | CDS-TS-Repository - getExpand}
 */
type AutoExpandLevels = { levels?: number };

/**
 * Describes the deep expand structure accepted by `.getExpand()`.
 *
 * @remarks
 * Every association of `T` may carry a `select` (the columns exposed on the expanded entity) and a
 * nested `expand`, recursively. An empty object expands the association with all of its columns, and
 * `.getExpand()` throws when no association at all is passed.
 *
 * @example
 * ```ts
 * const results = await this.builder().find()
 *   .getExpand({ author: {}, reviews: { select: ['ID'], expand: { reviewer: { select: ['ID'] } } } })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#getexpand | CDS-TS-Repository - getExpand}
 */
type Expand<T> = {
  [P in keyof T]: Unpacked<T[P]>;
} & AutoExpandLevels;

/**
 * Describes the normalized expand tree the `.getExpand()` internals walk.
 *
 * @remarks
 * The untyped counterpart of `Expand<T>`, the form the auto-expand depth is resolved into before the
 * column projection is built. A consumer passes `Expand<T>` instead, this one only types the helpers.
 *
 * @example
 * ```ts
 * const structure: ExpandStructure = { author: { select: ['ID'] } };
 * ```
 */
type ExpandStructure = Record<string, any>;

/**
 * Describes one node of an expand tree : the columns to expose and the expands nested below it.
 *
 * @remarks
 * The fully resolved counterpart of what a consumer writes per association in `.getExpand()`, where
 * both members are optional. Both are required here because the helpers only ever receive a node after
 * the structure was normalized.
 *
 * @example
 * ```ts
 * const node: ValueExpand = { select: ['ID', 'title'], expand: { author: { select: ['name'] } } };
 * ```
 */
type ValueExpand = {
  select: any[];
  expand: ExpandStructure;
};

// End deep expand of getExpand method

// Start increment/decrement types

/**
 * Extracts the numeric elements of `T`.
 *
 * @remarks
 * Constrains the `column` parameter of `increment` / `decrement` (and of their draft twins), so a
 * non-numeric element is rejected at compile time. The nullable numeric elements are kept, as the
 * `cds-typer` generates them as `number | null`.
 *
 * @example
 * ```ts
 * const success = await this.increment({ ID: 201 }, 'stock', 5);
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#increment | CDS-TS-Repository - increment}
 */
type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number | null | undefined ? K : never;
}[keyof T];

/**
 * Describes the numeric elements of `T` to move, mapped to the amount each one is moved by.
 *
 * @remarks
 * The second parameter of `incrementMany` / `decrementMany` (and of their draft twins) : every member
 * is optional and only the numeric elements are offered, so several counters can be moved in one
 * statement. The value is always the AMOUNT of the change, the direction comes from the method.
 *
 * @example
 * ```ts
 * const updated = await this.incrementMany({ status: 'active' }, { viewCount: 1, priority: 2 });
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#incrementmany | CDS-TS-Repository - incrementMany}
 */
type IncrementFields<T> = Partial<Record<NumericKeys<T>, number>>;

// End increment/decrement types

// Start .executeAndCount types

/**
 * Describes what `.executeAndCount()` resolves to : the rows of the query together with the total
 * number of rows matching it.
 *
 * @remarks
 * The `count` IGNORES the pagination : with `.paginate()` it is the total of the unpaginated query,
 * with `.groupBy()` the number of groups and with `.distinct` the number of distinct rows. `results` is
 * an empty array when nothing matched, never `undefined`.
 *
 * @example
 * ```ts
 * const { results, count } = await this.builder().find({ currency_code: 'GBP' })
 *   .paginate({ limit: 10 })
 *   .executeAndCount();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#executeandcount | CDS-TS-Repository - executeAndCount}
 */
type ExecuteAndCountResult<T> = {
  results: T[];
  count: number;
};

// End .executeAndCount types

export type {
  // Common
  ExternalServiceProps,
  ExternalServiceDescriptor,
  ExternalServiceBinding,
  BaseRepositoryConstructor,
  ExtractSingular,
  Entry,
  Draft,
  EntryDraft,
  Locale,
  InsertResult,
  DraftAdministrativeFields,
  /**
   * Re-export of the `@sap/cds` request object, the payload of a CAP event handler.
   *
   * @remarks
   * Re-exported so a repository does not have to import `@sap/cds` itself to type the request it
   * forwards into a repository method. Its members (`data`, `params`, `user`, `reject`, ...) are
   * documented by `@sap/cds`.
   *
   * @example
   * ```ts
   * public async byRequest(req: Request): Promise<Book[] | undefined> {
   *   return await this.find(req.data);
   * }
   * ```
   */
  Request,
  Columns,
  ShowOnlyColumns,
  Entries,
  DraftEntries,
  AssociationFunction,
  Entity,
  AutoExpandLevels,

  // Builder types
  FindReturn,
  FilterValue,
  LogicalOperator,
  FilterOperator,
  FilterOptions,
  FilterField,
  Expand,
  ValueExpand,
  ExpandStructure,
  CompoundFilter,
  ExecuteAndCountResult,

  // ColumnsFormatter types
  ColumnFormatter,
  AddNewFields,
  GetColumnNames,
  AppendColumns,
  DynamicColumnTypes,
  NumericAggregateFunctions,
  DateAggregateFunctions,
  StringAggregateFunctions,
  StringAggregateTwoColumnsFunctions,
  TemporalTwoColumnsFunctions,

  // Increment/Decrement types
  NumericKeys,
  IncrementFields,
};
