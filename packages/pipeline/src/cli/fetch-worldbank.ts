/**
 * `pnpm fetch:worldbank` (docs/06 §2): archives the World Bank API responses for GNI (Atlas
 * method) and population as dataset sources and writes data/structured/gni.csv and
 * population.csv from the archived bytes (latest year per country).
 */
import { runFetchWorldBank } from '../fetch/worldbank.js'
import { datasetContext } from './common.js'

const result = await runFetchWorldBank(datasetContext('fetch:worldbank'))
process.stdout.write(`${result.report.join('\n')}\n`)
process.exitCode = result.ok ? 0 : 1
