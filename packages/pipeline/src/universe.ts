/**
 * The universe of docs/02 §1 as ISO 3166-1 alpha-3 codes, for the fetchers that read global
 * datasets (World Bank, FTS) before data/countries.yaml holds every entry (P-13). The 193 UN
 * member states, plus the Holy See (observer, scored) and Palestine (observer, excluded, D-10).
 *
 * The registry in data/countries.yaml is the authority; this list only decides which rows of a
 * global dataset are kept. A test checks that it has 193 + 2 codes and no duplicates.
 */

/** The 193 member states of the United Nations. */
// biome-ignore format: a compact table of codes
export const UN_MEMBER_ISO3: readonly string[] = [
  'AFG', 'ALB', 'DZA', 'AND', 'AGO', 'ATG', 'ARG', 'ARM', 'AUS', 'AUT', 'AZE', 'BHS', 'BHR',
  'BGD', 'BRB', 'BLR', 'BEL', 'BLZ', 'BEN', 'BTN', 'BOL', 'BIH', 'BWA', 'BRA', 'BRN', 'BGR',
  'BFA', 'BDI', 'CPV', 'KHM', 'CMR', 'CAN', 'CAF', 'TCD', 'CHL', 'CHN', 'COL', 'COM', 'COG',
  'CRI', 'CIV', 'HRV', 'CUB', 'CYP', 'CZE', 'PRK', 'COD', 'DNK', 'DJI', 'DMA', 'DOM', 'ECU',
  'EGY', 'SLV', 'GNQ', 'ERI', 'EST', 'SWZ', 'ETH', 'FJI', 'FIN', 'FRA', 'GAB', 'GMB', 'GEO',
  'DEU', 'GHA', 'GRC', 'GRD', 'GTM', 'GIN', 'GNB', 'GUY', 'HTI', 'HND', 'HUN', 'ISL', 'IND',
  'IDN', 'IRN', 'IRQ', 'IRL', 'ISR', 'ITA', 'JAM', 'JPN', 'JOR', 'KAZ', 'KEN', 'KIR', 'KWT',
  'KGZ', 'LAO', 'LVA', 'LBN', 'LSO', 'LBR', 'LBY', 'LIE', 'LTU', 'LUX', 'MDG', 'MWI', 'MYS',
  'MDV', 'MLI', 'MLT', 'MHL', 'MRT', 'MUS', 'MEX', 'FSM', 'MDA', 'MCO', 'MNG', 'MNE', 'MAR',
  'MOZ', 'MMR', 'NAM', 'NRU', 'NPL', 'NLD', 'NZL', 'NIC', 'NER', 'NGA', 'MKD', 'NOR', 'OMN',
  'PAK', 'PLW', 'PAN', 'PNG', 'PRY', 'PER', 'PHL', 'POL', 'PRT', 'QAT', 'KOR', 'ROU', 'RUS',
  'RWA', 'KNA', 'LCA', 'VCT', 'WSM', 'SMR', 'STP', 'SAU', 'SEN', 'SRB', 'SYC', 'SLE', 'SGP',
  'SVK', 'SVN', 'SLB', 'SOM', 'ZAF', 'SSD', 'ESP', 'LKA', 'SDN', 'SUR', 'SWE', 'CHE', 'SYR',
  'TJK', 'THA', 'TLS', 'TGO', 'TON', 'TTO', 'TUN', 'TUR', 'TKM', 'TUV', 'UGA', 'UKR', 'ARE',
  'GBR', 'TZA', 'USA', 'URY', 'UZB', 'VUT', 'VEN', 'VNM', 'YEM', 'ZMB', 'ZWE',
]

/** Observer states: the Holy See (scored) and Palestine (excluded, D-10). */
export const OBSERVER_ISO3: readonly string[] = ['VAT', 'PSE']

/** Every entry of the registry (docs/03 §1: 195 entries). */
export const UNIVERSE_ISO3: ReadonlySet<string> = new Set([...UN_MEMBER_ISO3, ...OBSERVER_ISO3])
