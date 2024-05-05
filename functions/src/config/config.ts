export const env = {
  LOCAL: 'local',
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
  CURRENT: process.env.FORCED_ENV || 'local',
};

export const getUrls = () => ({
  API: env.CURRENT === env.PRODUCTION ? '' : '',
  PROFILE: env.CURRENT === env.PRODUCTION ? '' : '',
  SHOP: env.CURRENT === env.PRODUCTION ? '' : '',
})

export enum Country {
  AT = "AT", // Austria
  BE = "BE", // Belgium
  BG = "BG", // Bulgaria
  CY = "CY", // Cyprus
  CZ = "CZ", // Czech Republic
  DE = "DE", // Germany
  DK = "DK", // Denmark
  EE = "EE", // Estonia
  ES = "ES", // Spain
  FI = "FI", // Finland
  FR = "FR", // France
  GR = "GR", // Greece
  HR = "HR", // Croatia
  HU = "HU", // Hungary
  IE = "IE", // Ireland
  IT = "IT", // Italy
  LT = "LT", // Lithuania
  LU = "LU", // Luxembourg
  LV = "LV", // Latvia
  MT = "MT", // Malta
  NL = "NL", // Netherlands
  PL = "PL", // Poland
  PT = "PT", // Portugal
  RO = "RO", // Romania
  SE = "SE", // Sweden
  SI = "SI", // Slovenia
  SK = "SK", // Slovakia
  GLOBAL = "GLOBAL",
}

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  BGN = 'BGN',
  CZK = 'CZK',
  DKK = 'DKK',
  HUF = 'HUF',
  PLN = 'PLN',
  RON = 'RON',
  SEK = 'SEK',
}

export interface CountryInfo {
  currency: Currency;
  language: string;
  phonePrefix: string;
  timezone: string;
}

export const countries: Record<Country, CountryInfo> = {
  [Country.GLOBAL]: {
    currency: Currency.USD,
    language: "en",
    phonePrefix: "+49",
    timezone: "CET",
  },
  [Country.AT]: {
    currency: Currency.EUR,
    language: "de",
    phonePrefix: "+43",
    timezone: "CET",
  },
  [Country.BE]: {
    currency: Currency.EUR,
    language: "nl",
    phonePrefix: "+32",
    timezone: "CET",
  },
  [Country.BG]: {
    currency: Currency.BGN,
    language: "bg",
    phonePrefix: "+359",
    timezone: "EET",
  },
  [Country.CY]: {
    currency: Currency.EUR,
    language: "el",
    phonePrefix: "+357",
    timezone: "EET",
  },
  [Country.CZ]: {
    currency: Currency.CZK,
    language: "cs",
    phonePrefix: "+420",
    timezone: "CET",
  },
  [Country.DE]: {
    currency: Currency.EUR,
    language: "de",
    phonePrefix: "+49",
    timezone: "CET",
  },
  [Country.DK]: {
    currency: Currency.DKK,
    language: "da",
    phonePrefix: "+45",
    timezone: "CET",
  },
  [Country.EE]: {
    currency: Currency.EUR,
    language: "et",
    phonePrefix: "+372",
    timezone: "EET",
  },
  [Country.ES]: {
    currency: Currency.EUR,
    language: "es",
    phonePrefix: "+34",
    timezone: "CET",
  },
  [Country.FI]: {
    currency: Currency.EUR,
    language: "fi",
    phonePrefix: "+358",
    timezone: "EET",
  },
  [Country.FR]: {
    currency: Currency.EUR,
    language: "fr",
    phonePrefix: "+33",
    timezone: "CET",
  },
  [Country.GR]: {
    currency: Currency.EUR,
    language: "el",
    phonePrefix: "+30",
    timezone: "EET",
  },
  [Country.HR]: {
    currency: Currency.EUR,
    language: "hr",
    phonePrefix: "+385",
    timezone: "CET",
  },
  [Country.HU]: {
    currency: Currency.HUF,
    language: "hu",
    phonePrefix: "+36",
    timezone: "CET",
  },
  [Country.IE]: {
    currency: Currency.EUR,
    language: "en",
    phonePrefix: "+353",
    timezone: "GMT",
  },
  [Country.IT]: {
    currency: Currency.EUR,
    language: "it",
    phonePrefix: "+39",
    timezone: "CET",
  },
  [Country.LT]: {
    currency: Currency.EUR,
    language: "lt",
    phonePrefix: "+370",
    timezone: "EET",
  },
  [Country.LU]: {
    currency: Currency.EUR,
    language: "fr",
    phonePrefix: "+352",
    timezone: "CET",
  },
  [Country.LV]: {
    currency: Currency.EUR,
    language: "lv",
    phonePrefix: "+371",
    timezone: "EET",
  },
  [Country.MT]: {
    currency: Currency.EUR,
    language: "mt",
    phonePrefix: "+356",
    timezone: "CET",
  },
  [Country.NL]: {
    currency: Currency.EUR,
    language: "nl",
    phonePrefix: "+31",
    timezone: "CET",
  },
  [Country.PL]: {
    currency: Currency.PLN,
    language: "pl",
    phonePrefix: "+48",
    timezone: "CET",
  },
  [Country.PT]: {
    currency: Currency.EUR,
    language: "pt",
    phonePrefix: "+351",
    timezone: "WET",
  },
  [Country.RO]: {
    currency: Currency.RON,
    language: "ro",
    phonePrefix: "+40",
    timezone: "EET",
  },
  [Country.SE]: {
    currency: Currency.SEK,
    language: "sv",
    phonePrefix: "+46",
    timezone: "CET",
  },
  [Country.SI]: {
    currency: Currency.EUR,
    language: "sl",
    phonePrefix: "+386",
    timezone: "CET",
  },
  [Country.SK]: {
    currency: Currency.EUR,
    language: "sk",
    phonePrefix: "+421",
    timezone: "CET",
  },
};
