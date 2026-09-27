/**
 * English country names → ISO3, for the importers whose files name states instead of coding them
 * (SIPRI tables, some UN exports). Each universe entry has its UN short name and the variants the
 * sources use. Matching folds case, accents and punctuation. An unknown name is never guessed:
 * the importer reports it, and the fix is to add the variant here.
 */
// biome-ignore format: one country per line
const NAMES: Record<string, readonly string[]> = {
  AFG: ['Afghanistan'], ALB: ['Albania'], DZA: ['Algeria'], AND: ['Andorra'], AGO: ['Angola'],
  ATG: ['Antigua and Barbuda'], ARG: ['Argentina'], ARM: ['Armenia'], AUS: ['Australia'],
  AUT: ['Austria'], AZE: ['Azerbaijan'], BHS: ['Bahamas', 'The Bahamas', 'Bahamas, The'],
  BHR: ['Bahrain'], BGD: ['Bangladesh'], BRB: ['Barbados'], BLR: ['Belarus'], BEL: ['Belgium'],
  BLZ: ['Belize'], BEN: ['Benin'], BTN: ['Bhutan'],
  BOL: ['Bolivia', 'Bolivia (Plurinational State of)', 'Plurinational State of Bolivia'],
  BIH: ['Bosnia and Herzegovina', 'Bosnia-Herzegovina'], BWA: ['Botswana'], BRA: ['Brazil'],
  BRN: ['Brunei Darussalam', 'Brunei'], BGR: ['Bulgaria'], BFA: ['Burkina Faso'], BDI: ['Burundi'],
  CPV: ['Cabo Verde', 'Cape Verde'], KHM: ['Cambodia'], CMR: ['Cameroon'], CAN: ['Canada'],
  CAF: ['Central African Republic'], TCD: ['Chad'], CHL: ['Chile'], CHN: ['China'],
  COL: ['Colombia'], COM: ['Comoros'], COG: ['Congo', 'Republic of the Congo', 'Congo, Rep.'],
  CRI: ['Costa Rica'], CIV: ["Côte d'Ivoire", "Cote d'Ivoire", 'Ivory Coast'], HRV: ['Croatia'],
  CUB: ['Cuba'], CYP: ['Cyprus'], CZE: ['Czechia', 'Czech Republic'],
  PRK: ["Democratic People's Republic of Korea", 'North Korea', 'Korea, North', "Korea, Dem. People's Rep."],
  COD: ['Democratic Republic of the Congo', 'DR Congo', 'DRC', 'Congo, Dem. Rep.'],
  DNK: ['Denmark'], DJI: ['Djibouti'], DMA: ['Dominica'], DOM: ['Dominican Republic'],
  ECU: ['Ecuador'], EGY: ['Egypt'], SLV: ['El Salvador'], GNQ: ['Equatorial Guinea'],
  ERI: ['Eritrea'], EST: ['Estonia'], SWZ: ['Eswatini', 'Swaziland'], ETH: ['Ethiopia'],
  FJI: ['Fiji'], FIN: ['Finland'], FRA: ['France'], GAB: ['Gabon'], GMB: ['Gambia', 'The Gambia', 'Gambia, The'],
  GEO: ['Georgia'], DEU: ['Germany'], GHA: ['Ghana'], GRC: ['Greece'], GRD: ['Grenada'],
  GTM: ['Guatemala'], GIN: ['Guinea'], GNB: ['Guinea-Bissau'], GUY: ['Guyana'], HTI: ['Haiti'],
  HND: ['Honduras'], HUN: ['Hungary'], ISL: ['Iceland'], IND: ['India'], IDN: ['Indonesia'],
  IRN: ['Iran', 'Iran (Islamic Republic of)', 'Islamic Republic of Iran', 'Iran, Islamic Rep.'],
  IRQ: ['Iraq'], IRL: ['Ireland'], ISR: ['Israel'], ITA: ['Italy'], JAM: ['Jamaica'],
  JPN: ['Japan'], JOR: ['Jordan'], KAZ: ['Kazakhstan'], KEN: ['Kenya'], KIR: ['Kiribati'],
  KWT: ['Kuwait'], KGZ: ['Kyrgyzstan', 'Kyrgyz Republic'],
  LAO: ["Lao People's Democratic Republic", 'Laos', 'Lao PDR'], LVA: ['Latvia'], LBN: ['Lebanon'],
  LSO: ['Lesotho'], LBR: ['Liberia'], LBY: ['Libya'], LIE: ['Liechtenstein'], LTU: ['Lithuania'],
  LUX: ['Luxembourg'], MDG: ['Madagascar'], MWI: ['Malawi'], MYS: ['Malaysia'], MDV: ['Maldives'],
  MLI: ['Mali'], MLT: ['Malta'], MHL: ['Marshall Islands'], MRT: ['Mauritania'], MUS: ['Mauritius'],
  MEX: ['Mexico'], FSM: ['Micronesia (Federated States of)', 'Micronesia', 'Federated States of Micronesia'],
  MDA: ['Republic of Moldova', 'Moldova'], MCO: ['Monaco'], MNG: ['Mongolia'], MNE: ['Montenegro'],
  MAR: ['Morocco'], MOZ: ['Mozambique'], MMR: ['Myanmar', 'Burma'], NAM: ['Namibia'], NRU: ['Nauru'],
  NPL: ['Nepal'], NLD: ['Netherlands', 'Netherlands (Kingdom of the)', 'Kingdom of the Netherlands'],
  NZL: ['New Zealand'], NIC: ['Nicaragua'], NER: ['Niger'], NGA: ['Nigeria'],
  MKD: ['North Macedonia', 'Macedonia'], NOR: ['Norway'], OMN: ['Oman'], PAK: ['Pakistan'],
  PLW: ['Palau'], PAN: ['Panama'], PNG: ['Papua New Guinea'], PRY: ['Paraguay'], PER: ['Peru'],
  PHL: ['Philippines'], POL: ['Poland'], PRT: ['Portugal'], QAT: ['Qatar'],
  KOR: ['Republic of Korea', 'South Korea', 'Korea, South', 'Korea, Rep.'], ROU: ['Romania'],
  RUS: ['Russian Federation', 'Russia'], RWA: ['Rwanda'], KNA: ['Saint Kitts and Nevis'],
  LCA: ['Saint Lucia'], VCT: ['Saint Vincent and the Grenadines'], WSM: ['Samoa'],
  SMR: ['San Marino'], STP: ['Sao Tome and Principe', 'São Tomé and Príncipe'],
  SAU: ['Saudi Arabia'], SEN: ['Senegal'], SRB: ['Serbia'], SYC: ['Seychelles'],
  SLE: ['Sierra Leone'], SGP: ['Singapore'], SVK: ['Slovakia'], SVN: ['Slovenia'],
  SLB: ['Solomon Islands'], SOM: ['Somalia'], ZAF: ['South Africa'], SSD: ['South Sudan'],
  ESP: ['Spain'], LKA: ['Sri Lanka'], SDN: ['Sudan'], SUR: ['Suriname'], SWE: ['Sweden'],
  CHE: ['Switzerland'], SYR: ['Syrian Arab Republic', 'Syria'], TJK: ['Tajikistan'],
  THA: ['Thailand'], TLS: ['Timor-Leste', 'East Timor'], TGO: ['Togo'], TON: ['Tonga'],
  TTO: ['Trinidad and Tobago'], TUN: ['Tunisia'], TUR: ['Türkiye', 'Turkiye', 'Turkey'],
  TKM: ['Turkmenistan'], TUV: ['Tuvalu'], UGA: ['Uganda'], UKR: ['Ukraine'],
  ARE: ['United Arab Emirates', 'UAE'],
  GBR: ['United Kingdom', 'United Kingdom of Great Britain and Northern Ireland', 'UK'],
  TZA: ['United Republic of Tanzania', 'Tanzania'],
  USA: ['United States', 'United States of America', 'USA'], URY: ['Uruguay'],
  UZB: ['Uzbekistan'], VUT: ['Vanuatu'],
  VEN: ['Venezuela', 'Venezuela (Bolivarian Republic of)', 'Bolivarian Republic of Venezuela'],
  VNM: ['Viet Nam', 'Vietnam'], YEM: ['Yemen'], ZMB: ['Zambia'], ZWE: ['Zimbabwe'],
  VAT: ['Holy See', 'Vatican'], PSE: ['State of Palestine', 'Palestine'],
}

/** Lowercase, no accents, punctuation to spaces, single spaces. */
export function foldName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const BY_NAME: ReadonlyMap<string, string> = new Map(
  Object.entries(NAMES).flatMap(([iso3, names]) => names.map((n) => [foldName(n), iso3] as const)),
)

/** ISO3 of a country name, or undefined when the name is not in the table. */
export function iso3ForName(name: string): string | undefined {
  return BY_NAME.get(foldName(name))
}

/** The table covers exactly the universe (checked by a test). */
export const NAMED_ISO3: readonly string[] = Object.keys(NAMES)
