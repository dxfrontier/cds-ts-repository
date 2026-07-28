// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../_';

export default class {}

// entity 'A_AddressEmailAddress'
export declare function _A_AddressEmailAddressAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    IsDefaultEmailAddress?: boolean | null;
    EmailAddress?: string | null;
    SearchEmailAddress?: string | null;
    AddressCommunicationRemarkText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_AddressEmailAddress>;
  readonly elements: __.ElementsOf<A_AddressEmailAddress>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_AddressEmailAddress extends _A_AddressEmailAddressAspect(__.Entity) {}
export class A_AddressEmailAddress_ extends Array<A_AddressEmailAddress> {
  $count?: number;
}

// entity 'A_AddressFaxNumber'
export declare function _A_AddressFaxNumberAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    IsDefaultFaxNumber?: boolean | null;
    FaxCountry?: string | null;
    FaxNumber?: string | null;
    FaxNumberExtension?: string | null;
    InternationalFaxNumber?: string | null;
    AddressCommunicationRemarkText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_AddressFaxNumber>;
  readonly elements: __.ElementsOf<A_AddressFaxNumber>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_AddressFaxNumber extends _A_AddressFaxNumberAspect(__.Entity) {}
export class A_AddressFaxNumber_ extends Array<A_AddressFaxNumber> {
  $count?: number;
}

// entity 'A_AddressHomePageURL'
export declare function _A_AddressHomePageURLAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    ValidityStartDate?: __.Key<__.CdsDate>;
    IsDefaultURLAddress?: __.Key<boolean>;
    SearchURLAddress?: string | null;
    AddressCommunicationRemarkText?: string | null;
    URLFieldLength?: number | null;
    WebsiteURL?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_AddressHomePageURL>;
  readonly elements: __.ElementsOf<A_AddressHomePageURL>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_AddressHomePageURL extends _A_AddressHomePageURLAspect(__.Entity) {}
export class A_AddressHomePageURL_ extends Array<A_AddressHomePageURL> {
  $count?: number;
}

// entity 'A_AddressPhoneNumber'
export declare function _A_AddressPhoneNumberAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    DestinationLocationCountry?: string | null;
    IsDefaultPhoneNumber?: boolean | null;
    PhoneNumber?: string | null;
    PhoneNumberExtension?: string | null;
    InternationalPhoneNumber?: string | null;
    PhoneNumberType?: string | null;
    AddressCommunicationRemarkText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_AddressPhoneNumber>;
  readonly elements: __.ElementsOf<A_AddressPhoneNumber>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_AddressPhoneNumber extends _A_AddressPhoneNumberAspect(__.Entity) {}
export class A_AddressPhoneNumber_ extends Array<A_AddressPhoneNumber> {
  $count?: number;
}

// entity 'A_BPAddrDepdntIntlLocNumber'
export declare function _A_BPAddrDepdntIntlLocNumberAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    InternationalLocationNumber1?: string | null;
    InternationalLocationNumber2?: string | null;
    InternationalLocationNumber3?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPAddrDepdntIntlLocNumber>;
  readonly elements: __.ElementsOf<A_BPAddrDepdntIntlLocNumber>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPAddrDepdntIntlLocNumber extends _A_BPAddrDepdntIntlLocNumberAspect(__.Entity) {}
export class A_BPAddrDepdntIntlLocNumber_ extends Array<A_BPAddrDepdntIntlLocNumber> {
  $count?: number;
}

// entity 'A_BPAddressIndependentEmail'
export declare function _A_BPAddressIndependentEmailAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    EmailAddress?: string | null;
    IsDefaultEmailAddress?: boolean | null;
    ValidityStartDate?: __.CdsDate | null;
    ValidityEndDate?: __.CdsDate | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPAddressIndependentEmail>;
  readonly elements: __.ElementsOf<A_BPAddressIndependentEmail>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPAddressIndependentEmail extends _A_BPAddressIndependentEmailAspect(__.Entity) {}
export class A_BPAddressIndependentEmail_ extends Array<A_BPAddressIndependentEmail> {
  $count?: number;
}

// entity 'A_BPAddressIndependentFax'
export declare function _A_BPAddressIndependentFaxAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    FaxCountry?: string | null;
    FaxAreaCodeSubscriberNumber?: string | null;
    FaxNumberExtension?: string | null;
    InternationalFaxNumber?: string | null;
    IsDefaultFaxNumber?: boolean | null;
    ValidityEndDate?: __.CdsDate | null;
    ValidityStartDate?: __.CdsDate | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPAddressIndependentFax>;
  readonly elements: __.ElementsOf<A_BPAddressIndependentFax>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPAddressIndependentFax extends _A_BPAddressIndependentFaxAspect(__.Entity) {}
export class A_BPAddressIndependentFax_ extends Array<A_BPAddressIndependentFax> {
  $count?: number;
}

// entity 'A_BPAddressIndependentMobile'
export declare function _A_BPAddressIndependentMobileAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    InternationalPhoneNumber?: string | null;
    IsDefaultPhoneNumber?: boolean | null;
    MobilePhoneCountry?: string | null;
    MobilePhoneNumber?: string | null;
    PhoneNumberExtension?: string | null;
    PhoneNumberType?: string | null;
    ValidityStartDate?: __.CdsDate | null;
    ValidityEndDate?: __.CdsDate | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPAddressIndependentMobile>;
  readonly elements: __.ElementsOf<A_BPAddressIndependentMobile>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPAddressIndependentMobile extends _A_BPAddressIndependentMobileAspect(__.Entity) {}
export class A_BPAddressIndependentMobile_ extends Array<A_BPAddressIndependentMobile> {
  $count?: number;
}

// entity 'A_BPAddressIndependentPhone'
export declare function _A_BPAddressIndependentPhoneAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    DestinationLocationCountry?: string | null;
    InternationalPhoneNumber?: string | null;
    IsDefaultPhoneNumber?: boolean | null;
    PhoneNumber?: string | null;
    PhoneNumberExtension?: string | null;
    PhoneNumberType?: string | null;
    ValidityStartDate?: __.CdsDate | null;
    ValidityEndDate?: __.CdsDate | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPAddressIndependentPhone>;
  readonly elements: __.ElementsOf<A_BPAddressIndependentPhone>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPAddressIndependentPhone extends _A_BPAddressIndependentPhoneAspect(__.Entity) {}
export class A_BPAddressIndependentPhone_ extends Array<A_BPAddressIndependentPhone> {
  $count?: number;
}

// entity 'A_BPAddressIndependentWebsite'
export declare function _A_BPAddressIndependentWebsiteAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    Person?: __.Key<string>;
    OrdinalNumber?: __.Key<string>;
    IsDefaultURLAddress?: boolean | null;
    URLFieldLength?: number | null;
    WebsiteURL?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPAddressIndependentWebsite>;
  readonly elements: __.ElementsOf<A_BPAddressIndependentWebsite>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPAddressIndependentWebsite extends _A_BPAddressIndependentWebsiteAspect(__.Entity) {}
export class A_BPAddressIndependentWebsite_ extends Array<A_BPAddressIndependentWebsite> {
  $count?: number;
}

// entity 'A_BPContactToAddress'
export declare function _A_BPContactToAddressAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    RelationshipNumber?: __.Key<string>;
    BusinessPartnerCompany?: __.Key<string>;
    BusinessPartnerPerson?: __.Key<string>;
    ValidityEndDate?: __.Key<__.CdsDate>;
    AddressID?: __.Key<string>;
    AddressNumber?: string | null;
    AdditionalStreetPrefixName?: string | null;
    AdditionalStreetSuffixName?: string | null;
    AddressTimeZone?: string | null;
    CareOfName?: string | null;
    CityCode?: string | null;
    CityName?: string | null;
    CompanyPostalCode?: string | null;
    Country?: string | null;
    County?: string | null;
    DeliveryServiceNumber?: string | null;
    DeliveryServiceTypeCode?: string | null;
    District?: string | null;
    FormOfAddress?: string | null;
    FullName?: string | null;
    HomeCityName?: string | null;
    HouseNumber?: string | null;
    HouseNumberSupplementText?: string | null;
    Language?: string | null;
    POBox?: string | null;
    POBoxDeviatingCityName?: string | null;
    POBoxDeviatingCountry?: string | null;
    POBoxDeviatingRegion?: string | null;
    POBoxIsWithoutNumber?: boolean | null;
    POBoxLobbyName?: string | null;
    POBoxPostalCode?: string | null;
    Person?: string | null;
    PostalCode?: string | null;
    PrfrdCommMediumType?: string | null;
    Region?: string | null;
    StreetName?: string | null;
    StreetPrefixName?: string | null;
    StreetSuffixName?: string | null;
    TaxJurisdiction?: string | null;
    TransportZone?: string | null;
    AddressRepresentationCode?: string | null;
    ContactPersonBuilding?: string | null;
    ContactPersonPrfrdCommMedium?: string | null;
    ContactRelationshipDepartment?: string | null;
    ContactRelationshipFunction?: string | null;
    CorrespondenceShortName?: string | null;
    Floor?: string | null;
    InhouseMail?: string | null;
    IsDefaultAddress?: boolean | null;
    RoomNumber?: string | null;
    to_EmailAddress?: __.Association.to.many<A_AddressEmailAddress_>;
    to_FaxNumber?: __.Association.to.many<A_AddressFaxNumber_>;
    to_MobilePhoneNumber?: __.Association.to.many<A_AddressPhoneNumber_>;
    to_PhoneNumber?: __.Association.to.many<A_AddressPhoneNumber_>;
    to_URLAddress?: __.Association.to.many<A_AddressHomePageURL_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPContactToAddress>;
  readonly elements: __.ElementsOf<A_BPContactToAddress>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPContactToAddress extends _A_BPContactToAddressAspect(__.Entity) {}
export class A_BPContactToAddress_ extends Array<A_BPContactToAddress> {
  $count?: number;
}

// entity 'A_BPContactToFuncAndDept'
export declare function _A_BPContactToFuncAndDeptAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    RelationshipNumber?: __.Key<string>;
    BusinessPartnerCompany?: __.Key<string>;
    BusinessPartnerPerson?: __.Key<string>;
    ValidityEndDate?: __.Key<__.CdsDate>;
    ContactPersonAuthorityType?: string | null;
    ContactPersonDepartment?: string | null;
    ContactPersonDepartmentName?: string | null;
    ContactPersonFunction?: string | null;
    ContactPersonFunctionName?: string | null;
    ContactPersonRemarkText?: string | null;
    ContactPersonVIPType?: string | null;
    EmailAddress?: string | null;
    FaxNumber?: string | null;
    FaxNumberExtension?: string | null;
    PhoneNumber?: string | null;
    PhoneNumberExtension?: string | null;
    RelationshipCategory?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPContactToFuncAndDept>;
  readonly elements: __.ElementsOf<A_BPContactToFuncAndDept>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPContactToFuncAndDept extends _A_BPContactToFuncAndDeptAspect(__.Entity) {}
export class A_BPContactToFuncAndDept_ extends Array<A_BPContactToFuncAndDept> {
  $count?: number;
}

// entity 'A_BPCreditWorthiness'
export declare function _A_BPCreditWorthinessAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BusPartCreditStanding?: string | null;
    BPCreditStandingStatus?: string | null;
    CreditRatingAgency?: string | null;
    BPCreditStandingComment?: string | null;
    BPCreditStandingDate?: __.CdsDate | null;
    BPCreditStandingRating?: string | null;
    BPLegalProceedingStatus?: string | null;
    BPLglProceedingInitiationDate?: __.CdsDate | null;
    BusinessPartnerIsUnderOath?: boolean | null;
    BusinessPartnerOathDate?: __.CdsDate | null;
    BusinessPartnerIsBankrupt?: boolean | null;
    BusinessPartnerBankruptcyDate?: __.CdsDate | null;
    BPForeclosureIsInitiated?: boolean | null;
    BPForeclosureDate?: __.CdsDate | null;
    BPCrdtWrthnssAccessChkIsActive?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPCreditWorthiness>;
  readonly elements: __.ElementsOf<A_BPCreditWorthiness>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPCreditWorthiness extends _A_BPCreditWorthinessAspect(__.Entity) {}
export class A_BPCreditWorthiness_ extends Array<A_BPCreditWorthiness> {
  $count?: number;
}

// entity 'A_BPDataController'
export declare function _A_BPDataControllerAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    DataController?: __.Key<string>;
    PurposeForPersonalData?: __.Key<string>;
    DataControlAssignmentStatus?: string | null;
    BPDataControllerIsDerived?: string | null;
    PurposeDerived?: string | null;
    PurposeType?: string | null;
    BusinessPurposeFlag?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPDataController>;
  readonly elements: __.ElementsOf<A_BPDataController>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPDataController extends _A_BPDataControllerAspect(__.Entity) {}
export class A_BPDataController_ extends Array<A_BPDataController> {
  $count?: number;
}

// entity 'A_BPEmployment'
export declare function _A_BPEmploymentAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BPEmploymentStartDate?: __.Key<__.CdsDate>;
    BPEmploymentEndDate?: __.CdsDate | null;
    BPEmploymentStatus?: string | null;
    BusPartEmplrIndstryCode?: string | null;
    BusinessPartnerEmployerName?: string | null;
    BusinessPartnerOccupationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPEmployment>;
  readonly elements: __.ElementsOf<A_BPEmployment>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPEmployment extends _A_BPEmploymentAspect(__.Entity) {}
export class A_BPEmployment_ extends Array<A_BPEmployment> {
  $count?: number;
}

// entity 'A_BPFinancialServicesExtn'
export declare function _A_BPFinancialServicesExtnAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BusinessPartnerIsVIP?: boolean | null;
    TradingPartner?: string | null;
    FactoryCalendar?: string | null;
    BusinessPartnerOfficeCountry?: string | null;
    BusinessPartnerOfficeRegion?: string | null;
    BPRegisteredOfficeName?: string | null;
    BPBalanceSheetCurrency?: string | null;
    BPLastCptlIncrAmtInBalShtCrcy?: number | null;
    BPLastCapitalIncreaseYear?: string | null;
    BPBalanceSheetDisplayType?: string | null;
    BusinessPartnerCitizenship?: string | null;
    BPMaritalPropertyRegime?: string | null;
    BusinessPartnerIncomeCurrency?: string | null;
    BPNumberOfChildren?: number | null;
    BPNumberOfHouseholdMembers?: number | null;
    BPAnnualNetIncAmtInIncomeCrcy?: number | null;
    BPMonthlyNetIncAmtInIncomeCrcy?: number | null;
    BPAnnualNetIncomeYear?: string | null;
    BPMonthlyNetIncomeMonth?: string | null;
    BPMonthlyNetIncomeYear?: string | null;
    BPPlaceOfDeathName?: string | null;
    CustomerIsUnwanted?: boolean | null;
    UndesirabilityReason?: string | null;
    UndesirabilityComment?: string | null;
    LastCustomerContactDate?: __.CdsDate | null;
    BPGroupingCharacter?: string | null;
    BPLetterSalutation?: string | null;
    BusinessPartnerTargetGroup?: string | null;
    BusinessPartnerEmployeeGroup?: string | null;
    BusinessPartnerIsEmployee?: boolean | null;
    BPTermnBusRelationsBankDate?: __.CdsDate | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPFinancialServicesExtn>;
  readonly elements: __.ElementsOf<A_BPFinancialServicesExtn>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPFinancialServicesExtn extends _A_BPFinancialServicesExtnAspect(__.Entity) {}
export class A_BPFinancialServicesExtn_ extends Array<A_BPFinancialServicesExtn> {
  $count?: number;
}

// entity 'A_BPFinancialServicesReporting'
export declare function _A_BPFinancialServicesReportingAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BPIsNonResident?: boolean | null;
    BPNonResidencyStartDate?: __.CdsDate | null;
    BPIsMultimillionLoanRecipient?: boolean | null;
    BPLoanReportingBorrowerNumber?: string | null;
    BPLoanRptgBorrowerEntityNumber?: string | null;
    BPCreditStandingReview?: string | null;
    BPCreditStandingReviewDate?: __.CdsDate | null;
    BusinessPartnerLoanToManager?: string | null;
    BPCompanyRelationship?: string | null;
    BPLoanReportingCreditorNumber?: string | null;
    BPOeNBIdentNumber?: string | null;
    BPOeNBTargetGroup?: string | null;
    BPOeNBIdentNumberAssigned?: string | null;
    BPOeNBInstituteNumber?: string | null;
    BusinessPartnerIsOeNBInstitute?: boolean | null;
    BusinessPartnerGroup?: string | null;
    BPGroupAssignmentCategory?: string | null;
    BusinessPartnerGroupName?: string | null;
    BusinessPartnerLegalEntity?: string | null;
    BPGerAstRglnRestrictedAstQuota?: string | null;
    BusinessPartnerDebtorGroup?: string | null;
    BusinessPartnerBusinessPurpose?: string | null;
    BusinessPartnerRiskGroup?: string | null;
    BPRiskGroupingDate?: __.CdsDate | null;
    BPHasGroupAffiliation?: boolean | null;
    BPIsMonetaryFinInstitution?: boolean | null;
    BPCrdtStandingReviewIsRequired?: boolean | null;
    BPLoanMonitoringIsRequired?: boolean | null;
    BPHasCreditingRelief?: boolean | null;
    BPInvestInRstrcdAstIsAuthzd?: boolean | null;
    BPCentralBankCountryRegion?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPFinancialServicesReporting>;
  readonly elements: __.ElementsOf<A_BPFinancialServicesReporting>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPFinancialServicesReporting extends _A_BPFinancialServicesReportingAspect(__.Entity) {}
export class A_BPFinancialServicesReporting_ extends Array<A_BPFinancialServicesReporting> {
  $count?: number;
}

// entity 'A_BPFiscalYearInformation'
export declare function _A_BPFiscalYearInformationAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BusinessPartnerFiscalYear?: __.Key<string>;
    BPBalanceSheetCurrency?: string | null;
    BPAnnualStockholderMeetingDate?: __.CdsDate | null;
    BPFiscalYearStartDate?: __.CdsDate | null;
    BPFiscalYearEndDate?: __.CdsDate | null;
    BPFiscalYearIsClosed?: boolean | null;
    BPFiscalYearClosingDate?: __.CdsDate | null;
    BPFsclYrCnsldtdFinStatementDte?: __.CdsDate | null;
    BPCapitalStockAmtInBalShtCrcy?: number | null;
    BPIssdStockCptlAmtInBalShtCrcy?: number | null;
    BPPartcipnCertAmtInBalShtCrcy?: number | null;
    BPEquityCapitalAmtInBalShtCrcy?: number | null;
    BPGrossPremiumAmtInBalShtCrcy?: number | null;
    BPNetPremiumAmtInBalShtCrcy?: number | null;
    BPAnnualSalesAmtInBalShtCrcy?: number | null;
    BPAnnualNetIncAmtInBalShtCrcy?: number | null;
    BPDividendDistrAmtInBalShtCrcy?: number | null;
    BPDebtRatioInYears?: number | null;
    BPAnnualPnLAmtInBalShtCrcy?: number | null;
    BPBalSheetTotalAmtInBalShtCrcy?: number | null;
    BPNumberOfEmployees?: string | null;
    BPCptlReserveAmtInBalShtCrcy?: number | null;
    BPLglRevnRsrvAmtInBalShtCrcy?: number | null;
    RevnRsrvOwnStkAmtInBalShtCrcy?: number | null;
    BPStatryReserveAmtInBalShtCrcy?: number | null;
    BPOthRevnRsrvAmtInBalShtCrcy?: number | null;
    BPPnLCarryfwdAmtInBalShtCrcy?: number | null;
    BPSuborddLbltyAmtInBalShtCrcy?: number | null;
    BPRetOnTotalCptlEmpldInPercent?: number | null;
    BPDebtClearancePeriodInYears?: number | null;
    BPFinancingCoeffInPercent?: number | null;
    BPEquityRatioInPercent?: number | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPFiscalYearInformation>;
  readonly elements: __.ElementsOf<A_BPFiscalYearInformation>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPFiscalYearInformation extends _A_BPFiscalYearInformationAspect(__.Entity) {}
export class A_BPFiscalYearInformation_ extends Array<A_BPFiscalYearInformation> {
  $count?: number;
}

// entity 'A_BPIntlAddressVersion'
export declare function _A_BPIntlAddressVersionAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    AddressRepresentationCode?: __.Key<string>;
    AddresseeFullName?: string | null;
    AddressIDByExternalSystem?: string | null;
    AddressPersonID?: string | null;
    AddressSearchTerm1?: string | null;
    AddressSearchTerm2?: string | null;
    AddressTimeZone?: string | null;
    CareOfName?: string | null;
    CityName?: string | null;
    CityNumber?: string | null;
    CompanyPostalCode?: string | null;
    Country?: string | null;
    DeliveryServiceNumber?: string | null;
    DeliveryServiceTypeCode?: string | null;
    DistrictName?: string | null;
    FormOfAddress?: string | null;
    HouseNumber?: string | null;
    HouseNumberSupplementText?: string | null;
    Language?: string | null;
    OrganizationName1?: string | null;
    OrganizationName2?: string | null;
    OrganizationName3?: string | null;
    OrganizationName4?: string | null;
    PersonFamilyName?: string | null;
    PersonGivenName?: string | null;
    POBox?: string | null;
    POBoxDeviatingCityName?: string | null;
    POBoxDeviatingCountry?: string | null;
    POBoxDeviatingRegion?: string | null;
    POBoxIsWithoutNumber?: boolean | null;
    POBoxLobbyName?: string | null;
    POBoxPostalCode?: string | null;
    PostalCode?: string | null;
    PrfrdCommMediumType?: string | null;
    Region?: string | null;
    SecondaryRegion?: string | null;
    SecondaryRegionName?: string | null;
    StreetName?: string | null;
    StreetPrefixName1?: string | null;
    StreetPrefixName2?: string | null;
    StreetSuffixName1?: string | null;
    StreetSuffixName2?: string | null;
    TaxJurisdiction?: string | null;
    TertiaryRegion?: string | null;
    TertiaryRegionName?: string | null;
    TransportZone?: string | null;
    VillageName?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPIntlAddressVersion>;
  readonly elements: __.ElementsOf<A_BPIntlAddressVersion>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPIntlAddressVersion extends _A_BPIntlAddressVersionAspect(__.Entity) {}
export class A_BPIntlAddressVersion_ extends Array<A_BPIntlAddressVersion> {
  $count?: number;
}

// entity 'A_BPRelationship'
export declare function _A_BPRelationshipAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    RelationshipNumber?: __.Key<string>;
    BusinessPartner1?: __.Key<string>;
    BusinessPartner2?: __.Key<string>;
    ValidityEndDate?: __.Key<__.CdsDate>;
    ValidityStartDate?: __.CdsDate | null;
    IsStandardRelationship?: boolean | null;
    RelationshipCategory?: string | null;
    BPRelationshipType?: string | null;
    CreatedByUser?: string | null;
    CreationDate?: __.CdsDate | null;
    CreationTime?: __.CdsTime | null;
    LastChangedByUser?: string | null;
    LastChangeDate?: __.CdsDate | null;
    LastChangeTime?: __.CdsTime | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BPRelationship>;
  readonly elements: __.ElementsOf<A_BPRelationship>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BPRelationship extends _A_BPRelationshipAspect(__.Entity) {}
export class A_BPRelationship_ extends Array<A_BPRelationship> {
  $count?: number;
}

// entity 'A_BuPaAddressUsage'
export declare function _A_BuPaAddressUsageAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    ValidityEndDate?: __.Key<__.CdsDateTime>;
    AddressUsage?: __.Key<string>;
    AddressID?: __.Key<string>;
    ValidityStartDate?: __.CdsDateTime | null;
    StandardUsage?: boolean | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BuPaAddressUsage>;
  readonly elements: __.ElementsOf<A_BuPaAddressUsage>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BuPaAddressUsage extends _A_BuPaAddressUsageAspect(__.Entity) {}
export class A_BuPaAddressUsage_ extends Array<A_BuPaAddressUsage> {
  $count?: number;
}

// entity 'A_BuPaIdentification'
export declare function _A_BuPaIdentificationAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BPIdentificationType?: __.Key<string>;
    BPIdentificationNumber?: __.Key<string>;
    BPIdnNmbrIssuingInstitute?: string | null;
    BPIdentificationEntryDate?: __.CdsDate | null;
    Country?: string | null;
    Region?: string | null;
    ValidityStartDate?: __.CdsDate | null;
    ValidityEndDate?: __.CdsDate | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BuPaIdentification>;
  readonly elements: __.ElementsOf<A_BuPaIdentification>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BuPaIdentification extends _A_BuPaIdentificationAspect(__.Entity) {}
export class A_BuPaIdentification_ extends Array<A_BuPaIdentification> {
  $count?: number;
}

// entity 'A_BuPaIndustry'
export declare function _A_BuPaIndustryAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    IndustrySector?: __.Key<string>;
    IndustrySystemType?: __.Key<string>;
    BusinessPartner?: __.Key<string>;
    IsStandardIndustry?: string | null;
    IndustryKeyDescription?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BuPaIndustry>;
  readonly elements: __.ElementsOf<A_BuPaIndustry>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BuPaIndustry extends _A_BuPaIndustryAspect(__.Entity) {}
export class A_BuPaIndustry_ extends Array<A_BuPaIndustry> {
  $count?: number;
}

// entity 'A_BusinessPartner'
export declare function _A_BusinessPartnerAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    Customer?: string | null;
    Supplier?: string | null;
    AcademicTitle?: string | null;
    AuthorizationGroup?: string | null;
    BusinessPartnerCategory?: string | null;
    BusinessPartnerFullName?: string | null;
    BusinessPartnerGrouping?: string | null;
    BusinessPartnerName?: string | null;
    BusinessPartnerUUID?: string | null;
    CorrespondenceLanguage?: string | null;
    CreatedByUser?: string | null;
    CreationDate?: __.CdsDate | null;
    CreationTime?: __.CdsTime | null;
    FirstName?: string | null;
    FormOfAddress?: string | null;
    Industry?: string | null;
    InternationalLocationNumber1?: string | null;
    InternationalLocationNumber2?: string | null;
    IsFemale?: boolean | null;
    IsMale?: boolean | null;
    IsNaturalPerson?: string | null;
    IsSexUnknown?: boolean | null;
    GenderCodeName?: string | null;
    Language?: string | null;
    LastChangeDate?: __.CdsDate | null;
    LastChangeTime?: __.CdsTime | null;
    LastChangedByUser?: string | null;
    LastName?: string | null;
    LegalForm?: string | null;
    OrganizationBPName1?: string | null;
    OrganizationBPName2?: string | null;
    OrganizationBPName3?: string | null;
    OrganizationBPName4?: string | null;
    OrganizationFoundationDate?: __.CdsDate | null;
    OrganizationLiquidationDate?: __.CdsDate | null;
    SearchTerm1?: string | null;
    SearchTerm2?: string | null;
    AdditionalLastName?: string | null;
    BirthDate?: __.CdsDate | null;
    BusinessPartnerBirthDateStatus?: string | null;
    BusinessPartnerBirthplaceName?: string | null;
    BusinessPartnerDeathDate?: __.CdsDate | null;
    BusinessPartnerIsBlocked?: boolean | null;
    BusinessPartnerType?: string | null;
    ETag?: string | null;
    GroupBusinessPartnerName1?: string | null;
    GroupBusinessPartnerName2?: string | null;
    IndependentAddressID?: string | null;
    InternationalLocationNumber3?: string | null;
    MiddleName?: string | null;
    NameCountry?: string | null;
    NameFormat?: string | null;
    PersonFullName?: string | null;
    PersonNumber?: string | null;
    IsMarkedForArchiving?: boolean | null;
    BusinessPartnerIDByExtSystem?: string | null;
    BusinessPartnerPrintFormat?: string | null;
    BusinessPartnerOccupation?: string | null;
    BusPartMaritalStatus?: string | null;
    BusPartNationality?: string | null;
    BusinessPartnerBirthName?: string | null;
    BusinessPartnerSupplementName?: string | null;
    NaturalPersonEmployerName?: string | null;
    LastNamePrefix?: string | null;
    LastNameSecondPrefix?: string | null;
    Initials?: string | null;
    BPDataControllerIsNotRequired?: boolean | null;
    TradingPartner?: string | null;
    to_AddressIndependentEmail?: __.Association.to.many<A_BPAddressIndependentEmail_>;
    to_AddressIndependentFax?: __.Association.to.many<A_BPAddressIndependentFax_>;
    to_AddressIndependentMobile?: __.Association.to.many<A_BPAddressIndependentMobile_>;
    to_AddressIndependentPhone?: __.Association.to.many<A_BPAddressIndependentPhone_>;
    to_AddressIndependentWebsite?: __.Association.to.many<A_BPAddressIndependentWebsite_>;
    to_BPCreditWorthiness?: __.Association.to<A_BPCreditWorthiness> | null;
    to_BPCreditWorthiness_BusinessPartner?: string | null;
    to_BPDataController?: __.Association.to.many<A_BPDataController_>;
    to_BPEmployment?: __.Association.to.many<A_BPEmployment_>;
    to_BPFinServicesReporting?: __.Association.to<A_BPFinancialServicesReporting> | null;
    to_BPFinServicesReporting_BusinessPartner?: string | null;
    to_BPFiscalYearInformation?: __.Association.to.many<A_BPFiscalYearInformation_>;
    to_BPRelationship?: __.Association.to.many<A_BPRelationship_>;
    to_BuPaIdentification?: __.Association.to.many<A_BuPaIdentification_>;
    to_BuPaIndustry?: __.Association.to.many<A_BuPaIndustry_>;
    to_BusinessPartner?: __.Association.to<A_BPFinancialServicesExtn> | null;
    to_BusinessPartner_BusinessPartner?: string | null;
    to_BusinessPartnerAddress?: __.Association.to.many<A_BusinessPartnerAddress_>;
    to_BusinessPartnerAlias?: __.Association.to.many<A_BusinessPartnerAlias>;
    to_BusinessPartnerBank?: __.Association.to.many<A_BusinessPartnerBank_>;
    to_BusinessPartnerContact?: __.Association.to.many<A_BusinessPartnerContact_>;
    to_BusinessPartnerIsBank?: __.Association.to<A_BusinessPartnerIsBank> | null;
    to_BusinessPartnerIsBank_BusinessPartner?: string | null;
    to_BusinessPartnerRating?: __.Association.to.many<A_BusinessPartnerRating_>;
    to_BusinessPartnerRole?: __.Association.to.many<A_BusinessPartnerRole_>;
    to_BusinessPartnerTax?: __.Association.to.many<A_BusinessPartnerTaxNumber_>;
    to_BusPartAddrDepdntTaxNmbr?: __.Association.to.many<A_BusPartAddrDepdntTaxNmbr_>;
    to_Customer?: __.Association.to<A_Customer> | null;
    to_Customer_Customer?: string | null;
    to_PaymentCard?: __.Association.to.many<A_BusinessPartnerPaymentCard_>;
    to_Supplier?: __.Association.to<A_Supplier> | null;
    to_Supplier_Supplier?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartner>;
  readonly elements: __.ElementsOf<A_BusinessPartner>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartner extends _A_BusinessPartnerAspect(__.Entity) {}
export class A_BusinessPartner_ extends Array<A_BusinessPartner> {
  $count?: number;
}

// entity 'A_BusinessPartnerAddress'
export declare function _A_BusinessPartnerAddressAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    ValidityStartDate?: __.CdsDateTime | null;
    ValidityEndDate?: __.CdsDateTime | null;
    AuthorizationGroup?: string | null;
    AddressUUID?: string | null;
    AdditionalStreetPrefixName?: string | null;
    AdditionalStreetSuffixName?: string | null;
    AddressTimeZone?: string | null;
    CareOfName?: string | null;
    CityCode?: string | null;
    CityName?: string | null;
    CompanyPostalCode?: string | null;
    Country?: string | null;
    County?: string | null;
    DeliveryServiceNumber?: string | null;
    DeliveryServiceTypeCode?: string | null;
    District?: string | null;
    FormOfAddress?: string | null;
    FullName?: string | null;
    HomeCityName?: string | null;
    HouseNumber?: string | null;
    HouseNumberSupplementText?: string | null;
    Language?: string | null;
    POBox?: string | null;
    POBoxDeviatingCityName?: string | null;
    POBoxDeviatingCountry?: string | null;
    POBoxDeviatingRegion?: string | null;
    POBoxIsWithoutNumber?: boolean | null;
    POBoxLobbyName?: string | null;
    POBoxPostalCode?: string | null;
    Person?: string | null;
    PostalCode?: string | null;
    PrfrdCommMediumType?: string | null;
    Region?: string | null;
    StreetName?: string | null;
    StreetPrefixName?: string | null;
    StreetSuffixName?: string | null;
    TaxJurisdiction?: string | null;
    TransportZone?: string | null;
    AddressIDByExternalSystem?: string | null;
    CountyCode?: string | null;
    TownshipCode?: string | null;
    TownshipName?: string | null;
    to_AddressUsage?: __.Association.to.many<A_BuPaAddressUsage_>;
    to_BPAddrDepdntIntlLocNumber?: __.Association.to<A_BPAddrDepdntIntlLocNumber> | null;
    to_BPAddrDepdntIntlLocNumber_BusinessPartner?: string | null;
    to_BPAddrDepdntIntlLocNumber_AddressID?: string | null;
    to_BPIntlAddressVersion?: __.Association.to.many<A_BPIntlAddressVersion_>;
    to_EmailAddress?: __.Association.to.many<A_AddressEmailAddress_>;
    to_FaxNumber?: __.Association.to.many<A_AddressFaxNumber_>;
    to_MobilePhoneNumber?: __.Association.to.many<A_AddressPhoneNumber_>;
    to_PhoneNumber?: __.Association.to.many<A_AddressPhoneNumber_>;
    to_URLAddress?: __.Association.to.many<A_AddressHomePageURL_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerAddress>;
  readonly elements: __.ElementsOf<A_BusinessPartnerAddress>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerAddress extends _A_BusinessPartnerAddressAspect(__.Entity) {}
export class A_BusinessPartnerAddress_ extends Array<A_BusinessPartnerAddress> {
  $count?: number;
}

// entity 'A_BusinessPartnerAlia'
export declare function _A_BusinessPartnerAliaAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BPAliasPositionNumber?: __.Key<string>;
    BusinessPartnerAliasName?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerAlia>;
  readonly elements: __.ElementsOf<A_BusinessPartnerAlia>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerAlia extends _A_BusinessPartnerAliaAspect(__.Entity) {}
export class A_BusinessPartnerAlias extends Array<A_BusinessPartnerAlia> {
  $count?: number;
}

// entity 'A_BusinessPartnerBank'
export declare function _A_BusinessPartnerBankAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BankIdentification?: __.Key<string>;
    BankCountryKey?: string | null;
    BankName?: string | null;
    BankNumber?: string | null;
    SWIFTCode?: string | null;
    BankControlKey?: string | null;
    BankAccountHolderName?: string | null;
    BankAccountName?: string | null;
    ValidityStartDate?: __.CdsDateTime | null;
    ValidityEndDate?: __.CdsDateTime | null;
    IBAN?: string | null;
    IBANValidityStartDate?: __.CdsDate | null;
    BankAccount?: string | null;
    BankAccountReferenceText?: string | null;
    CollectionAuthInd?: boolean | null;
    CityName?: string | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerBank>;
  readonly elements: __.ElementsOf<A_BusinessPartnerBank>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerBank extends _A_BusinessPartnerBankAspect(__.Entity) {}
export class A_BusinessPartnerBank_ extends Array<A_BusinessPartnerBank> {
  $count?: number;
}

// entity 'A_BusinessPartnerContact'
export declare function _A_BusinessPartnerContactAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    RelationshipNumber?: __.Key<string>;
    BusinessPartnerCompany?: __.Key<string>;
    BusinessPartnerPerson?: __.Key<string>;
    ValidityEndDate?: __.Key<__.CdsDate>;
    ValidityStartDate?: __.CdsDate | null;
    IsStandardRelationship?: boolean | null;
    RelationshipCategory?: string | null;
    to_ContactAddress?: __.Association.to.many<A_BPContactToAddress_>;
    to_ContactRelationship?: __.Association.to<A_BPContactToFuncAndDept> | null;
    to_ContactRelationship_RelationshipNumber?: string | null;
    to_ContactRelationship_BusinessPartnerCompany?: string | null;
    to_ContactRelationship_BusinessPartnerPerson?: string | null;
    to_ContactRelationship_ValidityEndDate?: __.CdsDate | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerContact>;
  readonly elements: __.ElementsOf<A_BusinessPartnerContact>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerContact extends _A_BusinessPartnerContactAspect(__.Entity) {}
export class A_BusinessPartnerContact_ extends Array<A_BusinessPartnerContact> {
  $count?: number;
}

// entity 'A_BusinessPartnerIsBank'
export declare function _A_BusinessPartnerIsBankAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BankKey?: string | null;
    BankCountry?: string | null;
    BPMinimumReserve?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerIsBank>;
  readonly elements: __.ElementsOf<A_BusinessPartnerIsBank>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerIsBank extends _A_BusinessPartnerIsBankAspect(__.Entity) {}
export class A_BusinessPartnerIsBank_ extends Array<A_BusinessPartnerIsBank> {
  $count?: number;
}

// entity 'A_BusinessPartnerPaymentCard'
export declare function _A_BusinessPartnerPaymentCardAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    PaymentCardID?: __.Key<string>;
    PaymentCardType?: __.Key<string>;
    CardNumber?: __.Key<string>;
    IsStandardCard?: boolean | null;
    CardDescription?: string | null;
    ValidityDate?: __.CdsDate | null;
    ValidityEndDate?: __.CdsDate | null;
    CardHolder?: string | null;
    CardIssuingBank?: string | null;
    CardIssueDate?: __.CdsDate | null;
    PaymentCardLock?: string | null;
    MaskedCardNumber?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerPaymentCard>;
  readonly elements: __.ElementsOf<A_BusinessPartnerPaymentCard>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerPaymentCard extends _A_BusinessPartnerPaymentCardAspect(__.Entity) {}
export class A_BusinessPartnerPaymentCard_ extends Array<A_BusinessPartnerPaymentCard> {
  $count?: number;
}

// entity 'A_BusinessPartnerRating'
export declare function _A_BusinessPartnerRatingAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BusinessPartnerRatingProcedure?: __.Key<string>;
    BPRatingValidityEndDate?: __.Key<__.CdsDate>;
    BusinessPartnerRatingGrade?: string | null;
    BusinessPartnerRatingTrend?: string | null;
    BPRatingValidityStartDate?: __.CdsDate | null;
    BPRatingCreationDate?: __.CdsDate | null;
    BusinessPartnerRatingComment?: string | null;
    BusinessPartnerRatingIsAllowed?: boolean | null;
    BPRatingIsValidOnKeyDate?: boolean | null;
    BusinessPartnerRatingKeyDate?: __.CdsDate | null;
    BusinessPartnerRatingIsExpired?: boolean | null;
    BPRatingLongComment?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerRating>;
  readonly elements: __.ElementsOf<A_BusinessPartnerRating>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerRating extends _A_BusinessPartnerRatingAspect(__.Entity) {}
export class A_BusinessPartnerRating_ extends Array<A_BusinessPartnerRating> {
  $count?: number;
}

// entity 'A_BusinessPartnerRole'
export declare function _A_BusinessPartnerRoleAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BusinessPartnerRole?: __.Key<string>;
    ValidFrom?: __.CdsDateTime | null;
    ValidTo?: __.CdsDateTime | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerRole>;
  readonly elements: __.ElementsOf<A_BusinessPartnerRole>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerRole extends _A_BusinessPartnerRoleAspect(__.Entity) {}
export class A_BusinessPartnerRole_ extends Array<A_BusinessPartnerRole> {
  $count?: number;
}

// entity 'A_BusinessPartnerTaxNumber'
export declare function _A_BusinessPartnerTaxNumberAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    BPTaxType?: __.Key<string>;
    BPTaxNumber?: string | null;
    BPTaxLongNumber?: string | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusinessPartnerTaxNumber>;
  readonly elements: __.ElementsOf<A_BusinessPartnerTaxNumber>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusinessPartnerTaxNumber extends _A_BusinessPartnerTaxNumberAspect(__.Entity) {}
export class A_BusinessPartnerTaxNumber_ extends Array<A_BusinessPartnerTaxNumber> {
  $count?: number;
}

// entity 'A_BusPartAddrDepdntTaxNmbr'
export declare function _A_BusPartAddrDepdntTaxNmbrAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    BusinessPartner?: __.Key<string>;
    AddressID?: __.Key<string>;
    BPTaxType?: __.Key<string>;
    BPTaxNumber?: string | null;
    BPTaxLongNumber?: string | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_BusPartAddrDepdntTaxNmbr>;
  readonly elements: __.ElementsOf<A_BusPartAddrDepdntTaxNmbr>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_BusPartAddrDepdntTaxNmbr extends _A_BusPartAddrDepdntTaxNmbrAspect(__.Entity) {}
export class A_BusPartAddrDepdntTaxNmbr_ extends Array<A_BusPartAddrDepdntTaxNmbr> {
  $count?: number;
}

// entity 'A_CustAddrDepdntExtIdentifier'
export declare function _A_CustAddrDepdntExtIdentifierAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    AddressID?: __.Key<string>;
    CustomerExternalRefID?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustAddrDepdntExtIdentifier>;
  readonly elements: __.ElementsOf<A_CustAddrDepdntExtIdentifier>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustAddrDepdntExtIdentifier extends _A_CustAddrDepdntExtIdentifierAspect(__.Entity) {}
export class A_CustAddrDepdntExtIdentifier_ extends Array<A_CustAddrDepdntExtIdentifier> {
  $count?: number;
}

// entity 'A_CustAddrDepdntInformation'
export declare function _A_CustAddrDepdntInformationAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    AddressID?: __.Key<string>;
    ExpressTrainStationName?: string | null;
    TrainStationName?: string | null;
    CityCode?: string | null;
    County?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustAddrDepdntInformation>;
  readonly elements: __.ElementsOf<A_CustAddrDepdntInformation>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustAddrDepdntInformation extends _A_CustAddrDepdntInformationAspect(__.Entity) {}
export class A_CustAddrDepdntInformation_ extends Array<A_CustAddrDepdntInformation> {
  $count?: number;
}

// entity 'A_Customer'
export declare function _A_CustomerAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    AuthorizationGroup?: string | null;
    BillingIsBlockedForCustomer?: string | null;
    CreatedByUser?: string | null;
    CreationDate?: __.CdsDate | null;
    CustomerAccountGroup?: string | null;
    CustomerClassification?: string | null;
    CustomerFullName?: string | null;
    BPCustomerFullName?: string | null;
    CustomerName?: string | null;
    BPCustomerName?: string | null;
    DeliveryIsBlocked?: string | null;
    FreeDefinedAttribute01?: string | null;
    FreeDefinedAttribute02?: string | null;
    FreeDefinedAttribute03?: string | null;
    FreeDefinedAttribute04?: string | null;
    FreeDefinedAttribute05?: string | null;
    FreeDefinedAttribute06?: string | null;
    FreeDefinedAttribute07?: string | null;
    FreeDefinedAttribute08?: string | null;
    FreeDefinedAttribute09?: string | null;
    FreeDefinedAttribute10?: string | null;
    NFPartnerIsNaturalPerson?: string | null;
    OrderIsBlockedForCustomer?: string | null;
    PostingIsBlocked?: boolean | null;
    Supplier?: string | null;
    CustomerCorporateGroup?: string | null;
    FiscalAddress?: string | null;
    Industry?: string | null;
    IndustryCode1?: string | null;
    IndustryCode2?: string | null;
    IndustryCode3?: string | null;
    IndustryCode4?: string | null;
    IndustryCode5?: string | null;
    InternationalLocationNumber1?: string | null;
    InternationalLocationNumber2?: string | null;
    InternationalLocationNumber3?: string | null;
    NielsenRegion?: string | null;
    PaymentReason?: string | null;
    ResponsibleType?: string | null;
    TaxNumber1?: string | null;
    TaxNumber2?: string | null;
    TaxNumber3?: string | null;
    TaxNumber4?: string | null;
    TaxNumber5?: string | null;
    TaxNumberType?: string | null;
    VATRegistration?: string | null;
    DeletionIndicator?: boolean | null;
    ExpressTrainStationName?: string | null;
    TrainStationName?: string | null;
    CityCode?: string | null;
    County?: string | null;
    to_CustAddrDepdntExtIdentifier?: __.Association.to.many<A_CustAddrDepdntExtIdentifier_>;
    to_CustAddrDepdntInformation?: __.Association.to.many<A_CustAddrDepdntInformation_>;
    to_CustomerCompany?: __.Association.to.many<A_CustomerCompany_>;
    to_CustomerSalesArea?: __.Association.to.many<A_CustomerSalesArea_>;
    to_CustomerTaxGrouping?: __.Association.to.many<A_CustomerTaxGrouping_>;
    to_CustomerText?: __.Association.to.many<A_CustomerText_>;
    to_CustomerUnloadingPoint?: __.Association.to.many<A_CustomerUnloadingPoint_>;
    to_CustUnldgPtAddrDepdntInfo?: __.Association.to.many<A_CustUnldgPtAddrDepdntInfo_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_Customer>;
  readonly elements: __.ElementsOf<A_Customer>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_Customer extends _A_CustomerAspect(__.Entity) {}
export class A_Customer_ extends Array<A_Customer> {
  $count?: number;
}

// entity 'A_CustomerCompany'
export declare function _A_CustomerCompanyAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    CompanyCode?: __.Key<string>;
    APARToleranceGroup?: string | null;
    AccountByCustomer?: string | null;
    AccountingClerk?: string | null;
    AccountingClerkFaxNumber?: string | null;
    AccountingClerkInternetAddress?: string | null;
    AccountingClerkPhoneNumber?: string | null;
    AlternativePayerAccount?: string | null;
    AuthorizationGroup?: string | null;
    CollectiveInvoiceVariant?: string | null;
    CustomerAccountNote?: string | null;
    CustomerHeadOffice?: string | null;
    CustomerSupplierClearingIsUsed?: boolean | null;
    HouseBank?: string | null;
    InterestCalculationCode?: string | null;
    InterestCalculationDate?: __.CdsDate | null;
    IntrstCalcFrequencyInMonths?: string | null;
    IsToBeLocallyProcessed?: boolean | null;
    ItemIsToBePaidSeparately?: boolean | null;
    LayoutSortingRule?: string | null;
    PaymentBlockingReason?: string | null;
    PaymentMethodsList?: string | null;
    PaymentReason?: string | null;
    PaymentTerms?: string | null;
    PaytAdviceIsSentbyEDI?: boolean | null;
    PhysicalInventoryBlockInd?: boolean | null;
    ReconciliationAccount?: string | null;
    RecordPaymentHistoryIndicator?: boolean | null;
    UserAtCustomer?: string | null;
    DeletionIndicator?: boolean | null;
    CashPlanningGroup?: string | null;
    KnownOrNegotiatedLeave?: string | null;
    ValueAdjustmentKey?: string | null;
    CustomerAccountGroup?: string | null;
    to_CompanyText?: __.Association.to.many<A_CustomerCompanyText_>;
    to_CustomerDunning?: __.Association.to.many<A_CustomerDunning_>;
    to_WithHoldingTax?: __.Association.to.many<A_CustomerWithHoldingTax_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerCompany>;
  readonly elements: __.ElementsOf<A_CustomerCompany>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerCompany extends _A_CustomerCompanyAspect(__.Entity) {}
export class A_CustomerCompany_ extends Array<A_CustomerCompany> {
  $count?: number;
}

// entity 'A_CustomerCompanyText'
export declare function _A_CustomerCompanyTextAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    CompanyCode?: __.Key<string>;
    Language?: __.Key<string>;
    LongTextID?: __.Key<string>;
    LongText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerCompanyText>;
  readonly elements: __.ElementsOf<A_CustomerCompanyText>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerCompanyText extends _A_CustomerCompanyTextAspect(__.Entity) {}
export class A_CustomerCompanyText_ extends Array<A_CustomerCompanyText> {
  $count?: number;
}

// entity 'A_CustomerDunning'
export declare function _A_CustomerDunningAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    CompanyCode?: __.Key<string>;
    DunningArea?: __.Key<string>;
    DunningBlock?: string | null;
    DunningLevel?: string | null;
    DunningProcedure?: string | null;
    DunningRecipient?: string | null;
    LastDunnedOn?: __.CdsDate | null;
    LegDunningProcedureOn?: __.CdsDate | null;
    DunningClerk?: string | null;
    AuthorizationGroup?: string | null;
    CustomerAccountGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerDunning>;
  readonly elements: __.ElementsOf<A_CustomerDunning>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerDunning extends _A_CustomerDunningAspect(__.Entity) {}
export class A_CustomerDunning_ extends Array<A_CustomerDunning> {
  $count?: number;
}

// entity 'A_CustomerSalesArea'
export declare function _A_CustomerSalesAreaAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    SalesOrganization?: __.Key<string>;
    DistributionChannel?: __.Key<string>;
    Division?: __.Key<string>;
    AccountByCustomer?: string | null;
    AuthorizationGroup?: string | null;
    BillingIsBlockedForCustomer?: string | null;
    CompleteDeliveryIsDefined?: boolean | null;
    CreditControlArea?: string | null;
    Currency?: string | null;
    CustIsRlvtForSettlmtMgmt?: boolean | null;
    CustomerABCClassification?: string | null;
    CustomerAccountAssignmentGroup?: string | null;
    CustomerGroup?: string | null;
    CustomerIsRebateRelevant?: boolean | null;
    CustomerPaymentTerms?: string | null;
    CustomerPriceGroup?: string | null;
    CustomerPricingProcedure?: string | null;
    CustProdProposalProcedure?: string | null;
    DeliveryIsBlockedForCustomer?: string | null;
    DeliveryPriority?: string | null;
    IncotermsClassification?: string | null;
    IncotermsLocation2?: string | null;
    IncotermsVersion?: string | null;
    IncotermsLocation1?: string | null;
    IncotermsSupChnLoc1AddlUUID?: string | null;
    IncotermsSupChnLoc2AddlUUID?: string | null;
    IncotermsSupChnDvtgLocAddlUUID?: string | null;
    DeletionIndicator?: boolean | null;
    IncotermsTransferLocation?: string | null;
    InspSbstHasNoTimeOrQuantity?: boolean | null;
    InvoiceDate?: string | null;
    ItemOrderProbabilityInPercent?: string | null;
    ManualInvoiceMaintIsRelevant?: boolean | null;
    MaxNmbrOfPartialDelivery?: number | null;
    OrderCombinationIsAllowed?: boolean | null;
    OrderIsBlockedForCustomer?: string | null;
    OverdelivTolrtdLmtRatioInPct?: number | null;
    PartialDeliveryIsAllowed?: string | null;
    PriceListType?: string | null;
    ProductUnitGroup?: string | null;
    ProofOfDeliveryTimeValue?: number | null;
    SalesGroup?: string | null;
    SalesItemProposal?: string | null;
    SalesOffice?: string | null;
    ShippingCondition?: string | null;
    SlsDocIsRlvtForProofOfDeliv?: boolean | null;
    SlsUnlmtdOvrdelivIsAllwd?: boolean | null;
    SupplyingPlant?: string | null;
    SalesDistrict?: string | null;
    UnderdelivTolrtdLmtRatioInPct?: number | null;
    InvoiceListSchedule?: string | null;
    ExchangeRateType?: string | null;
    AdditionalCustomerGroup1?: string | null;
    AdditionalCustomerGroup2?: string | null;
    AdditionalCustomerGroup3?: string | null;
    AdditionalCustomerGroup4?: string | null;
    AdditionalCustomerGroup5?: string | null;
    PaymentGuaranteeProcedure?: string | null;
    CustomerAccountGroup?: string | null;
    to_PartnerFunction?: __.Association.to.many<A_CustSalesPartnerFunc_>;
    to_SalesAreaTax?: __.Association.to.many<A_CustomerSalesAreaTax_>;
    to_SalesAreaText?: __.Association.to.many<A_CustomerSalesAreaText_>;
    to_SlsAreaAddrDepdntInfo?: __.Association.to.many<A_CustSlsAreaAddrDepdntInfo_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerSalesArea>;
  readonly elements: __.ElementsOf<A_CustomerSalesArea>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerSalesArea extends _A_CustomerSalesAreaAspect(__.Entity) {}
export class A_CustomerSalesArea_ extends Array<A_CustomerSalesArea> {
  $count?: number;
}

// entity 'A_CustomerSalesAreaTax'
export declare function _A_CustomerSalesAreaTaxAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    SalesOrganization?: __.Key<string>;
    DistributionChannel?: __.Key<string>;
    Division?: __.Key<string>;
    DepartureCountry?: __.Key<string>;
    CustomerTaxCategory?: __.Key<string>;
    CustomerTaxClassification?: string | null;
    to_SlsAreaAddrDepdntTax?: __.Association.to.many<A_CustSlsAreaAddrDepdntTaxInfo_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerSalesAreaTax>;
  readonly elements: __.ElementsOf<A_CustomerSalesAreaTax>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerSalesAreaTax extends _A_CustomerSalesAreaTaxAspect(__.Entity) {}
export class A_CustomerSalesAreaTax_ extends Array<A_CustomerSalesAreaTax> {
  $count?: number;
}

// entity 'A_CustomerSalesAreaText'
export declare function _A_CustomerSalesAreaTextAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    SalesOrganization?: __.Key<string>;
    DistributionChannel?: __.Key<string>;
    Division?: __.Key<string>;
    Language?: __.Key<string>;
    LongTextID?: __.Key<string>;
    LongText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerSalesAreaText>;
  readonly elements: __.ElementsOf<A_CustomerSalesAreaText>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerSalesAreaText extends _A_CustomerSalesAreaTextAspect(__.Entity) {}
export class A_CustomerSalesAreaText_ extends Array<A_CustomerSalesAreaText> {
  $count?: number;
}

// entity 'A_CustomerTaxGrouping'
export declare function _A_CustomerTaxGroupingAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    CustomerTaxGroupingCode?: __.Key<string>;
    CustTaxGrpExemptionCertificate?: string | null;
    CustTaxGroupExemptionRate?: number | null;
    CustTaxGroupExemptionStartDate?: __.CdsDate | null;
    CustTaxGroupExemptionEndDate?: __.CdsDate | null;
    CustTaxGroupSubjectedStartDate?: __.CdsDate | null;
    CustTaxGroupSubjectedEndDate?: __.CdsDate | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerTaxGrouping>;
  readonly elements: __.ElementsOf<A_CustomerTaxGrouping>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerTaxGrouping extends _A_CustomerTaxGroupingAspect(__.Entity) {}
export class A_CustomerTaxGrouping_ extends Array<A_CustomerTaxGrouping> {
  $count?: number;
}

// entity 'A_CustomerText'
export declare function _A_CustomerTextAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    Language?: __.Key<string>;
    LongTextID?: __.Key<string>;
    LongText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerText>;
  readonly elements: __.ElementsOf<A_CustomerText>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerText extends _A_CustomerTextAspect(__.Entity) {}
export class A_CustomerText_ extends Array<A_CustomerText> {
  $count?: number;
}

// entity 'A_CustomerUnloadingPoint'
export declare function _A_CustomerUnloadingPointAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    UnloadingPointName?: __.Key<string>;
    CustomerFactoryCalenderCode?: string | null;
    BPGoodsReceivingHoursCode?: string | null;
    IsDfltBPUnloadingPoint?: boolean | null;
    MondayMorningOpeningTime?: __.CdsTime | null;
    MondayMorningClosingTime?: __.CdsTime | null;
    MondayAfternoonOpeningTime?: __.CdsTime | null;
    MondayAfternoonClosingTime?: __.CdsTime | null;
    TuesdayMorningOpeningTime?: __.CdsTime | null;
    TuesdayMorningClosingTime?: __.CdsTime | null;
    TuesdayAfternoonOpeningTime?: __.CdsTime | null;
    TuesdayAfternoonClosingTime?: __.CdsTime | null;
    WednesdayMorningOpeningTime?: __.CdsTime | null;
    WednesdayMorningClosingTime?: __.CdsTime | null;
    WednesdayAfternoonOpeningTime?: __.CdsTime | null;
    WednesdayAfternoonClosingTime?: __.CdsTime | null;
    ThursdayMorningOpeningTime?: __.CdsTime | null;
    ThursdayMorningClosingTime?: __.CdsTime | null;
    ThursdayAfternoonOpeningTime?: __.CdsTime | null;
    ThursdayAfternoonClosingTime?: __.CdsTime | null;
    FridayMorningOpeningTime?: __.CdsTime | null;
    FridayMorningClosingTime?: __.CdsTime | null;
    FridayAfternoonOpeningTime?: __.CdsTime | null;
    FridayAfternoonClosingTime?: __.CdsTime | null;
    SaturdayMorningOpeningTime?: __.CdsTime | null;
    SaturdayMorningClosingTime?: __.CdsTime | null;
    SaturdayAfternoonOpeningTime?: __.CdsTime | null;
    SaturdayAfternoonClosingTime?: __.CdsTime | null;
    SundayMorningOpeningTime?: __.CdsTime | null;
    SundayMorningClosingTime?: __.CdsTime | null;
    SundayAfternoonOpeningTime?: __.CdsTime | null;
    SundayAfternoonClosingTime?: __.CdsTime | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerUnloadingPoint>;
  readonly elements: __.ElementsOf<A_CustomerUnloadingPoint>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerUnloadingPoint extends _A_CustomerUnloadingPointAspect(__.Entity) {}
export class A_CustomerUnloadingPoint_ extends Array<A_CustomerUnloadingPoint> {
  $count?: number;
}

// entity 'A_CustomerWithHoldingTax'
export declare function _A_CustomerWithHoldingTaxAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    CompanyCode?: __.Key<string>;
    WithholdingTaxType?: __.Key<string>;
    WithholdingTaxCode?: string | null;
    WithholdingTaxAgent?: boolean | null;
    ObligationDateBegin?: __.CdsDate | null;
    ObligationDateEnd?: __.CdsDate | null;
    WithholdingTaxNumber?: string | null;
    WithholdingTaxCertificate?: string | null;
    WithholdingTaxExmptPercent?: number | null;
    ExemptionDateBegin?: __.CdsDate | null;
    ExemptionDateEnd?: __.CdsDate | null;
    ExemptionReason?: string | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustomerWithHoldingTax>;
  readonly elements: __.ElementsOf<A_CustomerWithHoldingTax>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustomerWithHoldingTax extends _A_CustomerWithHoldingTaxAspect(__.Entity) {}
export class A_CustomerWithHoldingTax_ extends Array<A_CustomerWithHoldingTax> {
  $count?: number;
}

// entity 'A_CustSalesPartnerFunc'
export declare function _A_CustSalesPartnerFuncAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    SalesOrganization?: __.Key<string>;
    DistributionChannel?: __.Key<string>;
    Division?: __.Key<string>;
    PartnerCounter?: __.Key<string>;
    PartnerFunction?: __.Key<string>;
    BPCustomerNumber?: string | null;
    CustomerPartnerDescription?: string | null;
    DefaultPartner?: boolean | null;
    Supplier?: string | null;
    PersonnelNumber?: string | null;
    ContactPerson?: string | null;
    AddressID?: string | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustSalesPartnerFunc>;
  readonly elements: __.ElementsOf<A_CustSalesPartnerFunc>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustSalesPartnerFunc extends _A_CustSalesPartnerFuncAspect(__.Entity) {}
export class A_CustSalesPartnerFunc_ extends Array<A_CustSalesPartnerFunc> {
  $count?: number;
}

// entity 'A_CustSlsAreaAddrDepdntInfo'
export declare function _A_CustSlsAreaAddrDepdntInfoAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    SalesOrganization?: __.Key<string>;
    DistributionChannel?: __.Key<string>;
    Division?: __.Key<string>;
    AddressID?: __.Key<string>;
    IncotermsClassification?: string | null;
    IncotermsLocation1?: string | null;
    IncotermsLocation2?: string | null;
    IncotermsSupChnLoc1AddlUUID?: string | null;
    IncotermsSupChnLoc2AddlUUID?: string | null;
    IncotermsSupChnDvtgLocAddlUUID?: string | null;
    DeliveryIsBlocked?: string | null;
    SalesOffice?: string | null;
    SalesGroup?: string | null;
    ShippingCondition?: string | null;
    SupplyingPlant?: string | null;
    IncotermsVersion?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustSlsAreaAddrDepdntInfo>;
  readonly elements: __.ElementsOf<A_CustSlsAreaAddrDepdntInfo>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustSlsAreaAddrDepdntInfo extends _A_CustSlsAreaAddrDepdntInfoAspect(__.Entity) {}
export class A_CustSlsAreaAddrDepdntInfo_ extends Array<A_CustSlsAreaAddrDepdntInfo> {
  $count?: number;
}

// entity 'A_CustSlsAreaAddrDepdntTaxInfo'
export declare function _A_CustSlsAreaAddrDepdntTaxInfoAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    SalesOrganization?: __.Key<string>;
    DistributionChannel?: __.Key<string>;
    Division?: __.Key<string>;
    AddressID?: __.Key<string>;
    DepartureCountry?: __.Key<string>;
    CustomerTaxCategory?: __.Key<string>;
    CustomerTaxClassification?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustSlsAreaAddrDepdntTaxInfo>;
  readonly elements: __.ElementsOf<A_CustSlsAreaAddrDepdntTaxInfo>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustSlsAreaAddrDepdntTaxInfo extends _A_CustSlsAreaAddrDepdntTaxInfoAspect(__.Entity) {}
export class A_CustSlsAreaAddrDepdntTaxInfo_ extends Array<A_CustSlsAreaAddrDepdntTaxInfo> {
  $count?: number;
}

// entity 'A_CustUnldgPtAddrDepdntInfo'
export declare function _A_CustUnldgPtAddrDepdntInfoAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Customer?: __.Key<string>;
    AddressID?: __.Key<string>;
    UnloadingPointName?: __.Key<string>;
    CustomerFactoryCalenderCode?: string | null;
    BPGoodsReceivingHoursCode?: string | null;
    IsDfltBPUnloadingPoint?: boolean | null;
    MondayMorningOpeningTime?: __.CdsTime | null;
    MondayMorningClosingTime?: __.CdsTime | null;
    MondayAfternoonOpeningTime?: __.CdsTime | null;
    MondayAfternoonClosingTime?: __.CdsTime | null;
    TuesdayMorningOpeningTime?: __.CdsTime | null;
    TuesdayMorningClosingTime?: __.CdsTime | null;
    TuesdayAfternoonOpeningTime?: __.CdsTime | null;
    TuesdayAfternoonClosingTime?: __.CdsTime | null;
    WednesdayMorningOpeningTime?: __.CdsTime | null;
    WednesdayMorningClosingTime?: __.CdsTime | null;
    WednesdayAfternoonOpeningTime?: __.CdsTime | null;
    WednesdayAfternoonClosingTime?: __.CdsTime | null;
    ThursdayMorningOpeningTime?: __.CdsTime | null;
    ThursdayMorningClosingTime?: __.CdsTime | null;
    ThursdayAfternoonOpeningTime?: __.CdsTime | null;
    ThursdayAfternoonClosingTime?: __.CdsTime | null;
    FridayMorningOpeningTime?: __.CdsTime | null;
    FridayMorningClosingTime?: __.CdsTime | null;
    FridayAfternoonOpeningTime?: __.CdsTime | null;
    FridayAfternoonClosingTime?: __.CdsTime | null;
    SaturdayMorningOpeningTime?: __.CdsTime | null;
    SaturdayMorningClosingTime?: __.CdsTime | null;
    SaturdayAfternoonOpeningTime?: __.CdsTime | null;
    SaturdayAfternoonClosingTime?: __.CdsTime | null;
    SundayMorningOpeningTime?: __.CdsTime | null;
    SundayMorningClosingTime?: __.CdsTime | null;
    SundayAfternoonOpeningTime?: __.CdsTime | null;
    SundayAfternoonClosingTime?: __.CdsTime | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_CustUnldgPtAddrDepdntInfo>;
  readonly elements: __.ElementsOf<A_CustUnldgPtAddrDepdntInfo>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_CustUnldgPtAddrDepdntInfo extends _A_CustUnldgPtAddrDepdntInfoAspect(__.Entity) {}
export class A_CustUnldgPtAddrDepdntInfo_ extends Array<A_CustUnldgPtAddrDepdntInfo> {
  $count?: number;
}

// entity 'A_Supplier'
export declare function _A_SupplierAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    AlternativePayeeAccountNumber?: string | null;
    AuthorizationGroup?: string | null;
    BusinessPartnerPanNumber?: string | null;
    CreatedByUser?: string | null;
    CreationDate?: __.CdsDate | null;
    Customer?: string | null;
    PaymentIsBlockedForSupplier?: boolean | null;
    PostingIsBlocked?: boolean | null;
    PurchasingIsBlocked?: boolean | null;
    SupplierAccountGroup?: string | null;
    SupplierFullName?: string | null;
    SupplierName?: string | null;
    VATRegistration?: string | null;
    BirthDate?: __.CdsDate | null;
    ConcatenatedInternationalLocNo?: string | null;
    DeletionIndicator?: boolean | null;
    FiscalAddress?: string | null;
    Industry?: string | null;
    InternationalLocationNumber1?: string | null;
    InternationalLocationNumber2?: string | null;
    InternationalLocationNumber3?: string | null;
    IsNaturalPerson?: string | null;
    PaymentReason?: string | null;
    ResponsibleType?: string | null;
    SuplrQltyInProcmtCertfnValidTo?: __.CdsDate | null;
    SuplrQualityManagementSystem?: string | null;
    SupplierCorporateGroup?: string | null;
    SupplierProcurementBlock?: string | null;
    TaxNumber1?: string | null;
    TaxNumber2?: string | null;
    TaxNumber3?: string | null;
    TaxNumber4?: string | null;
    TaxNumber5?: string | null;
    TaxNumberResponsible?: string | null;
    TaxNumberType?: string | null;
    SuplrProofOfDelivRlvtCode?: string | null;
    BR_TaxIsSplit?: boolean | null;
    DataExchangeInstructionKey?: string | null;
    to_SupplierCompany?: __.Association.to.many<A_SupplierCompany_>;
    to_SupplierPurchasingOrg?: __.Association.to.many<A_SupplierPurchasingOrg_>;
    to_SupplierText?: __.Association.to.many<A_SupplierText_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_Supplier>;
  readonly elements: __.ElementsOf<A_Supplier>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_Supplier extends _A_SupplierAspect(__.Entity) {}
export class A_Supplier_ extends Array<A_Supplier> {
  $count?: number;
}

// entity 'A_SupplierCompany'
export declare function _A_SupplierCompanyAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    CompanyCode?: __.Key<string>;
    AuthorizationGroup?: string | null;
    CompanyCodeName?: string | null;
    PaymentBlockingReason?: string | null;
    SupplierIsBlockedForPosting?: boolean | null;
    AccountingClerk?: string | null;
    AccountingClerkFaxNumber?: string | null;
    AccountingClerkPhoneNumber?: string | null;
    SupplierClerk?: string | null;
    SupplierClerkURL?: string | null;
    PaymentMethodsList?: string | null;
    PaymentReason?: string | null;
    PaymentTerms?: string | null;
    ClearCustomerSupplier?: boolean | null;
    IsToBeLocallyProcessed?: boolean | null;
    ItemIsToBePaidSeparately?: boolean | null;
    PaymentIsToBeSentByEDI?: boolean | null;
    HouseBank?: string | null;
    CheckPaidDurationInDays?: number | null;
    Currency?: string | null;
    BillOfExchLmtAmtInCoCodeCrcy?: number | null;
    SupplierClerkIDBySupplier?: string | null;
    ReconciliationAccount?: string | null;
    InterestCalculationCode?: string | null;
    InterestCalculationDate?: __.CdsDate | null;
    IntrstCalcFrequencyInMonths?: string | null;
    SupplierHeadOffice?: string | null;
    AlternativePayee?: string | null;
    LayoutSortingRule?: string | null;
    APARToleranceGroup?: string | null;
    SupplierCertificationDate?: __.CdsDate | null;
    SupplierAccountNote?: string | null;
    WithholdingTaxCountry?: string | null;
    DeletionIndicator?: boolean | null;
    CashPlanningGroup?: string | null;
    IsToBeCheckedForDuplicates?: boolean | null;
    MinorityGroup?: string | null;
    SupplierAccountGroup?: string | null;
    to_CompanyText?: __.Association.to.many<A_SupplierCompanyText_>;
    to_Supplier?: __.Association.to<A_Supplier> | null;
    to_Supplier_Supplier?: string | null;
    to_SupplierDunning?: __.Association.to.many<A_SupplierDunning_>;
    to_SupplierWithHoldingTax?: __.Association.to.many<A_SupplierWithHoldingTax_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_SupplierCompany>;
  readonly elements: __.ElementsOf<A_SupplierCompany>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_SupplierCompany extends _A_SupplierCompanyAspect(__.Entity) {}
export class A_SupplierCompany_ extends Array<A_SupplierCompany> {
  $count?: number;
}

// entity 'A_SupplierCompanyText'
export declare function _A_SupplierCompanyTextAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    CompanyCode?: __.Key<string>;
    Language?: __.Key<string>;
    LongTextID?: __.Key<string>;
    LongText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_SupplierCompanyText>;
  readonly elements: __.ElementsOf<A_SupplierCompanyText>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_SupplierCompanyText extends _A_SupplierCompanyTextAspect(__.Entity) {}
export class A_SupplierCompanyText_ extends Array<A_SupplierCompanyText> {
  $count?: number;
}

// entity 'A_SupplierDunning'
export declare function _A_SupplierDunningAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    CompanyCode?: __.Key<string>;
    DunningArea?: __.Key<string>;
    DunningBlock?: string | null;
    DunningLevel?: string | null;
    DunningProcedure?: string | null;
    DunningRecipient?: string | null;
    LastDunnedOn?: __.CdsDate | null;
    LegDunningProcedureOn?: __.CdsDate | null;
    DunningClerk?: string | null;
    AuthorizationGroup?: string | null;
    SupplierAccountGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_SupplierDunning>;
  readonly elements: __.ElementsOf<A_SupplierDunning>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_SupplierDunning extends _A_SupplierDunningAspect(__.Entity) {}
export class A_SupplierDunning_ extends Array<A_SupplierDunning> {
  $count?: number;
}

// entity 'A_SupplierPartnerFunc'
export declare function _A_SupplierPartnerFuncAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    PurchasingOrganization?: __.Key<string>;
    SupplierSubrange?: __.Key<string>;
    Plant?: __.Key<string>;
    PartnerFunction?: __.Key<string>;
    PartnerCounter?: __.Key<string>;
    DefaultPartner?: boolean | null;
    CreationDate?: __.CdsDate | null;
    CreatedByUser?: string | null;
    ReferenceSupplier?: string | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_SupplierPartnerFunc>;
  readonly elements: __.ElementsOf<A_SupplierPartnerFunc>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_SupplierPartnerFunc extends _A_SupplierPartnerFuncAspect(__.Entity) {}
export class A_SupplierPartnerFunc_ extends Array<A_SupplierPartnerFunc> {
  $count?: number;
}

// entity 'A_SupplierPurchasingOrg'
export declare function _A_SupplierPurchasingOrgAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    PurchasingOrganization?: __.Key<string>;
    AutomaticEvaluatedRcptSettlmt?: boolean | null;
    CalculationSchemaGroupCode?: string | null;
    DeletionIndicator?: boolean | null;
    EvaldReceiptSettlementIsActive?: boolean | null;
    IncotermsClassification?: string | null;
    IncotermsTransferLocation?: string | null;
    IncotermsVersion?: string | null;
    IncotermsLocation1?: string | null;
    IncotermsLocation2?: string | null;
    IncotermsSupChnLoc1AddlUUID?: string | null;
    IncotermsSupChnLoc2AddlUUID?: string | null;
    IncotermsSupChnDvtgLocAddlUUID?: string | null;
    IntrastatCrsBorderTrMode?: string | null;
    InvoiceIsGoodsReceiptBased?: boolean | null;
    InvoiceIsMMServiceEntryBased?: boolean | null;
    MaterialPlannedDeliveryDurn?: number | null;
    MinimumOrderAmount?: number | null;
    PaymentTerms?: string | null;
    PlanningCycle?: string | null;
    PricingDateControl?: string | null;
    ProdStockAndSlsDataTransfPrfl?: string | null;
    ProductUnitGroup?: string | null;
    PurOrdAutoGenerationIsAllowed?: boolean | null;
    PurchaseOrderCurrency?: string | null;
    PurchasingGroup?: string | null;
    PurchasingIsBlockedForSupplier?: boolean | null;
    RoundingProfile?: string | null;
    ShippingCondition?: string | null;
    SuplrDiscountInKindIsGranted?: boolean | null;
    SuplrInvcRevalIsAllowed?: boolean | null;
    SuplrIsRlvtForSettlmtMgmt?: boolean | null;
    SuplrPurgOrgIsRlvtForPriceDetn?: boolean | null;
    SupplierABCClassificationCode?: string | null;
    SupplierAccountNumber?: string | null;
    SupplierIsReturnsSupplier?: boolean | null;
    SupplierPhoneNumber?: string | null;
    SupplierRespSalesPersonName?: string | null;
    SupplierConfirmationControlKey?: string | null;
    IsOrderAcknRqd?: boolean | null;
    AuthorizationGroup?: string | null;
    SupplierAccountGroup?: string | null;
    to_PartnerFunction?: __.Association.to.many<A_SupplierPartnerFunc_>;
    to_PurchasingOrgText?: __.Association.to.many<A_SupplierPurchasingOrgText_>;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_SupplierPurchasingOrg>;
  readonly elements: __.ElementsOf<A_SupplierPurchasingOrg>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_SupplierPurchasingOrg extends _A_SupplierPurchasingOrgAspect(__.Entity) {}
export class A_SupplierPurchasingOrg_ extends Array<A_SupplierPurchasingOrg> {
  $count?: number;
}

// entity 'A_SupplierPurchasingOrgText'
export declare function _A_SupplierPurchasingOrgTextAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    PurchasingOrganization?: __.Key<string>;
    Language?: __.Key<string>;
    LongTextID?: __.Key<string>;
    LongText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_SupplierPurchasingOrgText>;
  readonly elements: __.ElementsOf<A_SupplierPurchasingOrgText>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_SupplierPurchasingOrgText extends _A_SupplierPurchasingOrgTextAspect(__.Entity) {}
export class A_SupplierPurchasingOrgText_ extends Array<A_SupplierPurchasingOrgText> {
  $count?: number;
}

// entity 'A_SupplierText'
export declare function _A_SupplierTextAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    Language?: __.Key<string>;
    LongTextID?: __.Key<string>;
    LongText?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_SupplierText>;
  readonly elements: __.ElementsOf<A_SupplierText>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_SupplierText extends _A_SupplierTextAspect(__.Entity) {}
export class A_SupplierText_ extends Array<A_SupplierText> {
  $count?: number;
}

// entity 'A_SupplierWithHoldingTax'
export declare function _A_SupplierWithHoldingTaxAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    Supplier?: __.Key<string>;
    CompanyCode?: __.Key<string>;
    WithholdingTaxType?: __.Key<string>;
    ExemptionDateBegin?: __.CdsDate | null;
    ExemptionDateEnd?: __.CdsDate | null;
    ExemptionReason?: string | null;
    IsWithholdingTaxSubject?: boolean | null;
    RecipientType?: string | null;
    WithholdingTaxCertificate?: string | null;
    WithholdingTaxCode?: string | null;
    WithholdingTaxExmptPercent?: number | null;
    WithholdingTaxNumber?: string | null;
    AuthorizationGroup?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<A_SupplierWithHoldingTax>;
  readonly elements: __.ElementsOf<A_SupplierWithHoldingTax>;
  readonly actions: globalThis.Record<never, never>;
};
export class A_SupplierWithHoldingTax extends _A_SupplierWithHoldingTaxAspect(__.Entity) {}
export class A_SupplierWithHoldingTax_ extends Array<A_SupplierWithHoldingTax> {
  $count?: number;
}
