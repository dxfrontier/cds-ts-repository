// This is an automatically generated file. Please do not change its contents manually!
import * as _sap_common from './sap/common';
import * as __ from './_';

export type Language = __.Association.to<_sap_common.Language>;
export type Currency = __.Association.to<_sap_common.Currency>;
export type Country = __.Association.to<_sap_common.Country>;
export type Timezone = __.Association.to<_sap_common.Timezone>;
export type User = string;
// enum
export const Roles: {
  USER: 'USER';
  ADMIN: 'ADMIN';
};
export type Roles = 'USER' | 'ADMIN';

// enum
export const BookTypes: {
  BOOK_SIGNING: 'BOOK_SIGNING';
  AUTHOR_TALK: 'AUTHOR_TALK';
  BOOK_LUNCH: 'BOOK_LUNCH';
};
export type BookTypes = 'BOOK_SIGNING' | 'AUTHOR_TALK' | 'BOOK_LUNCH';

// the following represents the CDS aspect 'cuid'
export declare function _cuidAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    ID?: __.Key<string>;
  } & InstanceType<TBase>;
  readonly kind: 'aspect';
  readonly keys: __.KeysOf<cuid>;
  readonly elements: __.ElementsOf<cuid>;
  readonly actions: globalThis.Record<never, never>;
};
/**
 * Aspect for entities with canonical universal IDs
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-cuid
 */
export class cuid extends _cuidAspect(__.Entity) {}
/**
 * Aspect for entities with canonical universal IDs
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-cuid
 */
export class cuid_ extends Array<cuid> {
  $count?: number;
}
// the following represents the CDS aspect 'managed'
export declare function _managedAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    createdAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    createdBy?: User | null;
    modifiedAt?: __.CdsTimestamp | null;
    /** Canonical user ID */
    modifiedBy?: User | null;
  } & InstanceType<TBase>;
  readonly kind: 'aspect';
  readonly keys: __.KeysOf<managed>;
  readonly elements: __.ElementsOf<managed>;
  readonly actions: globalThis.Record<never, never>;
};
/**
 * Aspect to capture changes by user and name
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-managed
 */
export class managed extends _managedAspect(__.Entity) {}
/**
 * Aspect to capture changes by user and name
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-managed
 */
export class managed_ extends Array<managed> {
  $count?: number;
}
// the following represents the CDS aspect 'temporal'
export declare function _temporalAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    validFrom?: __.CdsTimestamp | null;
    validTo?: __.CdsTimestamp | null;
  } & InstanceType<TBase>;
  readonly kind: 'aspect';
  readonly keys: __.KeysOf<temporal>;
  readonly elements: __.ElementsOf<temporal>;
  readonly actions: globalThis.Record<never, never>;
};
/**
 * Aspect for entities with temporal data
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-temporal
 */
export class temporal extends _temporalAspect(__.Entity) {}
/**
 * Aspect for entities with temporal data
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-temporal
 */
export class temporal_ extends Array<temporal> {
  $count?: number;
}
// entity 'HelloRequest'
export declare function _HelloRequestAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    greeterName?: string | null;
    toName?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'type';
  readonly keys: __.KeysOf<HelloRequest>;
  readonly elements: __.ElementsOf<HelloRequest>;
  readonly actions: globalThis.Record<never, never>;
};
export class HelloRequest extends _HelloRequestAspect(__.Entity) {}

// entity 'HelloResponse'
export declare function _HelloResponseAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    greetingMessage?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'type';
  readonly keys: __.KeysOf<HelloResponse>;
  readonly elements: __.ElementsOf<HelloResponse>;
  readonly actions: globalThis.Record<never, never>;
};
export class HelloResponse extends _HelloResponseAspect(__.Entity) {}
