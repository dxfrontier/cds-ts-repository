// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../_';
import * as _ from './../..';

export type Locale = string;
// the following represents the CDS aspect 'CodeList'
export declare function _CodeListAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    name?: string | null;
    descr?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'aspect';
  readonly keys: __.KeysOf<CodeList>;
  readonly elements: __.ElementsOf<CodeList>;
  readonly actions: globalThis.Record<never, never>;
};
/**
 * Aspect for a code list with name and description
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-codelist
 */
export class CodeList extends _CodeListAspect(__.Entity) {}
/**
 * Aspect for a code list with name and description
 *
 * See https://cap.cloud.sap/docs/cds/common#aspect-codelist
 */
export class CodeList_ extends Array<CodeList> {
  $count?: number;
}
// the following represents the CDS aspect 'TextsAspect'
export declare function _TextsAspectAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    /** Type for a language code */
    locale?: __.Key<Locale>;
  } & InstanceType<TBase>;
  readonly kind: 'aspect';
  readonly keys: __.KeysOf<TextsAspect>;
  readonly elements: __.ElementsOf<TextsAspect>;
  readonly actions: globalThis.Record<never, never>;
};
export class TextsAspect extends _TextsAspectAspect(__.Entity) {}
export class TextsAspect_ extends Array<TextsAspect> {
  $count?: number;
}
// the following represents the CDS aspect 'FlowHistory'
export declare function _FlowHistoryAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    transitions_?: __.Composition.of.many<
      Array<{
        timestamp?: __.Key<__.DeepRequired<_.managed>['createdAt']>;
        user?: __.DeepRequired<_.managed>['createdBy'] | null;
        status?: string | null;
        comment?: string | null;
      }>
    >;
  } & InstanceType<TBase>;
  readonly kind: 'aspect';
  readonly keys: __.KeysOf<FlowHistory>;
  readonly elements: __.ElementsOf<FlowHistory>;
  readonly actions: globalThis.Record<never, never>;
};
export class FlowHistory extends _FlowHistoryAspect(__.Entity) {}
export class FlowHistory_ extends Array<FlowHistory> {
  $count?: number;
}
// entity 'Language'
export declare function _LanguageAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    name?: string | null;
    descr?: string | null;
    /** Type for a language code */
    code?: __.Key<Locale>;
    texts?: __.Composition.of.many<Languages.texts>;
    localized?: __.Association.to<Languages.text> | null;
  } & InstanceType<ReturnType<typeof _CodeListAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Language>;
  readonly elements: __.ElementsOf<Language>;
  readonly actions: typeof CodeList.actions & globalThis.Record<never, never>;
};
/**
 * Code list for languages
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-languages
 */
export class Language extends _LanguageAspect(__.Entity) {}
/**
 * Code list for languages
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-languages
 */
export class Languages extends Array<Language> {
  $count?: number;
}

// entity 'Country'
export declare function _CountryAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    name?: string | null;
    descr?: string | null;
    code?: __.Key<string>;
    texts?: __.Composition.of.many<Countries.texts>;
    localized?: __.Association.to<Countries.text> | null;
  } & InstanceType<ReturnType<typeof _CodeListAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Country>;
  readonly elements: __.ElementsOf<Country>;
  readonly actions: typeof CodeList.actions & globalThis.Record<never, never>;
};
/**
 * Code list for countries
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-countries
 */
export class Country extends _CountryAspect(__.Entity) {}
/**
 * Code list for countries
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-countries
 */
export class Countries extends Array<Country> {
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
  } & InstanceType<ReturnType<typeof _CodeListAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Currency>;
  readonly elements: __.ElementsOf<Currency>;
  readonly actions: typeof CodeList.actions & globalThis.Record<never, never>;
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

// entity 'Timezone'
export declare function _TimezoneAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    name?: string | null;
    descr?: string | null;
    code?: __.Key<string>;
    texts?: __.Composition.of.many<Timezones.texts>;
    localized?: __.Association.to<Timezones.text> | null;
  } & InstanceType<ReturnType<typeof _CodeListAspect<TBase>>>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Timezone>;
  readonly elements: __.ElementsOf<Timezone>;
  readonly actions: typeof CodeList.actions & globalThis.Record<never, never>;
};
/**
 * Code list for time zones
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-timezones
 */
export class Timezone extends _TimezoneAspect(__.Entity) {}
/**
 * Code list for time zones
 *
 * See https://cap.cloud.sap/docs/cds/common#entity-timezones
 */
export class Timezones extends Array<Timezone> {
  $count?: number;
}

export namespace Languages {
  // entity 'text'
  export function _textAspect<TBase extends new (...args: any[]) => object>(
    Base: TBase,
  ): {
    new (...args: any[]): {
      /** Type for a language code */
      locale?: __.Key<Locale>;
      name?: string | null;
      descr?: string | null;
      /** Type for a language code */
      code?: __.Key<Locale>;
    } & InstanceType<ReturnType<typeof _TextsAspectAspect<TBase>>>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text> & typeof TextsAspect.keys;
    readonly elements: __.ElementsOf<text>;
    readonly actions: typeof TextsAspect.actions & globalThis.Record<never, never>;
  };
  export class text extends _textAspect(__.Entity) {}
  export class texts extends Array<text> {
    $count?: number;
  }
}
export namespace Countries {
  // entity 'text'
  export function _textAspect<TBase extends new (...args: any[]) => object>(
    Base: TBase,
  ): {
    new (...args: any[]): {
      /** Type for a language code */
      locale?: __.Key<Locale>;
      name?: string | null;
      descr?: string | null;
      code?: __.Key<string>;
    } & InstanceType<ReturnType<typeof _TextsAspectAspect<TBase>>>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text> & typeof TextsAspect.keys;
    readonly elements: __.ElementsOf<text>;
    readonly actions: typeof TextsAspect.actions & globalThis.Record<never, never>;
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
      locale?: __.Key<Locale>;
      name?: string | null;
      descr?: string | null;
      code?: __.Key<string>;
    } & InstanceType<ReturnType<typeof _TextsAspectAspect<TBase>>>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text> & typeof TextsAspect.keys;
    readonly elements: __.ElementsOf<text>;
    readonly actions: typeof TextsAspect.actions & globalThis.Record<never, never>;
  };
  export class text extends _textAspect(__.Entity) {}
  export class texts extends Array<text> {
    $count?: number;
  }
}
export namespace Timezones {
  // entity 'text'
  export function _textAspect<TBase extends new (...args: any[]) => object>(
    Base: TBase,
  ): {
    new (...args: any[]): {
      /** Type for a language code */
      locale?: __.Key<Locale>;
      name?: string | null;
      descr?: string | null;
      code?: __.Key<string>;
    } & InstanceType<ReturnType<typeof _TextsAspectAspect<TBase>>>;
    readonly kind: 'entity';
    readonly keys: __.KeysOf<text> & typeof TextsAspect.keys;
    readonly elements: __.ElementsOf<text>;
    readonly actions: typeof TextsAspect.actions & globalThis.Record<never, never>;
  };
  export class text extends _textAspect(__.Entity) {}
  export class texts extends Array<text> {
    $count?: number;
  }
}
