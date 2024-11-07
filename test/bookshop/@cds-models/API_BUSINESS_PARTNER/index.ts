// This is an automatically generated file. Please do not change its contents manually!
import cds from '@sap/cds'
import * as __ from './../_';

export class API_BUSINESS_PARTNER extends cds.Service {
}
export default API_BUSINESS_PARTNER

export function _A_AddressEmailAddressAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_AddressEmailAddress extends Base {
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare IsDefaultEmailAddress?: boolean | null
    declare EmailAddress?: string | null
    declare SearchEmailAddress?: string | null
    declare AddressCommunicationRemarkText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_AddressEmailAddress>;
    declare static readonly elements: __.ElementsOf<A_AddressEmailAddress>;
    static readonly actions: Record<never, never>;
  };
}
export class A_AddressEmailAddress extends _A_AddressEmailAddressAspect(__.Entity) {}
Object.defineProperty(A_AddressEmailAddress, 'name', { value: 'API_BUSINESS_PARTNER.A_AddressEmailAddress' })
Object.defineProperty(A_AddressEmailAddress, 'is_singular', { value: true })
export class A_AddressEmailAddress_ extends Array<A_AddressEmailAddress> {$count?: number}
Object.defineProperty(A_AddressEmailAddress_, 'name', { value: 'API_BUSINESS_PARTNER.A_AddressEmailAddress' })

export function _A_AddressFaxNumberAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_AddressFaxNumber extends Base {
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare IsDefaultFaxNumber?: boolean | null
    declare FaxCountry?: string | null
    declare FaxNumber?: string | null
    declare FaxNumberExtension?: string | null
    declare InternationalFaxNumber?: string | null
    declare AddressCommunicationRemarkText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_AddressFaxNumber>;
    declare static readonly elements: __.ElementsOf<A_AddressFaxNumber>;
    static readonly actions: Record<never, never>;
  };
}
export class A_AddressFaxNumber extends _A_AddressFaxNumberAspect(__.Entity) {}
Object.defineProperty(A_AddressFaxNumber, 'name', { value: 'API_BUSINESS_PARTNER.A_AddressFaxNumber' })
Object.defineProperty(A_AddressFaxNumber, 'is_singular', { value: true })
export class A_AddressFaxNumber_ extends Array<A_AddressFaxNumber> {$count?: number}
Object.defineProperty(A_AddressFaxNumber_, 'name', { value: 'API_BUSINESS_PARTNER.A_AddressFaxNumber' })

export function _A_AddressHomePageURLAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_AddressHomePageURL extends Base {
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare ValidityStartDate?: __.Key<__.CdsDate>
    declare IsDefaultURLAddress?: __.Key<boolean>
    declare SearchURLAddress?: string | null
    declare AddressCommunicationRemarkText?: string | null
    declare URLFieldLength?: number | null
    declare WebsiteURL?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_AddressHomePageURL>;
    declare static readonly elements: __.ElementsOf<A_AddressHomePageURL>;
    static readonly actions: Record<never, never>;
  };
}
export class A_AddressHomePageURL extends _A_AddressHomePageURLAspect(__.Entity) {}
Object.defineProperty(A_AddressHomePageURL, 'name', { value: 'API_BUSINESS_PARTNER.A_AddressHomePageURL' })
Object.defineProperty(A_AddressHomePageURL, 'is_singular', { value: true })
export class A_AddressHomePageURL_ extends Array<A_AddressHomePageURL> {$count?: number}
Object.defineProperty(A_AddressHomePageURL_, 'name', { value: 'API_BUSINESS_PARTNER.A_AddressHomePageURL' })

export function _A_AddressPhoneNumberAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_AddressPhoneNumber extends Base {
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare DestinationLocationCountry?: string | null
    declare IsDefaultPhoneNumber?: boolean | null
    declare PhoneNumber?: string | null
    declare PhoneNumberExtension?: string | null
    declare InternationalPhoneNumber?: string | null
    declare PhoneNumberType?: string | null
    declare AddressCommunicationRemarkText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_AddressPhoneNumber>;
    declare static readonly elements: __.ElementsOf<A_AddressPhoneNumber>;
    static readonly actions: Record<never, never>;
  };
}
export class A_AddressPhoneNumber extends _A_AddressPhoneNumberAspect(__.Entity) {}
Object.defineProperty(A_AddressPhoneNumber, 'name', { value: 'API_BUSINESS_PARTNER.A_AddressPhoneNumber' })
Object.defineProperty(A_AddressPhoneNumber, 'is_singular', { value: true })
export class A_AddressPhoneNumber_ extends Array<A_AddressPhoneNumber> {$count?: number}
Object.defineProperty(A_AddressPhoneNumber_, 'name', { value: 'API_BUSINESS_PARTNER.A_AddressPhoneNumber' })

export function _A_BPAddrDepdntIntlLocNumberAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPAddrDepdntIntlLocNumber extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare InternationalLocationNumber1?: string | null
    declare InternationalLocationNumber2?: string | null
    declare InternationalLocationNumber3?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPAddrDepdntIntlLocNumber>;
    declare static readonly elements: __.ElementsOf<A_BPAddrDepdntIntlLocNumber>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPAddrDepdntIntlLocNumber extends _A_BPAddrDepdntIntlLocNumberAspect(__.Entity) {}
Object.defineProperty(A_BPAddrDepdntIntlLocNumber, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddrDepdntIntlLocNumber' })
Object.defineProperty(A_BPAddrDepdntIntlLocNumber, 'is_singular', { value: true })
export class A_BPAddrDepdntIntlLocNumber_ extends Array<A_BPAddrDepdntIntlLocNumber> {$count?: number}
Object.defineProperty(A_BPAddrDepdntIntlLocNumber_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddrDepdntIntlLocNumber' })

export function _A_BPAddressIndependentEmailAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPAddressIndependentEmail extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare EmailAddress?: string | null
    declare IsDefaultEmailAddress?: boolean | null
    declare ValidityStartDate?: __.CdsDate | null
    declare ValidityEndDate?: __.CdsDate | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPAddressIndependentEmail>;
    declare static readonly elements: __.ElementsOf<A_BPAddressIndependentEmail>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPAddressIndependentEmail extends _A_BPAddressIndependentEmailAspect(__.Entity) {}
Object.defineProperty(A_BPAddressIndependentEmail, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentEmail' })
Object.defineProperty(A_BPAddressIndependentEmail, 'is_singular', { value: true })
export class A_BPAddressIndependentEmail_ extends Array<A_BPAddressIndependentEmail> {$count?: number}
Object.defineProperty(A_BPAddressIndependentEmail_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentEmail' })

export function _A_BPAddressIndependentFaxAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPAddressIndependentFax extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare FaxCountry?: string | null
    declare FaxAreaCodeSubscriberNumber?: string | null
    declare FaxNumberExtension?: string | null
    declare InternationalFaxNumber?: string | null
    declare IsDefaultFaxNumber?: boolean | null
    declare ValidityEndDate?: __.CdsDate | null
    declare ValidityStartDate?: __.CdsDate | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPAddressIndependentFax>;
    declare static readonly elements: __.ElementsOf<A_BPAddressIndependentFax>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPAddressIndependentFax extends _A_BPAddressIndependentFaxAspect(__.Entity) {}
Object.defineProperty(A_BPAddressIndependentFax, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentFax' })
Object.defineProperty(A_BPAddressIndependentFax, 'is_singular', { value: true })
export class A_BPAddressIndependentFax_ extends Array<A_BPAddressIndependentFax> {$count?: number}
Object.defineProperty(A_BPAddressIndependentFax_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentFax' })

export function _A_BPAddressIndependentMobileAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPAddressIndependentMobile extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare InternationalPhoneNumber?: string | null
    declare IsDefaultPhoneNumber?: boolean | null
    declare MobilePhoneCountry?: string | null
    declare MobilePhoneNumber?: string | null
    declare PhoneNumberExtension?: string | null
    declare PhoneNumberType?: string | null
    declare ValidityStartDate?: __.CdsDate | null
    declare ValidityEndDate?: __.CdsDate | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPAddressIndependentMobile>;
    declare static readonly elements: __.ElementsOf<A_BPAddressIndependentMobile>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPAddressIndependentMobile extends _A_BPAddressIndependentMobileAspect(__.Entity) {}
Object.defineProperty(A_BPAddressIndependentMobile, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentMobile' })
Object.defineProperty(A_BPAddressIndependentMobile, 'is_singular', { value: true })
export class A_BPAddressIndependentMobile_ extends Array<A_BPAddressIndependentMobile> {$count?: number}
Object.defineProperty(A_BPAddressIndependentMobile_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentMobile' })

export function _A_BPAddressIndependentPhoneAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPAddressIndependentPhone extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare DestinationLocationCountry?: string | null
    declare InternationalPhoneNumber?: string | null
    declare IsDefaultPhoneNumber?: boolean | null
    declare PhoneNumber?: string | null
    declare PhoneNumberExtension?: string | null
    declare PhoneNumberType?: string | null
    declare ValidityStartDate?: __.CdsDate | null
    declare ValidityEndDate?: __.CdsDate | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPAddressIndependentPhone>;
    declare static readonly elements: __.ElementsOf<A_BPAddressIndependentPhone>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPAddressIndependentPhone extends _A_BPAddressIndependentPhoneAspect(__.Entity) {}
Object.defineProperty(A_BPAddressIndependentPhone, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentPhone' })
Object.defineProperty(A_BPAddressIndependentPhone, 'is_singular', { value: true })
export class A_BPAddressIndependentPhone_ extends Array<A_BPAddressIndependentPhone> {$count?: number}
Object.defineProperty(A_BPAddressIndependentPhone_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentPhone' })

export function _A_BPAddressIndependentWebsiteAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPAddressIndependentWebsite extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare Person?: __.Key<string>
    declare OrdinalNumber?: __.Key<string>
    declare IsDefaultURLAddress?: boolean | null
    declare URLFieldLength?: number | null
    declare WebsiteURL?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPAddressIndependentWebsite>;
    declare static readonly elements: __.ElementsOf<A_BPAddressIndependentWebsite>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPAddressIndependentWebsite extends _A_BPAddressIndependentWebsiteAspect(__.Entity) {}
Object.defineProperty(A_BPAddressIndependentWebsite, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentWebsite' })
Object.defineProperty(A_BPAddressIndependentWebsite, 'is_singular', { value: true })
export class A_BPAddressIndependentWebsite_ extends Array<A_BPAddressIndependentWebsite> {$count?: number}
Object.defineProperty(A_BPAddressIndependentWebsite_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPAddressIndependentWebsite' })

export function _A_BPContactToAddressAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPContactToAddress extends Base {
    declare RelationshipNumber?: __.Key<string>
    declare BusinessPartnerCompany?: __.Key<string>
    declare BusinessPartnerPerson?: __.Key<string>
    declare ValidityEndDate?: __.Key<__.CdsDate>
    declare AddressID?: __.Key<string>
    declare AddressNumber?: string | null
    declare AdditionalStreetPrefixName?: string | null
    declare AdditionalStreetSuffixName?: string | null
    declare AddressTimeZone?: string | null
    declare CareOfName?: string | null
    declare CityCode?: string | null
    declare CityName?: string | null
    declare CompanyPostalCode?: string | null
    declare Country?: string | null
    declare County?: string | null
    declare DeliveryServiceNumber?: string | null
    declare DeliveryServiceTypeCode?: string | null
    declare District?: string | null
    declare FormOfAddress?: string | null
    declare FullName?: string | null
    declare HomeCityName?: string | null
    declare HouseNumber?: string | null
    declare HouseNumberSupplementText?: string | null
    declare Language?: string | null
    declare POBox?: string | null
    declare POBoxDeviatingCityName?: string | null
    declare POBoxDeviatingCountry?: string | null
    declare POBoxDeviatingRegion?: string | null
    declare POBoxIsWithoutNumber?: boolean | null
    declare POBoxLobbyName?: string | null
    declare POBoxPostalCode?: string | null
    declare Person?: string | null
    declare PostalCode?: string | null
    declare PrfrdCommMediumType?: string | null
    declare Region?: string | null
    declare StreetName?: string | null
    declare StreetPrefixName?: string | null
    declare StreetSuffixName?: string | null
    declare TaxJurisdiction?: string | null
    declare TransportZone?: string | null
    declare AddressRepresentationCode?: string | null
    declare ContactPersonBuilding?: string | null
    declare ContactPersonPrfrdCommMedium?: string | null
    declare ContactRelationshipDepartment?: string | null
    declare ContactRelationshipFunction?: string | null
    declare CorrespondenceShortName?: string | null
    declare Floor?: string | null
    declare InhouseMail?: string | null
    declare IsDefaultAddress?: boolean | null
    declare RoomNumber?: string | null
    declare to_EmailAddress?: __.Association.to.many<A_AddressEmailAddress_>
    declare to_FaxNumber?: __.Association.to.many<A_AddressFaxNumber_>
    declare to_MobilePhoneNumber?: __.Association.to.many<A_AddressPhoneNumber_>
    declare to_PhoneNumber?: __.Association.to.many<A_AddressPhoneNumber_>
    declare to_URLAddress?: __.Association.to.many<A_AddressHomePageURL_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPContactToAddress>;
    declare static readonly elements: __.ElementsOf<A_BPContactToAddress>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPContactToAddress extends _A_BPContactToAddressAspect(__.Entity) {}
Object.defineProperty(A_BPContactToAddress, 'name', { value: 'API_BUSINESS_PARTNER.A_BPContactToAddress' })
Object.defineProperty(A_BPContactToAddress, 'is_singular', { value: true })
export class A_BPContactToAddress_ extends Array<A_BPContactToAddress> {$count?: number}
Object.defineProperty(A_BPContactToAddress_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPContactToAddress' })

export function _A_BPContactToFuncAndDeptAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPContactToFuncAndDept extends Base {
    declare RelationshipNumber?: __.Key<string>
    declare BusinessPartnerCompany?: __.Key<string>
    declare BusinessPartnerPerson?: __.Key<string>
    declare ValidityEndDate?: __.Key<__.CdsDate>
    declare ContactPersonAuthorityType?: string | null
    declare ContactPersonDepartment?: string | null
    declare ContactPersonDepartmentName?: string | null
    declare ContactPersonFunction?: string | null
    declare ContactPersonFunctionName?: string | null
    declare ContactPersonRemarkText?: string | null
    declare ContactPersonVIPType?: string | null
    declare EmailAddress?: string | null
    declare FaxNumber?: string | null
    declare FaxNumberExtension?: string | null
    declare PhoneNumber?: string | null
    declare PhoneNumberExtension?: string | null
    declare RelationshipCategory?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPContactToFuncAndDept>;
    declare static readonly elements: __.ElementsOf<A_BPContactToFuncAndDept>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPContactToFuncAndDept extends _A_BPContactToFuncAndDeptAspect(__.Entity) {}
Object.defineProperty(A_BPContactToFuncAndDept, 'name', { value: 'API_BUSINESS_PARTNER.A_BPContactToFuncAndDept' })
Object.defineProperty(A_BPContactToFuncAndDept, 'is_singular', { value: true })
export class A_BPContactToFuncAndDept_ extends Array<A_BPContactToFuncAndDept> {$count?: number}
Object.defineProperty(A_BPContactToFuncAndDept_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPContactToFuncAndDept' })

export function _A_BPCreditWorthinessAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPCreditWorthiness extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BusPartCreditStanding?: string | null
    declare BPCreditStandingStatus?: string | null
    declare CreditRatingAgency?: string | null
    declare BPCreditStandingComment?: string | null
    declare BPCreditStandingDate?: __.CdsDate | null
    declare BPCreditStandingRating?: string | null
    declare BPLegalProceedingStatus?: string | null
    declare BPLglProceedingInitiationDate?: __.CdsDate | null
    declare BusinessPartnerIsUnderOath?: boolean | null
    declare BusinessPartnerOathDate?: __.CdsDate | null
    declare BusinessPartnerIsBankrupt?: boolean | null
    declare BusinessPartnerBankruptcyDate?: __.CdsDate | null
    declare BPForeclosureIsInitiated?: boolean | null
    declare BPForeclosureDate?: __.CdsDate | null
    declare BPCrdtWrthnssAccessChkIsActive?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPCreditWorthiness>;
    declare static readonly elements: __.ElementsOf<A_BPCreditWorthiness>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPCreditWorthiness extends _A_BPCreditWorthinessAspect(__.Entity) {}
Object.defineProperty(A_BPCreditWorthiness, 'name', { value: 'API_BUSINESS_PARTNER.A_BPCreditWorthiness' })
Object.defineProperty(A_BPCreditWorthiness, 'is_singular', { value: true })
export class A_BPCreditWorthiness_ extends Array<A_BPCreditWorthiness> {$count?: number}
Object.defineProperty(A_BPCreditWorthiness_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPCreditWorthiness' })

export function _A_BPDataControllerAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPDataController extends Base {
    declare BusinessPartner?: __.Key<string>
    declare DataController?: __.Key<string>
    declare PurposeForPersonalData?: __.Key<string>
    declare DataControlAssignmentStatus?: string | null
    declare BPDataControllerIsDerived?: string | null
    declare PurposeDerived?: string | null
    declare PurposeType?: string | null
    declare BusinessPurposeFlag?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPDataController>;
    declare static readonly elements: __.ElementsOf<A_BPDataController>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPDataController extends _A_BPDataControllerAspect(__.Entity) {}
Object.defineProperty(A_BPDataController, 'name', { value: 'API_BUSINESS_PARTNER.A_BPDataController' })
Object.defineProperty(A_BPDataController, 'is_singular', { value: true })
export class A_BPDataController_ extends Array<A_BPDataController> {$count?: number}
Object.defineProperty(A_BPDataController_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPDataController' })

export function _A_BPEmploymentAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPEmployment extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BPEmploymentStartDate?: __.Key<__.CdsDate>
    declare BPEmploymentEndDate?: __.CdsDate | null
    declare BPEmploymentStatus?: string | null
    declare BusPartEmplrIndstryCode?: string | null
    declare BusinessPartnerEmployerName?: string | null
    declare BusinessPartnerOccupationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPEmployment>;
    declare static readonly elements: __.ElementsOf<A_BPEmployment>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPEmployment extends _A_BPEmploymentAspect(__.Entity) {}
Object.defineProperty(A_BPEmployment, 'name', { value: 'API_BUSINESS_PARTNER.A_BPEmployment' })
Object.defineProperty(A_BPEmployment, 'is_singular', { value: true })
export class A_BPEmployment_ extends Array<A_BPEmployment> {$count?: number}
Object.defineProperty(A_BPEmployment_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPEmployment' })

export function _A_BPFinancialServicesExtnAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPFinancialServicesExtn extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BusinessPartnerIsVIP?: boolean | null
    declare TradingPartner?: string | null
    declare FactoryCalendar?: string | null
    declare BusinessPartnerOfficeCountry?: string | null
    declare BusinessPartnerOfficeRegion?: string | null
    declare BPRegisteredOfficeName?: string | null
    declare BPBalanceSheetCurrency?: string | null
    declare BPLastCptlIncrAmtInBalShtCrcy?: number | null
    declare BPLastCapitalIncreaseYear?: string | null
    declare BPBalanceSheetDisplayType?: string | null
    declare BusinessPartnerCitizenship?: string | null
    declare BPMaritalPropertyRegime?: string | null
    declare BusinessPartnerIncomeCurrency?: string | null
    declare BPNumberOfChildren?: number | null
    declare BPNumberOfHouseholdMembers?: number | null
    declare BPAnnualNetIncAmtInIncomeCrcy?: number | null
    declare BPMonthlyNetIncAmtInIncomeCrcy?: number | null
    declare BPAnnualNetIncomeYear?: string | null
    declare BPMonthlyNetIncomeMonth?: string | null
    declare BPMonthlyNetIncomeYear?: string | null
    declare BPPlaceOfDeathName?: string | null
    declare CustomerIsUnwanted?: boolean | null
    declare UndesirabilityReason?: string | null
    declare UndesirabilityComment?: string | null
    declare LastCustomerContactDate?: __.CdsDate | null
    declare BPGroupingCharacter?: string | null
    declare BPLetterSalutation?: string | null
    declare BusinessPartnerTargetGroup?: string | null
    declare BusinessPartnerEmployeeGroup?: string | null
    declare BusinessPartnerIsEmployee?: boolean | null
    declare BPTermnBusRelationsBankDate?: __.CdsDate | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPFinancialServicesExtn>;
    declare static readonly elements: __.ElementsOf<A_BPFinancialServicesExtn>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPFinancialServicesExtn extends _A_BPFinancialServicesExtnAspect(__.Entity) {}
Object.defineProperty(A_BPFinancialServicesExtn, 'name', { value: 'API_BUSINESS_PARTNER.A_BPFinancialServicesExtn' })
Object.defineProperty(A_BPFinancialServicesExtn, 'is_singular', { value: true })
export class A_BPFinancialServicesExtn_ extends Array<A_BPFinancialServicesExtn> {$count?: number}
Object.defineProperty(A_BPFinancialServicesExtn_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPFinancialServicesExtn' })

export function _A_BPFinancialServicesReportingAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPFinancialServicesReporting extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BPIsNonResident?: boolean | null
    declare BPNonResidencyStartDate?: __.CdsDate | null
    declare BPIsMultimillionLoanRecipient?: boolean | null
    declare BPLoanReportingBorrowerNumber?: string | null
    declare BPLoanRptgBorrowerEntityNumber?: string | null
    declare BPCreditStandingReview?: string | null
    declare BPCreditStandingReviewDate?: __.CdsDate | null
    declare BusinessPartnerLoanToManager?: string | null
    declare BPCompanyRelationship?: string | null
    declare BPLoanReportingCreditorNumber?: string | null
    declare BPOeNBIdentNumber?: string | null
    declare BPOeNBTargetGroup?: string | null
    declare BPOeNBIdentNumberAssigned?: string | null
    declare BPOeNBInstituteNumber?: string | null
    declare BusinessPartnerIsOeNBInstitute?: boolean | null
    declare BusinessPartnerGroup?: string | null
    declare BPGroupAssignmentCategory?: string | null
    declare BusinessPartnerGroupName?: string | null
    declare BusinessPartnerLegalEntity?: string | null
    declare BPGerAstRglnRestrictedAstQuota?: string | null
    declare BusinessPartnerDebtorGroup?: string | null
    declare BusinessPartnerBusinessPurpose?: string | null
    declare BusinessPartnerRiskGroup?: string | null
    declare BPRiskGroupingDate?: __.CdsDate | null
    declare BPHasGroupAffiliation?: boolean | null
    declare BPIsMonetaryFinInstitution?: boolean | null
    declare BPCrdtStandingReviewIsRequired?: boolean | null
    declare BPLoanMonitoringIsRequired?: boolean | null
    declare BPHasCreditingRelief?: boolean | null
    declare BPInvestInRstrcdAstIsAuthzd?: boolean | null
    declare BPCentralBankCountryRegion?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPFinancialServicesReporting>;
    declare static readonly elements: __.ElementsOf<A_BPFinancialServicesReporting>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPFinancialServicesReporting extends _A_BPFinancialServicesReportingAspect(__.Entity) {}
Object.defineProperty(A_BPFinancialServicesReporting, 'name', { value: 'API_BUSINESS_PARTNER.A_BPFinancialServicesReporting' })
Object.defineProperty(A_BPFinancialServicesReporting, 'is_singular', { value: true })
export class A_BPFinancialServicesReporting_ extends Array<A_BPFinancialServicesReporting> {$count?: number}
Object.defineProperty(A_BPFinancialServicesReporting_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPFinancialServicesReporting' })

export function _A_BPFiscalYearInformationAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPFiscalYearInformation extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BusinessPartnerFiscalYear?: __.Key<string>
    declare BPBalanceSheetCurrency?: string | null
    declare BPAnnualStockholderMeetingDate?: __.CdsDate | null
    declare BPFiscalYearStartDate?: __.CdsDate | null
    declare BPFiscalYearEndDate?: __.CdsDate | null
    declare BPFiscalYearIsClosed?: boolean | null
    declare BPFiscalYearClosingDate?: __.CdsDate | null
    declare BPFsclYrCnsldtdFinStatementDte?: __.CdsDate | null
    declare BPCapitalStockAmtInBalShtCrcy?: number | null
    declare BPIssdStockCptlAmtInBalShtCrcy?: number | null
    declare BPPartcipnCertAmtInBalShtCrcy?: number | null
    declare BPEquityCapitalAmtInBalShtCrcy?: number | null
    declare BPGrossPremiumAmtInBalShtCrcy?: number | null
    declare BPNetPremiumAmtInBalShtCrcy?: number | null
    declare BPAnnualSalesAmtInBalShtCrcy?: number | null
    declare BPAnnualNetIncAmtInBalShtCrcy?: number | null
    declare BPDividendDistrAmtInBalShtCrcy?: number | null
    declare BPDebtRatioInYears?: number | null
    declare BPAnnualPnLAmtInBalShtCrcy?: number | null
    declare BPBalSheetTotalAmtInBalShtCrcy?: number | null
    declare BPNumberOfEmployees?: string | null
    declare BPCptlReserveAmtInBalShtCrcy?: number | null
    declare BPLglRevnRsrvAmtInBalShtCrcy?: number | null
    declare RevnRsrvOwnStkAmtInBalShtCrcy?: number | null
    declare BPStatryReserveAmtInBalShtCrcy?: number | null
    declare BPOthRevnRsrvAmtInBalShtCrcy?: number | null
    declare BPPnLCarryfwdAmtInBalShtCrcy?: number | null
    declare BPSuborddLbltyAmtInBalShtCrcy?: number | null
    declare BPRetOnTotalCptlEmpldInPercent?: number | null
    declare BPDebtClearancePeriodInYears?: number | null
    declare BPFinancingCoeffInPercent?: number | null
    declare BPEquityRatioInPercent?: number | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPFiscalYearInformation>;
    declare static readonly elements: __.ElementsOf<A_BPFiscalYearInformation>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPFiscalYearInformation extends _A_BPFiscalYearInformationAspect(__.Entity) {}
Object.defineProperty(A_BPFiscalYearInformation, 'name', { value: 'API_BUSINESS_PARTNER.A_BPFiscalYearInformation' })
Object.defineProperty(A_BPFiscalYearInformation, 'is_singular', { value: true })
export class A_BPFiscalYearInformation_ extends Array<A_BPFiscalYearInformation> {$count?: number}
Object.defineProperty(A_BPFiscalYearInformation_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPFiscalYearInformation' })

export function _A_BPIntlAddressVersionAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPIntlAddressVersion extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare AddressRepresentationCode?: __.Key<string>
    declare AddresseeFullName?: string | null
    declare AddressIDByExternalSystem?: string | null
    declare AddressPersonID?: string | null
    declare AddressSearchTerm1?: string | null
    declare AddressSearchTerm2?: string | null
    declare AddressTimeZone?: string | null
    declare CareOfName?: string | null
    declare CityName?: string | null
    declare CityNumber?: string | null
    declare CompanyPostalCode?: string | null
    declare Country?: string | null
    declare DeliveryServiceNumber?: string | null
    declare DeliveryServiceTypeCode?: string | null
    declare DistrictName?: string | null
    declare FormOfAddress?: string | null
    declare HouseNumber?: string | null
    declare HouseNumberSupplementText?: string | null
    declare Language?: string | null
    declare OrganizationName1?: string | null
    declare OrganizationName2?: string | null
    declare OrganizationName3?: string | null
    declare OrganizationName4?: string | null
    declare PersonFamilyName?: string | null
    declare PersonGivenName?: string | null
    declare POBox?: string | null
    declare POBoxDeviatingCityName?: string | null
    declare POBoxDeviatingCountry?: string | null
    declare POBoxDeviatingRegion?: string | null
    declare POBoxIsWithoutNumber?: boolean | null
    declare POBoxLobbyName?: string | null
    declare POBoxPostalCode?: string | null
    declare PostalCode?: string | null
    declare PrfrdCommMediumType?: string | null
    declare Region?: string | null
    declare SecondaryRegion?: string | null
    declare SecondaryRegionName?: string | null
    declare StreetName?: string | null
    declare StreetPrefixName1?: string | null
    declare StreetPrefixName2?: string | null
    declare StreetSuffixName1?: string | null
    declare StreetSuffixName2?: string | null
    declare TaxJurisdiction?: string | null
    declare TertiaryRegion?: string | null
    declare TertiaryRegionName?: string | null
    declare TransportZone?: string | null
    declare VillageName?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPIntlAddressVersion>;
    declare static readonly elements: __.ElementsOf<A_BPIntlAddressVersion>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPIntlAddressVersion extends _A_BPIntlAddressVersionAspect(__.Entity) {}
Object.defineProperty(A_BPIntlAddressVersion, 'name', { value: 'API_BUSINESS_PARTNER.A_BPIntlAddressVersion' })
Object.defineProperty(A_BPIntlAddressVersion, 'is_singular', { value: true })
export class A_BPIntlAddressVersion_ extends Array<A_BPIntlAddressVersion> {$count?: number}
Object.defineProperty(A_BPIntlAddressVersion_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPIntlAddressVersion' })

export function _A_BPRelationshipAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BPRelationship extends Base {
    declare RelationshipNumber?: __.Key<string>
    declare BusinessPartner1?: __.Key<string>
    declare BusinessPartner2?: __.Key<string>
    declare ValidityEndDate?: __.Key<__.CdsDate>
    declare ValidityStartDate?: __.CdsDate | null
    declare IsStandardRelationship?: boolean | null
    declare RelationshipCategory?: string | null
    declare BPRelationshipType?: string | null
    declare CreatedByUser?: string | null
    declare CreationDate?: __.CdsDate | null
    declare CreationTime?: __.CdsTime | null
    declare LastChangedByUser?: string | null
    declare LastChangeDate?: __.CdsDate | null
    declare LastChangeTime?: __.CdsTime | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BPRelationship>;
    declare static readonly elements: __.ElementsOf<A_BPRelationship>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BPRelationship extends _A_BPRelationshipAspect(__.Entity) {}
Object.defineProperty(A_BPRelationship, 'name', { value: 'API_BUSINESS_PARTNER.A_BPRelationship' })
Object.defineProperty(A_BPRelationship, 'is_singular', { value: true })
export class A_BPRelationship_ extends Array<A_BPRelationship> {$count?: number}
Object.defineProperty(A_BPRelationship_, 'name', { value: 'API_BUSINESS_PARTNER.A_BPRelationship' })

export function _A_BuPaAddressUsageAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BuPaAddressUsage extends Base {
    declare BusinessPartner?: __.Key<string>
    declare ValidityEndDate?: __.Key<__.CdsDateTime>
    declare AddressUsage?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare ValidityStartDate?: __.CdsDateTime | null
    declare StandardUsage?: boolean | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BuPaAddressUsage>;
    declare static readonly elements: __.ElementsOf<A_BuPaAddressUsage>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BuPaAddressUsage extends _A_BuPaAddressUsageAspect(__.Entity) {}
Object.defineProperty(A_BuPaAddressUsage, 'name', { value: 'API_BUSINESS_PARTNER.A_BuPaAddressUsage' })
Object.defineProperty(A_BuPaAddressUsage, 'is_singular', { value: true })
export class A_BuPaAddressUsage_ extends Array<A_BuPaAddressUsage> {$count?: number}
Object.defineProperty(A_BuPaAddressUsage_, 'name', { value: 'API_BUSINESS_PARTNER.A_BuPaAddressUsage' })

export function _A_BuPaIdentificationAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BuPaIdentification extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BPIdentificationType?: __.Key<string>
    declare BPIdentificationNumber?: __.Key<string>
    declare BPIdnNmbrIssuingInstitute?: string | null
    declare BPIdentificationEntryDate?: __.CdsDate | null
    declare Country?: string | null
    declare Region?: string | null
    declare ValidityStartDate?: __.CdsDate | null
    declare ValidityEndDate?: __.CdsDate | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BuPaIdentification>;
    declare static readonly elements: __.ElementsOf<A_BuPaIdentification>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BuPaIdentification extends _A_BuPaIdentificationAspect(__.Entity) {}
Object.defineProperty(A_BuPaIdentification, 'name', { value: 'API_BUSINESS_PARTNER.A_BuPaIdentification' })
Object.defineProperty(A_BuPaIdentification, 'is_singular', { value: true })
export class A_BuPaIdentification_ extends Array<A_BuPaIdentification> {$count?: number}
Object.defineProperty(A_BuPaIdentification_, 'name', { value: 'API_BUSINESS_PARTNER.A_BuPaIdentification' })

export function _A_BuPaIndustryAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BuPaIndustry extends Base {
    declare IndustrySector?: __.Key<string>
    declare IndustrySystemType?: __.Key<string>
    declare BusinessPartner?: __.Key<string>
    declare IsStandardIndustry?: string | null
    declare IndustryKeyDescription?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BuPaIndustry>;
    declare static readonly elements: __.ElementsOf<A_BuPaIndustry>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BuPaIndustry extends _A_BuPaIndustryAspect(__.Entity) {}
Object.defineProperty(A_BuPaIndustry, 'name', { value: 'API_BUSINESS_PARTNER.A_BuPaIndustry' })
Object.defineProperty(A_BuPaIndustry, 'is_singular', { value: true })
export class A_BuPaIndustry_ extends Array<A_BuPaIndustry> {$count?: number}
Object.defineProperty(A_BuPaIndustry_, 'name', { value: 'API_BUSINESS_PARTNER.A_BuPaIndustry' })

export function _A_BusinessPartnerAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartner extends Base {
    declare BusinessPartner?: __.Key<string>
    declare Customer?: string | null
    declare Supplier?: string | null
    declare AcademicTitle?: string | null
    declare AuthorizationGroup?: string | null
    declare BusinessPartnerCategory?: string | null
    declare BusinessPartnerFullName?: string | null
    declare BusinessPartnerGrouping?: string | null
    declare BusinessPartnerName?: string | null
    declare BusinessPartnerUUID?: string | null
    declare CorrespondenceLanguage?: string | null
    declare CreatedByUser?: string | null
    declare CreationDate?: __.CdsDate | null
    declare CreationTime?: __.CdsTime | null
    declare FirstName?: string | null
    declare FormOfAddress?: string | null
    declare Industry?: string | null
    declare InternationalLocationNumber1?: string | null
    declare InternationalLocationNumber2?: string | null
    declare IsFemale?: boolean | null
    declare IsMale?: boolean | null
    declare IsNaturalPerson?: string | null
    declare IsSexUnknown?: boolean | null
    declare GenderCodeName?: string | null
    declare Language?: string | null
    declare LastChangeDate?: __.CdsDate | null
    declare LastChangeTime?: __.CdsTime | null
    declare LastChangedByUser?: string | null
    declare LastName?: string | null
    declare LegalForm?: string | null
    declare OrganizationBPName1?: string | null
    declare OrganizationBPName2?: string | null
    declare OrganizationBPName3?: string | null
    declare OrganizationBPName4?: string | null
    declare OrganizationFoundationDate?: __.CdsDate | null
    declare OrganizationLiquidationDate?: __.CdsDate | null
    declare SearchTerm1?: string | null
    declare SearchTerm2?: string | null
    declare AdditionalLastName?: string | null
    declare BirthDate?: __.CdsDate | null
    declare BusinessPartnerBirthDateStatus?: string | null
    declare BusinessPartnerBirthplaceName?: string | null
    declare BusinessPartnerDeathDate?: __.CdsDate | null
    declare BusinessPartnerIsBlocked?: boolean | null
    declare BusinessPartnerType?: string | null
    declare ETag?: string | null
    declare GroupBusinessPartnerName1?: string | null
    declare GroupBusinessPartnerName2?: string | null
    declare IndependentAddressID?: string | null
    declare InternationalLocationNumber3?: string | null
    declare MiddleName?: string | null
    declare NameCountry?: string | null
    declare NameFormat?: string | null
    declare PersonFullName?: string | null
    declare PersonNumber?: string | null
    declare IsMarkedForArchiving?: boolean | null
    declare BusinessPartnerIDByExtSystem?: string | null
    declare BusinessPartnerPrintFormat?: string | null
    declare BusinessPartnerOccupation?: string | null
    declare BusPartMaritalStatus?: string | null
    declare BusPartNationality?: string | null
    declare BusinessPartnerBirthName?: string | null
    declare BusinessPartnerSupplementName?: string | null
    declare NaturalPersonEmployerName?: string | null
    declare LastNamePrefix?: string | null
    declare LastNameSecondPrefix?: string | null
    declare Initials?: string | null
    declare BPDataControllerIsNotRequired?: boolean | null
    declare TradingPartner?: string | null
    declare to_AddressIndependentEmail?: __.Association.to.many<A_BPAddressIndependentEmail_>
    declare to_AddressIndependentFax?: __.Association.to.many<A_BPAddressIndependentFax_>
    declare to_AddressIndependentMobile?: __.Association.to.many<A_BPAddressIndependentMobile_>
    declare to_AddressIndependentPhone?: __.Association.to.many<A_BPAddressIndependentPhone_>
    declare to_AddressIndependentWebsite?: __.Association.to.many<A_BPAddressIndependentWebsite_>
    declare to_BPCreditWorthiness?: __.Association.to<A_BPCreditWorthiness> | null
    declare to_BPCreditWorthiness_BusinessPartner?: __.Key<string> | null
    declare to_BPDataController?: __.Association.to.many<A_BPDataController_>
    declare to_BPEmployment?: __.Association.to.many<A_BPEmployment_>
    declare to_BPFinServicesReporting?: __.Association.to<A_BPFinancialServicesReporting> | null
    declare to_BPFinServicesReporting_BusinessPartner?: __.Key<string> | null
    declare to_BPFiscalYearInformation?: __.Association.to.many<A_BPFiscalYearInformation_>
    declare to_BPRelationship?: __.Association.to.many<A_BPRelationship_>
    declare to_BuPaIdentification?: __.Association.to.many<A_BuPaIdentification_>
    declare to_BuPaIndustry?: __.Association.to.many<A_BuPaIndustry_>
    declare to_BusinessPartner?: __.Association.to<A_BPFinancialServicesExtn> | null
    declare to_BusinessPartner_BusinessPartner?: __.Key<string> | null
    declare to_BusinessPartnerAddress?: __.Association.to.many<A_BusinessPartnerAddress_>
    declare to_BusinessPartnerAlias?: __.Association.to.many<A_BusinessPartnerAlias>
    declare to_BusinessPartnerBank?: __.Association.to.many<A_BusinessPartnerBank_>
    declare to_BusinessPartnerContact?: __.Association.to.many<A_BusinessPartnerContact_>
    declare to_BusinessPartnerIsBank?: __.Association.to<A_BusinessPartnerIsBank> | null
    declare to_BusinessPartnerIsBank_BusinessPartner?: __.Key<string> | null
    declare to_BusinessPartnerRating?: __.Association.to.many<A_BusinessPartnerRating_>
    declare to_BusinessPartnerRole?: __.Association.to.many<A_BusinessPartnerRole_>
    declare to_BusinessPartnerTax?: __.Association.to.many<A_BusinessPartnerTaxNumber_>
    declare to_BusPartAddrDepdntTaxNmbr?: __.Association.to.many<A_BusPartAddrDepdntTaxNmbr_>
    declare to_Customer?: __.Association.to<A_Customer> | null
    declare to_Customer_Customer?: __.Key<string> | null
    declare to_PaymentCard?: __.Association.to.many<A_BusinessPartnerPaymentCard_>
    declare to_Supplier?: __.Association.to<A_Supplier> | null
    declare to_Supplier_Supplier?: __.Key<string> | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartner>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartner>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartner extends _A_BusinessPartnerAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartner, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartner' })
Object.defineProperty(A_BusinessPartner, 'is_singular', { value: true })
export class A_BusinessPartner_ extends Array<A_BusinessPartner> {$count?: number}
Object.defineProperty(A_BusinessPartner_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartner' })

export function _A_BusinessPartnerAddressAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerAddress extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare ValidityStartDate?: __.CdsDateTime | null
    declare ValidityEndDate?: __.CdsDateTime | null
    declare AuthorizationGroup?: string | null
    declare AddressUUID?: string | null
    declare AdditionalStreetPrefixName?: string | null
    declare AdditionalStreetSuffixName?: string | null
    declare AddressTimeZone?: string | null
    declare CareOfName?: string | null
    declare CityCode?: string | null
    declare CityName?: string | null
    declare CompanyPostalCode?: string | null
    declare Country?: string | null
    declare County?: string | null
    declare DeliveryServiceNumber?: string | null
    declare DeliveryServiceTypeCode?: string | null
    declare District?: string | null
    declare FormOfAddress?: string | null
    declare FullName?: string | null
    declare HomeCityName?: string | null
    declare HouseNumber?: string | null
    declare HouseNumberSupplementText?: string | null
    declare Language?: string | null
    declare POBox?: string | null
    declare POBoxDeviatingCityName?: string | null
    declare POBoxDeviatingCountry?: string | null
    declare POBoxDeviatingRegion?: string | null
    declare POBoxIsWithoutNumber?: boolean | null
    declare POBoxLobbyName?: string | null
    declare POBoxPostalCode?: string | null
    declare Person?: string | null
    declare PostalCode?: string | null
    declare PrfrdCommMediumType?: string | null
    declare Region?: string | null
    declare StreetName?: string | null
    declare StreetPrefixName?: string | null
    declare StreetSuffixName?: string | null
    declare TaxJurisdiction?: string | null
    declare TransportZone?: string | null
    declare AddressIDByExternalSystem?: string | null
    declare CountyCode?: string | null
    declare TownshipCode?: string | null
    declare TownshipName?: string | null
    declare to_AddressUsage?: __.Association.to.many<A_BuPaAddressUsage_>
    declare to_BPAddrDepdntIntlLocNumber?: __.Association.to<A_BPAddrDepdntIntlLocNumber> | null
    declare to_BPAddrDepdntIntlLocNumber_BusinessPartner?: __.Key<string> | null
    declare to_BPAddrDepdntIntlLocNumber_AddressID?: __.Key<string> | null
    declare to_BPIntlAddressVersion?: __.Association.to.many<A_BPIntlAddressVersion_>
    declare to_EmailAddress?: __.Association.to.many<A_AddressEmailAddress_>
    declare to_FaxNumber?: __.Association.to.many<A_AddressFaxNumber_>
    declare to_MobilePhoneNumber?: __.Association.to.many<A_AddressPhoneNumber_>
    declare to_PhoneNumber?: __.Association.to.many<A_AddressPhoneNumber_>
    declare to_URLAddress?: __.Association.to.many<A_AddressHomePageURL_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerAddress>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerAddress>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerAddress extends _A_BusinessPartnerAddressAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerAddress, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerAddress' })
Object.defineProperty(A_BusinessPartnerAddress, 'is_singular', { value: true })
export class A_BusinessPartnerAddress_ extends Array<A_BusinessPartnerAddress> {$count?: number}
Object.defineProperty(A_BusinessPartnerAddress_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerAddress' })

export function _A_BusinessPartnerAliaAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerAlia extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BPAliasPositionNumber?: __.Key<string>
    declare BusinessPartnerAliasName?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerAlia>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerAlia>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerAlia extends _A_BusinessPartnerAliaAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerAlia, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerAlias' })
Object.defineProperty(A_BusinessPartnerAlia, 'is_singular', { value: true })
export class A_BusinessPartnerAlias extends Array<A_BusinessPartnerAlia> {$count?: number}
Object.defineProperty(A_BusinessPartnerAlias, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerAlias' })

export function _A_BusinessPartnerBankAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerBank extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BankIdentification?: __.Key<string>
    declare BankCountryKey?: string | null
    declare BankName?: string | null
    declare BankNumber?: string | null
    declare SWIFTCode?: string | null
    declare BankControlKey?: string | null
    declare BankAccountHolderName?: string | null
    declare BankAccountName?: string | null
    declare ValidityStartDate?: __.CdsDateTime | null
    declare ValidityEndDate?: __.CdsDateTime | null
    declare IBAN?: string | null
    declare IBANValidityStartDate?: __.CdsDate | null
    declare BankAccount?: string | null
    declare BankAccountReferenceText?: string | null
    declare CollectionAuthInd?: boolean | null
    declare CityName?: string | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerBank>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerBank>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerBank extends _A_BusinessPartnerBankAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerBank, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerBank' })
Object.defineProperty(A_BusinessPartnerBank, 'is_singular', { value: true })
export class A_BusinessPartnerBank_ extends Array<A_BusinessPartnerBank> {$count?: number}
Object.defineProperty(A_BusinessPartnerBank_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerBank' })

export function _A_BusinessPartnerContactAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerContact extends Base {
    declare RelationshipNumber?: __.Key<string>
    declare BusinessPartnerCompany?: __.Key<string>
    declare BusinessPartnerPerson?: __.Key<string>
    declare ValidityEndDate?: __.Key<__.CdsDate>
    declare ValidityStartDate?: __.CdsDate | null
    declare IsStandardRelationship?: boolean | null
    declare RelationshipCategory?: string | null
    declare to_ContactAddress?: __.Association.to.many<A_BPContactToAddress_>
    declare to_ContactRelationship?: __.Association.to<A_BPContactToFuncAndDept> | null
    declare to_ContactRelationship_RelationshipNumber?: __.Key<string> | null
    declare to_ContactRelationship_BusinessPartnerCompany?: __.Key<string> | null
    declare to_ContactRelationship_BusinessPartnerPerson?: __.Key<string> | null
    declare to_ContactRelationship_ValidityEndDate?: __.Key<__.CdsDate> | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerContact>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerContact>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerContact extends _A_BusinessPartnerContactAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerContact, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerContact' })
Object.defineProperty(A_BusinessPartnerContact, 'is_singular', { value: true })
export class A_BusinessPartnerContact_ extends Array<A_BusinessPartnerContact> {$count?: number}
Object.defineProperty(A_BusinessPartnerContact_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerContact' })

export function _A_BusinessPartnerIsBankAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerIsBank extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BankKey?: string | null
    declare BankCountry?: string | null
    declare BPMinimumReserve?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerIsBank>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerIsBank>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerIsBank extends _A_BusinessPartnerIsBankAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerIsBank, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerIsBank' })
Object.defineProperty(A_BusinessPartnerIsBank, 'is_singular', { value: true })
export class A_BusinessPartnerIsBank_ extends Array<A_BusinessPartnerIsBank> {$count?: number}
Object.defineProperty(A_BusinessPartnerIsBank_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerIsBank' })

export function _A_BusinessPartnerPaymentCardAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerPaymentCard extends Base {
    declare BusinessPartner?: __.Key<string>
    declare PaymentCardID?: __.Key<string>
    declare PaymentCardType?: __.Key<string>
    declare CardNumber?: __.Key<string>
    declare IsStandardCard?: boolean | null
    declare CardDescription?: string | null
    declare ValidityDate?: __.CdsDate | null
    declare ValidityEndDate?: __.CdsDate | null
    declare CardHolder?: string | null
    declare CardIssuingBank?: string | null
    declare CardIssueDate?: __.CdsDate | null
    declare PaymentCardLock?: string | null
    declare MaskedCardNumber?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerPaymentCard>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerPaymentCard>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerPaymentCard extends _A_BusinessPartnerPaymentCardAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerPaymentCard, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerPaymentCard' })
Object.defineProperty(A_BusinessPartnerPaymentCard, 'is_singular', { value: true })
export class A_BusinessPartnerPaymentCard_ extends Array<A_BusinessPartnerPaymentCard> {$count?: number}
Object.defineProperty(A_BusinessPartnerPaymentCard_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerPaymentCard' })

export function _A_BusinessPartnerRatingAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerRating extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BusinessPartnerRatingProcedure?: __.Key<string>
    declare BPRatingValidityEndDate?: __.Key<__.CdsDate>
    declare BusinessPartnerRatingGrade?: string | null
    declare BusinessPartnerRatingTrend?: string | null
    declare BPRatingValidityStartDate?: __.CdsDate | null
    declare BPRatingCreationDate?: __.CdsDate | null
    declare BusinessPartnerRatingComment?: string | null
    declare BusinessPartnerRatingIsAllowed?: boolean | null
    declare BPRatingIsValidOnKeyDate?: boolean | null
    declare BusinessPartnerRatingKeyDate?: __.CdsDate | null
    declare BusinessPartnerRatingIsExpired?: boolean | null
    declare BPRatingLongComment?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerRating>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerRating>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerRating extends _A_BusinessPartnerRatingAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerRating, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerRating' })
Object.defineProperty(A_BusinessPartnerRating, 'is_singular', { value: true })
export class A_BusinessPartnerRating_ extends Array<A_BusinessPartnerRating> {$count?: number}
Object.defineProperty(A_BusinessPartnerRating_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerRating' })

export function _A_BusinessPartnerRoleAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerRole extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BusinessPartnerRole?: __.Key<string>
    declare ValidFrom?: __.CdsDateTime | null
    declare ValidTo?: __.CdsDateTime | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerRole>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerRole>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerRole extends _A_BusinessPartnerRoleAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerRole, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerRole' })
Object.defineProperty(A_BusinessPartnerRole, 'is_singular', { value: true })
export class A_BusinessPartnerRole_ extends Array<A_BusinessPartnerRole> {$count?: number}
Object.defineProperty(A_BusinessPartnerRole_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerRole' })

export function _A_BusinessPartnerTaxNumberAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusinessPartnerTaxNumber extends Base {
    declare BusinessPartner?: __.Key<string>
    declare BPTaxType?: __.Key<string>
    declare BPTaxNumber?: string | null
    declare BPTaxLongNumber?: string | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusinessPartnerTaxNumber>;
    declare static readonly elements: __.ElementsOf<A_BusinessPartnerTaxNumber>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusinessPartnerTaxNumber extends _A_BusinessPartnerTaxNumberAspect(__.Entity) {}
Object.defineProperty(A_BusinessPartnerTaxNumber, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerTaxNumber' })
Object.defineProperty(A_BusinessPartnerTaxNumber, 'is_singular', { value: true })
export class A_BusinessPartnerTaxNumber_ extends Array<A_BusinessPartnerTaxNumber> {$count?: number}
Object.defineProperty(A_BusinessPartnerTaxNumber_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusinessPartnerTaxNumber' })

export function _A_BusPartAddrDepdntTaxNmbrAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_BusPartAddrDepdntTaxNmbr extends Base {
    declare BusinessPartner?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare BPTaxType?: __.Key<string>
    declare BPTaxNumber?: string | null
    declare BPTaxLongNumber?: string | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_BusPartAddrDepdntTaxNmbr>;
    declare static readonly elements: __.ElementsOf<A_BusPartAddrDepdntTaxNmbr>;
    static readonly actions: Record<never, never>;
  };
}
export class A_BusPartAddrDepdntTaxNmbr extends _A_BusPartAddrDepdntTaxNmbrAspect(__.Entity) {}
Object.defineProperty(A_BusPartAddrDepdntTaxNmbr, 'name', { value: 'API_BUSINESS_PARTNER.A_BusPartAddrDepdntTaxNmbr' })
Object.defineProperty(A_BusPartAddrDepdntTaxNmbr, 'is_singular', { value: true })
export class A_BusPartAddrDepdntTaxNmbr_ extends Array<A_BusPartAddrDepdntTaxNmbr> {$count?: number}
Object.defineProperty(A_BusPartAddrDepdntTaxNmbr_, 'name', { value: 'API_BUSINESS_PARTNER.A_BusPartAddrDepdntTaxNmbr' })

export function _A_CustAddrDepdntExtIdentifierAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustAddrDepdntExtIdentifier extends Base {
    declare Customer?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare CustomerExternalRefID?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustAddrDepdntExtIdentifier>;
    declare static readonly elements: __.ElementsOf<A_CustAddrDepdntExtIdentifier>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustAddrDepdntExtIdentifier extends _A_CustAddrDepdntExtIdentifierAspect(__.Entity) {}
Object.defineProperty(A_CustAddrDepdntExtIdentifier, 'name', { value: 'API_BUSINESS_PARTNER.A_CustAddrDepdntExtIdentifier' })
Object.defineProperty(A_CustAddrDepdntExtIdentifier, 'is_singular', { value: true })
export class A_CustAddrDepdntExtIdentifier_ extends Array<A_CustAddrDepdntExtIdentifier> {$count?: number}
Object.defineProperty(A_CustAddrDepdntExtIdentifier_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustAddrDepdntExtIdentifier' })

export function _A_CustAddrDepdntInformationAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustAddrDepdntInformation extends Base {
    declare Customer?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare ExpressTrainStationName?: string | null
    declare TrainStationName?: string | null
    declare CityCode?: string | null
    declare County?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustAddrDepdntInformation>;
    declare static readonly elements: __.ElementsOf<A_CustAddrDepdntInformation>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustAddrDepdntInformation extends _A_CustAddrDepdntInformationAspect(__.Entity) {}
Object.defineProperty(A_CustAddrDepdntInformation, 'name', { value: 'API_BUSINESS_PARTNER.A_CustAddrDepdntInformation' })
Object.defineProperty(A_CustAddrDepdntInformation, 'is_singular', { value: true })
export class A_CustAddrDepdntInformation_ extends Array<A_CustAddrDepdntInformation> {$count?: number}
Object.defineProperty(A_CustAddrDepdntInformation_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustAddrDepdntInformation' })

export function _A_CustomerAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_Customer extends Base {
    declare Customer?: __.Key<string>
    declare AuthorizationGroup?: string | null
    declare BillingIsBlockedForCustomer?: string | null
    declare CreatedByUser?: string | null
    declare CreationDate?: __.CdsDate | null
    declare CustomerAccountGroup?: string | null
    declare CustomerClassification?: string | null
    declare CustomerFullName?: string | null
    declare BPCustomerFullName?: string | null
    declare CustomerName?: string | null
    declare BPCustomerName?: string | null
    declare DeliveryIsBlocked?: string | null
    declare FreeDefinedAttribute01?: string | null
    declare FreeDefinedAttribute02?: string | null
    declare FreeDefinedAttribute03?: string | null
    declare FreeDefinedAttribute04?: string | null
    declare FreeDefinedAttribute05?: string | null
    declare FreeDefinedAttribute06?: string | null
    declare FreeDefinedAttribute07?: string | null
    declare FreeDefinedAttribute08?: string | null
    declare FreeDefinedAttribute09?: string | null
    declare FreeDefinedAttribute10?: string | null
    declare NFPartnerIsNaturalPerson?: string | null
    declare OrderIsBlockedForCustomer?: string | null
    declare PostingIsBlocked?: boolean | null
    declare Supplier?: string | null
    declare CustomerCorporateGroup?: string | null
    declare FiscalAddress?: string | null
    declare Industry?: string | null
    declare IndustryCode1?: string | null
    declare IndustryCode2?: string | null
    declare IndustryCode3?: string | null
    declare IndustryCode4?: string | null
    declare IndustryCode5?: string | null
    declare InternationalLocationNumber1?: string | null
    declare InternationalLocationNumber2?: string | null
    declare InternationalLocationNumber3?: string | null
    declare NielsenRegion?: string | null
    declare PaymentReason?: string | null
    declare ResponsibleType?: string | null
    declare TaxNumber1?: string | null
    declare TaxNumber2?: string | null
    declare TaxNumber3?: string | null
    declare TaxNumber4?: string | null
    declare TaxNumber5?: string | null
    declare TaxNumberType?: string | null
    declare VATRegistration?: string | null
    declare DeletionIndicator?: boolean | null
    declare ExpressTrainStationName?: string | null
    declare TrainStationName?: string | null
    declare CityCode?: string | null
    declare County?: string | null
    declare to_CustAddrDepdntExtIdentifier?: __.Association.to.many<A_CustAddrDepdntExtIdentifier_>
    declare to_CustAddrDepdntInformation?: __.Association.to.many<A_CustAddrDepdntInformation_>
    declare to_CustomerCompany?: __.Association.to.many<A_CustomerCompany_>
    declare to_CustomerSalesArea?: __.Association.to.many<A_CustomerSalesArea_>
    declare to_CustomerTaxGrouping?: __.Association.to.many<A_CustomerTaxGrouping_>
    declare to_CustomerText?: __.Association.to.many<A_CustomerText_>
    declare to_CustomerUnloadingPoint?: __.Association.to.many<A_CustomerUnloadingPoint_>
    declare to_CustUnldgPtAddrDepdntInfo?: __.Association.to.many<A_CustUnldgPtAddrDepdntInfo_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_Customer>;
    declare static readonly elements: __.ElementsOf<A_Customer>;
    static readonly actions: Record<never, never>;
  };
}
export class A_Customer extends _A_CustomerAspect(__.Entity) {}
Object.defineProperty(A_Customer, 'name', { value: 'API_BUSINESS_PARTNER.A_Customer' })
Object.defineProperty(A_Customer, 'is_singular', { value: true })
export class A_Customer_ extends Array<A_Customer> {$count?: number}
Object.defineProperty(A_Customer_, 'name', { value: 'API_BUSINESS_PARTNER.A_Customer' })

export function _A_CustomerCompanyAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerCompany extends Base {
    declare Customer?: __.Key<string>
    declare CompanyCode?: __.Key<string>
    declare APARToleranceGroup?: string | null
    declare AccountByCustomer?: string | null
    declare AccountingClerk?: string | null
    declare AccountingClerkFaxNumber?: string | null
    declare AccountingClerkInternetAddress?: string | null
    declare AccountingClerkPhoneNumber?: string | null
    declare AlternativePayerAccount?: string | null
    declare AuthorizationGroup?: string | null
    declare CollectiveInvoiceVariant?: string | null
    declare CustomerAccountNote?: string | null
    declare CustomerHeadOffice?: string | null
    declare CustomerSupplierClearingIsUsed?: boolean | null
    declare HouseBank?: string | null
    declare InterestCalculationCode?: string | null
    declare InterestCalculationDate?: __.CdsDate | null
    declare IntrstCalcFrequencyInMonths?: string | null
    declare IsToBeLocallyProcessed?: boolean | null
    declare ItemIsToBePaidSeparately?: boolean | null
    declare LayoutSortingRule?: string | null
    declare PaymentBlockingReason?: string | null
    declare PaymentMethodsList?: string | null
    declare PaymentReason?: string | null
    declare PaymentTerms?: string | null
    declare PaytAdviceIsSentbyEDI?: boolean | null
    declare PhysicalInventoryBlockInd?: boolean | null
    declare ReconciliationAccount?: string | null
    declare RecordPaymentHistoryIndicator?: boolean | null
    declare UserAtCustomer?: string | null
    declare DeletionIndicator?: boolean | null
    declare CashPlanningGroup?: string | null
    declare KnownOrNegotiatedLeave?: string | null
    declare ValueAdjustmentKey?: string | null
    declare CustomerAccountGroup?: string | null
    declare to_CompanyText?: __.Association.to.many<A_CustomerCompanyText_>
    declare to_CustomerDunning?: __.Association.to.many<A_CustomerDunning_>
    declare to_WithHoldingTax?: __.Association.to.many<A_CustomerWithHoldingTax_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerCompany>;
    declare static readonly elements: __.ElementsOf<A_CustomerCompany>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerCompany extends _A_CustomerCompanyAspect(__.Entity) {}
Object.defineProperty(A_CustomerCompany, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerCompany' })
Object.defineProperty(A_CustomerCompany, 'is_singular', { value: true })
export class A_CustomerCompany_ extends Array<A_CustomerCompany> {$count?: number}
Object.defineProperty(A_CustomerCompany_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerCompany' })

export function _A_CustomerCompanyTextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerCompanyText extends Base {
    declare Customer?: __.Key<string>
    declare CompanyCode?: __.Key<string>
    declare Language?: __.Key<string>
    declare LongTextID?: __.Key<string>
    declare LongText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerCompanyText>;
    declare static readonly elements: __.ElementsOf<A_CustomerCompanyText>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerCompanyText extends _A_CustomerCompanyTextAspect(__.Entity) {}
Object.defineProperty(A_CustomerCompanyText, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerCompanyText' })
Object.defineProperty(A_CustomerCompanyText, 'is_singular', { value: true })
export class A_CustomerCompanyText_ extends Array<A_CustomerCompanyText> {$count?: number}
Object.defineProperty(A_CustomerCompanyText_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerCompanyText' })

export function _A_CustomerDunningAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerDunning extends Base {
    declare Customer?: __.Key<string>
    declare CompanyCode?: __.Key<string>
    declare DunningArea?: __.Key<string>
    declare DunningBlock?: string | null
    declare DunningLevel?: string | null
    declare DunningProcedure?: string | null
    declare DunningRecipient?: string | null
    declare LastDunnedOn?: __.CdsDate | null
    declare LegDunningProcedureOn?: __.CdsDate | null
    declare DunningClerk?: string | null
    declare AuthorizationGroup?: string | null
    declare CustomerAccountGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerDunning>;
    declare static readonly elements: __.ElementsOf<A_CustomerDunning>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerDunning extends _A_CustomerDunningAspect(__.Entity) {}
Object.defineProperty(A_CustomerDunning, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerDunning' })
Object.defineProperty(A_CustomerDunning, 'is_singular', { value: true })
export class A_CustomerDunning_ extends Array<A_CustomerDunning> {$count?: number}
Object.defineProperty(A_CustomerDunning_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerDunning' })

export function _A_CustomerSalesAreaAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerSalesArea extends Base {
    declare Customer?: __.Key<string>
    declare SalesOrganization?: __.Key<string>
    declare DistributionChannel?: __.Key<string>
    declare Division?: __.Key<string>
    declare AccountByCustomer?: string | null
    declare AuthorizationGroup?: string | null
    declare BillingIsBlockedForCustomer?: string | null
    declare CompleteDeliveryIsDefined?: boolean | null
    declare CreditControlArea?: string | null
    declare Currency?: string | null
    declare CustIsRlvtForSettlmtMgmt?: boolean | null
    declare CustomerABCClassification?: string | null
    declare CustomerAccountAssignmentGroup?: string | null
    declare CustomerGroup?: string | null
    declare CustomerIsRebateRelevant?: boolean | null
    declare CustomerPaymentTerms?: string | null
    declare CustomerPriceGroup?: string | null
    declare CustomerPricingProcedure?: string | null
    declare CustProdProposalProcedure?: string | null
    declare DeliveryIsBlockedForCustomer?: string | null
    declare DeliveryPriority?: string | null
    declare IncotermsClassification?: string | null
    declare IncotermsLocation2?: string | null
    declare IncotermsVersion?: string | null
    declare IncotermsLocation1?: string | null
    declare IncotermsSupChnLoc1AddlUUID?: string | null
    declare IncotermsSupChnLoc2AddlUUID?: string | null
    declare IncotermsSupChnDvtgLocAddlUUID?: string | null
    declare DeletionIndicator?: boolean | null
    declare IncotermsTransferLocation?: string | null
    declare InspSbstHasNoTimeOrQuantity?: boolean | null
    declare InvoiceDate?: string | null
    declare ItemOrderProbabilityInPercent?: string | null
    declare ManualInvoiceMaintIsRelevant?: boolean | null
    declare MaxNmbrOfPartialDelivery?: number | null
    declare OrderCombinationIsAllowed?: boolean | null
    declare OrderIsBlockedForCustomer?: string | null
    declare OverdelivTolrtdLmtRatioInPct?: number | null
    declare PartialDeliveryIsAllowed?: string | null
    declare PriceListType?: string | null
    declare ProductUnitGroup?: string | null
    declare ProofOfDeliveryTimeValue?: number | null
    declare SalesGroup?: string | null
    declare SalesItemProposal?: string | null
    declare SalesOffice?: string | null
    declare ShippingCondition?: string | null
    declare SlsDocIsRlvtForProofOfDeliv?: boolean | null
    declare SlsUnlmtdOvrdelivIsAllwd?: boolean | null
    declare SupplyingPlant?: string | null
    declare SalesDistrict?: string | null
    declare UnderdelivTolrtdLmtRatioInPct?: number | null
    declare InvoiceListSchedule?: string | null
    declare ExchangeRateType?: string | null
    declare AdditionalCustomerGroup1?: string | null
    declare AdditionalCustomerGroup2?: string | null
    declare AdditionalCustomerGroup3?: string | null
    declare AdditionalCustomerGroup4?: string | null
    declare AdditionalCustomerGroup5?: string | null
    declare PaymentGuaranteeProcedure?: string | null
    declare CustomerAccountGroup?: string | null
    declare to_PartnerFunction?: __.Association.to.many<A_CustSalesPartnerFunc_>
    declare to_SalesAreaTax?: __.Association.to.many<A_CustomerSalesAreaTax_>
    declare to_SalesAreaText?: __.Association.to.many<A_CustomerSalesAreaText_>
    declare to_SlsAreaAddrDepdntInfo?: __.Association.to.many<A_CustSlsAreaAddrDepdntInfo_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerSalesArea>;
    declare static readonly elements: __.ElementsOf<A_CustomerSalesArea>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerSalesArea extends _A_CustomerSalesAreaAspect(__.Entity) {}
Object.defineProperty(A_CustomerSalesArea, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerSalesArea' })
Object.defineProperty(A_CustomerSalesArea, 'is_singular', { value: true })
export class A_CustomerSalesArea_ extends Array<A_CustomerSalesArea> {$count?: number}
Object.defineProperty(A_CustomerSalesArea_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerSalesArea' })

export function _A_CustomerSalesAreaTaxAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerSalesAreaTax extends Base {
    declare Customer?: __.Key<string>
    declare SalesOrganization?: __.Key<string>
    declare DistributionChannel?: __.Key<string>
    declare Division?: __.Key<string>
    declare DepartureCountry?: __.Key<string>
    declare CustomerTaxCategory?: __.Key<string>
    declare CustomerTaxClassification?: string | null
    declare to_SlsAreaAddrDepdntTax?: __.Association.to.many<A_CustSlsAreaAddrDepdntTaxInfo_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerSalesAreaTax>;
    declare static readonly elements: __.ElementsOf<A_CustomerSalesAreaTax>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerSalesAreaTax extends _A_CustomerSalesAreaTaxAspect(__.Entity) {}
Object.defineProperty(A_CustomerSalesAreaTax, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerSalesAreaTax' })
Object.defineProperty(A_CustomerSalesAreaTax, 'is_singular', { value: true })
export class A_CustomerSalesAreaTax_ extends Array<A_CustomerSalesAreaTax> {$count?: number}
Object.defineProperty(A_CustomerSalesAreaTax_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerSalesAreaTax' })

export function _A_CustomerSalesAreaTextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerSalesAreaText extends Base {
    declare Customer?: __.Key<string>
    declare SalesOrganization?: __.Key<string>
    declare DistributionChannel?: __.Key<string>
    declare Division?: __.Key<string>
    declare Language?: __.Key<string>
    declare LongTextID?: __.Key<string>
    declare LongText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerSalesAreaText>;
    declare static readonly elements: __.ElementsOf<A_CustomerSalesAreaText>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerSalesAreaText extends _A_CustomerSalesAreaTextAspect(__.Entity) {}
Object.defineProperty(A_CustomerSalesAreaText, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerSalesAreaText' })
Object.defineProperty(A_CustomerSalesAreaText, 'is_singular', { value: true })
export class A_CustomerSalesAreaText_ extends Array<A_CustomerSalesAreaText> {$count?: number}
Object.defineProperty(A_CustomerSalesAreaText_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerSalesAreaText' })

export function _A_CustomerTaxGroupingAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerTaxGrouping extends Base {
    declare Customer?: __.Key<string>
    declare CustomerTaxGroupingCode?: __.Key<string>
    declare CustTaxGrpExemptionCertificate?: string | null
    declare CustTaxGroupExemptionRate?: number | null
    declare CustTaxGroupExemptionStartDate?: __.CdsDate | null
    declare CustTaxGroupExemptionEndDate?: __.CdsDate | null
    declare CustTaxGroupSubjectedStartDate?: __.CdsDate | null
    declare CustTaxGroupSubjectedEndDate?: __.CdsDate | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerTaxGrouping>;
    declare static readonly elements: __.ElementsOf<A_CustomerTaxGrouping>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerTaxGrouping extends _A_CustomerTaxGroupingAspect(__.Entity) {}
Object.defineProperty(A_CustomerTaxGrouping, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerTaxGrouping' })
Object.defineProperty(A_CustomerTaxGrouping, 'is_singular', { value: true })
export class A_CustomerTaxGrouping_ extends Array<A_CustomerTaxGrouping> {$count?: number}
Object.defineProperty(A_CustomerTaxGrouping_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerTaxGrouping' })

export function _A_CustomerTextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerText extends Base {
    declare Customer?: __.Key<string>
    declare Language?: __.Key<string>
    declare LongTextID?: __.Key<string>
    declare LongText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerText>;
    declare static readonly elements: __.ElementsOf<A_CustomerText>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerText extends _A_CustomerTextAspect(__.Entity) {}
Object.defineProperty(A_CustomerText, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerText' })
Object.defineProperty(A_CustomerText, 'is_singular', { value: true })
export class A_CustomerText_ extends Array<A_CustomerText> {$count?: number}
Object.defineProperty(A_CustomerText_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerText' })

export function _A_CustomerUnloadingPointAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerUnloadingPoint extends Base {
    declare Customer?: __.Key<string>
    declare UnloadingPointName?: __.Key<string>
    declare CustomerFactoryCalenderCode?: string | null
    declare BPGoodsReceivingHoursCode?: string | null
    declare IsDfltBPUnloadingPoint?: boolean | null
    declare MondayMorningOpeningTime?: __.CdsTime | null
    declare MondayMorningClosingTime?: __.CdsTime | null
    declare MondayAfternoonOpeningTime?: __.CdsTime | null
    declare MondayAfternoonClosingTime?: __.CdsTime | null
    declare TuesdayMorningOpeningTime?: __.CdsTime | null
    declare TuesdayMorningClosingTime?: __.CdsTime | null
    declare TuesdayAfternoonOpeningTime?: __.CdsTime | null
    declare TuesdayAfternoonClosingTime?: __.CdsTime | null
    declare WednesdayMorningOpeningTime?: __.CdsTime | null
    declare WednesdayMorningClosingTime?: __.CdsTime | null
    declare WednesdayAfternoonOpeningTime?: __.CdsTime | null
    declare WednesdayAfternoonClosingTime?: __.CdsTime | null
    declare ThursdayMorningOpeningTime?: __.CdsTime | null
    declare ThursdayMorningClosingTime?: __.CdsTime | null
    declare ThursdayAfternoonOpeningTime?: __.CdsTime | null
    declare ThursdayAfternoonClosingTime?: __.CdsTime | null
    declare FridayMorningOpeningTime?: __.CdsTime | null
    declare FridayMorningClosingTime?: __.CdsTime | null
    declare FridayAfternoonOpeningTime?: __.CdsTime | null
    declare FridayAfternoonClosingTime?: __.CdsTime | null
    declare SaturdayMorningOpeningTime?: __.CdsTime | null
    declare SaturdayMorningClosingTime?: __.CdsTime | null
    declare SaturdayAfternoonOpeningTime?: __.CdsTime | null
    declare SaturdayAfternoonClosingTime?: __.CdsTime | null
    declare SundayMorningOpeningTime?: __.CdsTime | null
    declare SundayMorningClosingTime?: __.CdsTime | null
    declare SundayAfternoonOpeningTime?: __.CdsTime | null
    declare SundayAfternoonClosingTime?: __.CdsTime | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerUnloadingPoint>;
    declare static readonly elements: __.ElementsOf<A_CustomerUnloadingPoint>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerUnloadingPoint extends _A_CustomerUnloadingPointAspect(__.Entity) {}
Object.defineProperty(A_CustomerUnloadingPoint, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerUnloadingPoint' })
Object.defineProperty(A_CustomerUnloadingPoint, 'is_singular', { value: true })
export class A_CustomerUnloadingPoint_ extends Array<A_CustomerUnloadingPoint> {$count?: number}
Object.defineProperty(A_CustomerUnloadingPoint_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerUnloadingPoint' })

export function _A_CustomerWithHoldingTaxAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustomerWithHoldingTax extends Base {
    declare Customer?: __.Key<string>
    declare CompanyCode?: __.Key<string>
    declare WithholdingTaxType?: __.Key<string>
    declare WithholdingTaxCode?: string | null
    declare WithholdingTaxAgent?: boolean | null
    declare ObligationDateBegin?: __.CdsDate | null
    declare ObligationDateEnd?: __.CdsDate | null
    declare WithholdingTaxNumber?: string | null
    declare WithholdingTaxCertificate?: string | null
    declare WithholdingTaxExmptPercent?: number | null
    declare ExemptionDateBegin?: __.CdsDate | null
    declare ExemptionDateEnd?: __.CdsDate | null
    declare ExemptionReason?: string | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustomerWithHoldingTax>;
    declare static readonly elements: __.ElementsOf<A_CustomerWithHoldingTax>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustomerWithHoldingTax extends _A_CustomerWithHoldingTaxAspect(__.Entity) {}
Object.defineProperty(A_CustomerWithHoldingTax, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerWithHoldingTax' })
Object.defineProperty(A_CustomerWithHoldingTax, 'is_singular', { value: true })
export class A_CustomerWithHoldingTax_ extends Array<A_CustomerWithHoldingTax> {$count?: number}
Object.defineProperty(A_CustomerWithHoldingTax_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustomerWithHoldingTax' })

export function _A_CustSalesPartnerFuncAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustSalesPartnerFunc extends Base {
    declare Customer?: __.Key<string>
    declare SalesOrganization?: __.Key<string>
    declare DistributionChannel?: __.Key<string>
    declare Division?: __.Key<string>
    declare PartnerCounter?: __.Key<string>
    declare PartnerFunction?: __.Key<string>
    declare BPCustomerNumber?: string | null
    declare CustomerPartnerDescription?: string | null
    declare DefaultPartner?: boolean | null
    declare Supplier?: string | null
    declare PersonnelNumber?: string | null
    declare ContactPerson?: string | null
    declare AddressID?: string | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustSalesPartnerFunc>;
    declare static readonly elements: __.ElementsOf<A_CustSalesPartnerFunc>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustSalesPartnerFunc extends _A_CustSalesPartnerFuncAspect(__.Entity) {}
Object.defineProperty(A_CustSalesPartnerFunc, 'name', { value: 'API_BUSINESS_PARTNER.A_CustSalesPartnerFunc' })
Object.defineProperty(A_CustSalesPartnerFunc, 'is_singular', { value: true })
export class A_CustSalesPartnerFunc_ extends Array<A_CustSalesPartnerFunc> {$count?: number}
Object.defineProperty(A_CustSalesPartnerFunc_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustSalesPartnerFunc' })

export function _A_CustSlsAreaAddrDepdntInfoAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustSlsAreaAddrDepdntInfo extends Base {
    declare Customer?: __.Key<string>
    declare SalesOrganization?: __.Key<string>
    declare DistributionChannel?: __.Key<string>
    declare Division?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare IncotermsClassification?: string | null
    declare IncotermsLocation1?: string | null
    declare IncotermsLocation2?: string | null
    declare IncotermsSupChnLoc1AddlUUID?: string | null
    declare IncotermsSupChnLoc2AddlUUID?: string | null
    declare IncotermsSupChnDvtgLocAddlUUID?: string | null
    declare DeliveryIsBlocked?: string | null
    declare SalesOffice?: string | null
    declare SalesGroup?: string | null
    declare ShippingCondition?: string | null
    declare SupplyingPlant?: string | null
    declare IncotermsVersion?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustSlsAreaAddrDepdntInfo>;
    declare static readonly elements: __.ElementsOf<A_CustSlsAreaAddrDepdntInfo>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustSlsAreaAddrDepdntInfo extends _A_CustSlsAreaAddrDepdntInfoAspect(__.Entity) {}
Object.defineProperty(A_CustSlsAreaAddrDepdntInfo, 'name', { value: 'API_BUSINESS_PARTNER.A_CustSlsAreaAddrDepdntInfo' })
Object.defineProperty(A_CustSlsAreaAddrDepdntInfo, 'is_singular', { value: true })
export class A_CustSlsAreaAddrDepdntInfo_ extends Array<A_CustSlsAreaAddrDepdntInfo> {$count?: number}
Object.defineProperty(A_CustSlsAreaAddrDepdntInfo_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustSlsAreaAddrDepdntInfo' })

export function _A_CustSlsAreaAddrDepdntTaxInfoAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustSlsAreaAddrDepdntTaxInfo extends Base {
    declare Customer?: __.Key<string>
    declare SalesOrganization?: __.Key<string>
    declare DistributionChannel?: __.Key<string>
    declare Division?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare DepartureCountry?: __.Key<string>
    declare CustomerTaxCategory?: __.Key<string>
    declare CustomerTaxClassification?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustSlsAreaAddrDepdntTaxInfo>;
    declare static readonly elements: __.ElementsOf<A_CustSlsAreaAddrDepdntTaxInfo>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustSlsAreaAddrDepdntTaxInfo extends _A_CustSlsAreaAddrDepdntTaxInfoAspect(__.Entity) {}
Object.defineProperty(A_CustSlsAreaAddrDepdntTaxInfo, 'name', { value: 'API_BUSINESS_PARTNER.A_CustSlsAreaAddrDepdntTaxInfo' })
Object.defineProperty(A_CustSlsAreaAddrDepdntTaxInfo, 'is_singular', { value: true })
export class A_CustSlsAreaAddrDepdntTaxInfo_ extends Array<A_CustSlsAreaAddrDepdntTaxInfo> {$count?: number}
Object.defineProperty(A_CustSlsAreaAddrDepdntTaxInfo_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustSlsAreaAddrDepdntTaxInfo' })

export function _A_CustUnldgPtAddrDepdntInfoAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_CustUnldgPtAddrDepdntInfo extends Base {
    declare Customer?: __.Key<string>
    declare AddressID?: __.Key<string>
    declare UnloadingPointName?: __.Key<string>
    declare CustomerFactoryCalenderCode?: string | null
    declare BPGoodsReceivingHoursCode?: string | null
    declare IsDfltBPUnloadingPoint?: boolean | null
    declare MondayMorningOpeningTime?: __.CdsTime | null
    declare MondayMorningClosingTime?: __.CdsTime | null
    declare MondayAfternoonOpeningTime?: __.CdsTime | null
    declare MondayAfternoonClosingTime?: __.CdsTime | null
    declare TuesdayMorningOpeningTime?: __.CdsTime | null
    declare TuesdayMorningClosingTime?: __.CdsTime | null
    declare TuesdayAfternoonOpeningTime?: __.CdsTime | null
    declare TuesdayAfternoonClosingTime?: __.CdsTime | null
    declare WednesdayMorningOpeningTime?: __.CdsTime | null
    declare WednesdayMorningClosingTime?: __.CdsTime | null
    declare WednesdayAfternoonOpeningTime?: __.CdsTime | null
    declare WednesdayAfternoonClosingTime?: __.CdsTime | null
    declare ThursdayMorningOpeningTime?: __.CdsTime | null
    declare ThursdayMorningClosingTime?: __.CdsTime | null
    declare ThursdayAfternoonOpeningTime?: __.CdsTime | null
    declare ThursdayAfternoonClosingTime?: __.CdsTime | null
    declare FridayMorningOpeningTime?: __.CdsTime | null
    declare FridayMorningClosingTime?: __.CdsTime | null
    declare FridayAfternoonOpeningTime?: __.CdsTime | null
    declare FridayAfternoonClosingTime?: __.CdsTime | null
    declare SaturdayMorningOpeningTime?: __.CdsTime | null
    declare SaturdayMorningClosingTime?: __.CdsTime | null
    declare SaturdayAfternoonOpeningTime?: __.CdsTime | null
    declare SaturdayAfternoonClosingTime?: __.CdsTime | null
    declare SundayMorningOpeningTime?: __.CdsTime | null
    declare SundayMorningClosingTime?: __.CdsTime | null
    declare SundayAfternoonOpeningTime?: __.CdsTime | null
    declare SundayAfternoonClosingTime?: __.CdsTime | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_CustUnldgPtAddrDepdntInfo>;
    declare static readonly elements: __.ElementsOf<A_CustUnldgPtAddrDepdntInfo>;
    static readonly actions: Record<never, never>;
  };
}
export class A_CustUnldgPtAddrDepdntInfo extends _A_CustUnldgPtAddrDepdntInfoAspect(__.Entity) {}
Object.defineProperty(A_CustUnldgPtAddrDepdntInfo, 'name', { value: 'API_BUSINESS_PARTNER.A_CustUnldgPtAddrDepdntInfo' })
Object.defineProperty(A_CustUnldgPtAddrDepdntInfo, 'is_singular', { value: true })
export class A_CustUnldgPtAddrDepdntInfo_ extends Array<A_CustUnldgPtAddrDepdntInfo> {$count?: number}
Object.defineProperty(A_CustUnldgPtAddrDepdntInfo_, 'name', { value: 'API_BUSINESS_PARTNER.A_CustUnldgPtAddrDepdntInfo' })

export function _A_SupplierAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_Supplier extends Base {
    declare Supplier?: __.Key<string>
    declare AlternativePayeeAccountNumber?: string | null
    declare AuthorizationGroup?: string | null
    declare BusinessPartnerPanNumber?: string | null
    declare CreatedByUser?: string | null
    declare CreationDate?: __.CdsDate | null
    declare Customer?: string | null
    declare PaymentIsBlockedForSupplier?: boolean | null
    declare PostingIsBlocked?: boolean | null
    declare PurchasingIsBlocked?: boolean | null
    declare SupplierAccountGroup?: string | null
    declare SupplierFullName?: string | null
    declare SupplierName?: string | null
    declare VATRegistration?: string | null
    declare BirthDate?: __.CdsDate | null
    declare ConcatenatedInternationalLocNo?: string | null
    declare DeletionIndicator?: boolean | null
    declare FiscalAddress?: string | null
    declare Industry?: string | null
    declare InternationalLocationNumber1?: string | null
    declare InternationalLocationNumber2?: string | null
    declare InternationalLocationNumber3?: string | null
    declare IsNaturalPerson?: string | null
    declare PaymentReason?: string | null
    declare ResponsibleType?: string | null
    declare SuplrQltyInProcmtCertfnValidTo?: __.CdsDate | null
    declare SuplrQualityManagementSystem?: string | null
    declare SupplierCorporateGroup?: string | null
    declare SupplierProcurementBlock?: string | null
    declare TaxNumber1?: string | null
    declare TaxNumber2?: string | null
    declare TaxNumber3?: string | null
    declare TaxNumber4?: string | null
    declare TaxNumber5?: string | null
    declare TaxNumberResponsible?: string | null
    declare TaxNumberType?: string | null
    declare SuplrProofOfDelivRlvtCode?: string | null
    declare BR_TaxIsSplit?: boolean | null
    declare DataExchangeInstructionKey?: string | null
    declare to_SupplierCompany?: __.Association.to.many<A_SupplierCompany_>
    declare to_SupplierPurchasingOrg?: __.Association.to.many<A_SupplierPurchasingOrg_>
    declare to_SupplierText?: __.Association.to.many<A_SupplierText_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_Supplier>;
    declare static readonly elements: __.ElementsOf<A_Supplier>;
    static readonly actions: Record<never, never>;
  };
}
export class A_Supplier extends _A_SupplierAspect(__.Entity) {}
Object.defineProperty(A_Supplier, 'name', { value: 'API_BUSINESS_PARTNER.A_Supplier' })
Object.defineProperty(A_Supplier, 'is_singular', { value: true })
export class A_Supplier_ extends Array<A_Supplier> {$count?: number}
Object.defineProperty(A_Supplier_, 'name', { value: 'API_BUSINESS_PARTNER.A_Supplier' })

export function _A_SupplierCompanyAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_SupplierCompany extends Base {
    declare Supplier?: __.Key<string>
    declare CompanyCode?: __.Key<string>
    declare AuthorizationGroup?: string | null
    declare CompanyCodeName?: string | null
    declare PaymentBlockingReason?: string | null
    declare SupplierIsBlockedForPosting?: boolean | null
    declare AccountingClerk?: string | null
    declare AccountingClerkFaxNumber?: string | null
    declare AccountingClerkPhoneNumber?: string | null
    declare SupplierClerk?: string | null
    declare SupplierClerkURL?: string | null
    declare PaymentMethodsList?: string | null
    declare PaymentReason?: string | null
    declare PaymentTerms?: string | null
    declare ClearCustomerSupplier?: boolean | null
    declare IsToBeLocallyProcessed?: boolean | null
    declare ItemIsToBePaidSeparately?: boolean | null
    declare PaymentIsToBeSentByEDI?: boolean | null
    declare HouseBank?: string | null
    declare CheckPaidDurationInDays?: number | null
    declare Currency?: string | null
    declare BillOfExchLmtAmtInCoCodeCrcy?: number | null
    declare SupplierClerkIDBySupplier?: string | null
    declare ReconciliationAccount?: string | null
    declare InterestCalculationCode?: string | null
    declare InterestCalculationDate?: __.CdsDate | null
    declare IntrstCalcFrequencyInMonths?: string | null
    declare SupplierHeadOffice?: string | null
    declare AlternativePayee?: string | null
    declare LayoutSortingRule?: string | null
    declare APARToleranceGroup?: string | null
    declare SupplierCertificationDate?: __.CdsDate | null
    declare SupplierAccountNote?: string | null
    declare WithholdingTaxCountry?: string | null
    declare DeletionIndicator?: boolean | null
    declare CashPlanningGroup?: string | null
    declare IsToBeCheckedForDuplicates?: boolean | null
    declare MinorityGroup?: string | null
    declare SupplierAccountGroup?: string | null
    declare to_CompanyText?: __.Association.to.many<A_SupplierCompanyText_>
    declare to_Supplier?: __.Association.to<A_Supplier> | null
    declare to_Supplier_Supplier?: __.Key<string> | null
    declare to_SupplierDunning?: __.Association.to.many<A_SupplierDunning_>
    declare to_SupplierWithHoldingTax?: __.Association.to.many<A_SupplierWithHoldingTax_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_SupplierCompany>;
    declare static readonly elements: __.ElementsOf<A_SupplierCompany>;
    static readonly actions: Record<never, never>;
  };
}
export class A_SupplierCompany extends _A_SupplierCompanyAspect(__.Entity) {}
Object.defineProperty(A_SupplierCompany, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierCompany' })
Object.defineProperty(A_SupplierCompany, 'is_singular', { value: true })
export class A_SupplierCompany_ extends Array<A_SupplierCompany> {$count?: number}
Object.defineProperty(A_SupplierCompany_, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierCompany' })

export function _A_SupplierCompanyTextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_SupplierCompanyText extends Base {
    declare Supplier?: __.Key<string>
    declare CompanyCode?: __.Key<string>
    declare Language?: __.Key<string>
    declare LongTextID?: __.Key<string>
    declare LongText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_SupplierCompanyText>;
    declare static readonly elements: __.ElementsOf<A_SupplierCompanyText>;
    static readonly actions: Record<never, never>;
  };
}
export class A_SupplierCompanyText extends _A_SupplierCompanyTextAspect(__.Entity) {}
Object.defineProperty(A_SupplierCompanyText, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierCompanyText' })
Object.defineProperty(A_SupplierCompanyText, 'is_singular', { value: true })
export class A_SupplierCompanyText_ extends Array<A_SupplierCompanyText> {$count?: number}
Object.defineProperty(A_SupplierCompanyText_, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierCompanyText' })

export function _A_SupplierDunningAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_SupplierDunning extends Base {
    declare Supplier?: __.Key<string>
    declare CompanyCode?: __.Key<string>
    declare DunningArea?: __.Key<string>
    declare DunningBlock?: string | null
    declare DunningLevel?: string | null
    declare DunningProcedure?: string | null
    declare DunningRecipient?: string | null
    declare LastDunnedOn?: __.CdsDate | null
    declare LegDunningProcedureOn?: __.CdsDate | null
    declare DunningClerk?: string | null
    declare AuthorizationGroup?: string | null
    declare SupplierAccountGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_SupplierDunning>;
    declare static readonly elements: __.ElementsOf<A_SupplierDunning>;
    static readonly actions: Record<never, never>;
  };
}
export class A_SupplierDunning extends _A_SupplierDunningAspect(__.Entity) {}
Object.defineProperty(A_SupplierDunning, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierDunning' })
Object.defineProperty(A_SupplierDunning, 'is_singular', { value: true })
export class A_SupplierDunning_ extends Array<A_SupplierDunning> {$count?: number}
Object.defineProperty(A_SupplierDunning_, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierDunning' })

export function _A_SupplierPartnerFuncAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_SupplierPartnerFunc extends Base {
    declare Supplier?: __.Key<string>
    declare PurchasingOrganization?: __.Key<string>
    declare SupplierSubrange?: __.Key<string>
    declare Plant?: __.Key<string>
    declare PartnerFunction?: __.Key<string>
    declare PartnerCounter?: __.Key<string>
    declare DefaultPartner?: boolean | null
    declare CreationDate?: __.CdsDate | null
    declare CreatedByUser?: string | null
    declare ReferenceSupplier?: string | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_SupplierPartnerFunc>;
    declare static readonly elements: __.ElementsOf<A_SupplierPartnerFunc>;
    static readonly actions: Record<never, never>;
  };
}
export class A_SupplierPartnerFunc extends _A_SupplierPartnerFuncAspect(__.Entity) {}
Object.defineProperty(A_SupplierPartnerFunc, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierPartnerFunc' })
Object.defineProperty(A_SupplierPartnerFunc, 'is_singular', { value: true })
export class A_SupplierPartnerFunc_ extends Array<A_SupplierPartnerFunc> {$count?: number}
Object.defineProperty(A_SupplierPartnerFunc_, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierPartnerFunc' })

export function _A_SupplierPurchasingOrgAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_SupplierPurchasingOrg extends Base {
    declare Supplier?: __.Key<string>
    declare PurchasingOrganization?: __.Key<string>
    declare AutomaticEvaluatedRcptSettlmt?: boolean | null
    declare CalculationSchemaGroupCode?: string | null
    declare DeletionIndicator?: boolean | null
    declare EvaldReceiptSettlementIsActive?: boolean | null
    declare IncotermsClassification?: string | null
    declare IncotermsTransferLocation?: string | null
    declare IncotermsVersion?: string | null
    declare IncotermsLocation1?: string | null
    declare IncotermsLocation2?: string | null
    declare IncotermsSupChnLoc1AddlUUID?: string | null
    declare IncotermsSupChnLoc2AddlUUID?: string | null
    declare IncotermsSupChnDvtgLocAddlUUID?: string | null
    declare IntrastatCrsBorderTrMode?: string | null
    declare InvoiceIsGoodsReceiptBased?: boolean | null
    declare InvoiceIsMMServiceEntryBased?: boolean | null
    declare MaterialPlannedDeliveryDurn?: number | null
    declare MinimumOrderAmount?: number | null
    declare PaymentTerms?: string | null
    declare PlanningCycle?: string | null
    declare PricingDateControl?: string | null
    declare ProdStockAndSlsDataTransfPrfl?: string | null
    declare ProductUnitGroup?: string | null
    declare PurOrdAutoGenerationIsAllowed?: boolean | null
    declare PurchaseOrderCurrency?: string | null
    declare PurchasingGroup?: string | null
    declare PurchasingIsBlockedForSupplier?: boolean | null
    declare RoundingProfile?: string | null
    declare ShippingCondition?: string | null
    declare SuplrDiscountInKindIsGranted?: boolean | null
    declare SuplrInvcRevalIsAllowed?: boolean | null
    declare SuplrIsRlvtForSettlmtMgmt?: boolean | null
    declare SuplrPurgOrgIsRlvtForPriceDetn?: boolean | null
    declare SupplierABCClassificationCode?: string | null
    declare SupplierAccountNumber?: string | null
    declare SupplierIsReturnsSupplier?: boolean | null
    declare SupplierPhoneNumber?: string | null
    declare SupplierRespSalesPersonName?: string | null
    declare SupplierConfirmationControlKey?: string | null
    declare IsOrderAcknRqd?: boolean | null
    declare AuthorizationGroup?: string | null
    declare SupplierAccountGroup?: string | null
    declare to_PartnerFunction?: __.Association.to.many<A_SupplierPartnerFunc_>
    declare to_PurchasingOrgText?: __.Association.to.many<A_SupplierPurchasingOrgText_>
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_SupplierPurchasingOrg>;
    declare static readonly elements: __.ElementsOf<A_SupplierPurchasingOrg>;
    static readonly actions: Record<never, never>;
  };
}
export class A_SupplierPurchasingOrg extends _A_SupplierPurchasingOrgAspect(__.Entity) {}
Object.defineProperty(A_SupplierPurchasingOrg, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierPurchasingOrg' })
Object.defineProperty(A_SupplierPurchasingOrg, 'is_singular', { value: true })
export class A_SupplierPurchasingOrg_ extends Array<A_SupplierPurchasingOrg> {$count?: number}
Object.defineProperty(A_SupplierPurchasingOrg_, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierPurchasingOrg' })

export function _A_SupplierPurchasingOrgTextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_SupplierPurchasingOrgText extends Base {
    declare Supplier?: __.Key<string>
    declare PurchasingOrganization?: __.Key<string>
    declare Language?: __.Key<string>
    declare LongTextID?: __.Key<string>
    declare LongText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_SupplierPurchasingOrgText>;
    declare static readonly elements: __.ElementsOf<A_SupplierPurchasingOrgText>;
    static readonly actions: Record<never, never>;
  };
}
export class A_SupplierPurchasingOrgText extends _A_SupplierPurchasingOrgTextAspect(__.Entity) {}
Object.defineProperty(A_SupplierPurchasingOrgText, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierPurchasingOrgText' })
Object.defineProperty(A_SupplierPurchasingOrgText, 'is_singular', { value: true })
export class A_SupplierPurchasingOrgText_ extends Array<A_SupplierPurchasingOrgText> {$count?: number}
Object.defineProperty(A_SupplierPurchasingOrgText_, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierPurchasingOrgText' })

export function _A_SupplierTextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_SupplierText extends Base {
    declare Supplier?: __.Key<string>
    declare Language?: __.Key<string>
    declare LongTextID?: __.Key<string>
    declare LongText?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_SupplierText>;
    declare static readonly elements: __.ElementsOf<A_SupplierText>;
    static readonly actions: Record<never, never>;
  };
}
export class A_SupplierText extends _A_SupplierTextAspect(__.Entity) {}
Object.defineProperty(A_SupplierText, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierText' })
Object.defineProperty(A_SupplierText, 'is_singular', { value: true })
export class A_SupplierText_ extends Array<A_SupplierText> {$count?: number}
Object.defineProperty(A_SupplierText_, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierText' })

export function _A_SupplierWithHoldingTaxAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class A_SupplierWithHoldingTax extends Base {
    declare Supplier?: __.Key<string>
    declare CompanyCode?: __.Key<string>
    declare WithholdingTaxType?: __.Key<string>
    declare ExemptionDateBegin?: __.CdsDate | null
    declare ExemptionDateEnd?: __.CdsDate | null
    declare ExemptionReason?: string | null
    declare IsWithholdingTaxSubject?: boolean | null
    declare RecipientType?: string | null
    declare WithholdingTaxCertificate?: string | null
    declare WithholdingTaxCode?: string | null
    declare WithholdingTaxExmptPercent?: number | null
    declare WithholdingTaxNumber?: string | null
    declare AuthorizationGroup?: string | null
    static readonly kind: "entity" | "type" | "aspect" = 'entity';
    declare static readonly keys: __.KeysOf<A_SupplierWithHoldingTax>;
    declare static readonly elements: __.ElementsOf<A_SupplierWithHoldingTax>;
    static readonly actions: Record<never, never>;
  };
}
export class A_SupplierWithHoldingTax extends _A_SupplierWithHoldingTaxAspect(__.Entity) {}
Object.defineProperty(A_SupplierWithHoldingTax, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierWithHoldingTax' })
Object.defineProperty(A_SupplierWithHoldingTax, 'is_singular', { value: true })
export class A_SupplierWithHoldingTax_ extends Array<A_SupplierWithHoldingTax> {$count?: number}
Object.defineProperty(A_SupplierWithHoldingTax_, 'name', { value: 'API_BUSINESS_PARTNER.A_SupplierWithHoldingTax' })
