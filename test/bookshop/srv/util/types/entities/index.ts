// This is an automatically generated file. Please do not change its contents manually!
import * as _sap_common from './sap/common';
import * as __ from './_';
export type Language = __.Association.to<_sap_common.Language>;
export type Currency = __.Association.to<_sap_common.Currency>;
export type Country = __.Association.to<_sap_common.Country>;
export type User = string;
export type HelloRequest = {
  greeterName?: string | null;
  toName?: string | null;
};
export type HelloResponse = {
  greetingMessage?: string | null;
};
// enum
export const Roles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
export type Roles = 'USER' | 'ADMIN';

// the following represents the CDS aspect 'cuid'
export function _cuidAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class cuid extends Base {
    ID?: string | null;
    static actions: {};
  };
}
export class cuid extends _cuidAspect(__.Entity) {}
// the following represents the CDS aspect 'managed'
export function _managedAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class managed extends Base {
    createdAt?: string | null;
    /**
     * Canonical user ID
     */
    createdBy?: User | null;
    modifiedAt?: string | null;
    /**
     * Canonical user ID
     */
    modifiedBy?: User | null;
    static actions: {};
  };
}
export class managed extends _managedAspect(__.Entity) {}
// the following represents the CDS aspect 'temporal'
export function _temporalAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class temporal extends Base {
    validFrom?: string | null;
    validTo?: string | null;
    static actions: {};
  };
}
export class temporal extends _temporalAspect(__.Entity) {}
// the following represents the CDS aspect 'extensible'
export function _extensibleAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class extensible extends Base {
    extensions__?: string | null;
    static actions: {};
  };
}
export class extensible extends _extensibleAspect(__.Entity) {}
