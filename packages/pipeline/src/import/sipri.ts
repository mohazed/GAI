/**
 * `pnpm import:sipri` as pure functions (docs/06 §2, docs/02 §5 A1/A4).
 *
 * Deliveries: the SIPRI TIV table "imports to Israel by supplier" exported as CSV (a few title
 * lines, then a header row with one column per year and usually a Total column, one row per
 * supplier, a Total row). Each supplier and year becomes a sipri_deliveries.csv row with the
 * year's total to Israel (the Total row when present, else the column sum, which then omits
 * unknown suppliers and says so).
 *
 * Orders: the SIPRI trade register exported as CSV (header row with Recipient, Supplier, Year of
 * order and "SIPRI TIV for total order"); the orders placed with Israel are summed per recipient
 * and order year into sipri_orders.csv rows. Order years marked uncertain by SIPRI (a trailing
 * "?" or brackets) are kept and listed in the report.
 *
 * Supplier and recipient names are coded with names.ts; unknown names stop the import.
 */
import { foldName, iso3ForName } from '../names.js'

const YEAR = /^(19[5-9]\d|20\d\d)$/
const TOTAL = new Set(['total', 'totals'])
const UNKNOWN_SUPPLIER = /^unknown/i

function number(cell: string | undefined): number {
  const s = (cell ?? '').replace(/[\s,]/g, '')
  if (s === '' || s === '-') return 0
  const n = Number(s)
  if (!Number.isFinite(n) || n < 0) throw new Error(`not a TIV value: "${cell}"`)
  return n
}

/** Rows of a CSV that may start with title lines: from the first row matching `isHeader`. */
function tableFrom(text: string, file: string, isHeader: (cells: string[]) => boolean): string[][] {
  // SIPRI title lines have fewer columns than the table, so the strict parser cannot read it.
  const lines = looseCsv(text)
  const start = lines.findIndex(isHeader)
  if (start === -1) throw new Error(`${file}: no header row found`)
  return lines.slice(start)
}

/** A permissive CSV reader (quoted fields, commas or semicolons), rows of any length. */
export function looseCsv(text: string): string[][] {
  const body = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n')
  const firstLine = body.split('\n').find((l) => l.trim() !== '') ?? ''
  const sep =
    (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ','
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < body.length; i++) {
    const ch = body[i] as string
    if (quoted) {
      if (ch === '"' && body[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === sep) {
      row.push(cell)
      cell = ''
    } else if (ch === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  if (cell !== '' || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }
  return rows.map((r) => r.map((c) => c.trim())).filter((r) => r.some((c) => c !== ''))
}

export type DeliveryRow = {
  release_date: string
  data_year: number
  supplier_iso3: string
  tiv_to_israel: number
  tiv_total_to_israel: number
  source: string
}

export interface DeliveriesImport {
  rows: DeliveryRow[]
  years: number[]
  unknownNames: string[]
  /** True when the table had no Total row and totals are column sums. */
  summedTotals: boolean
  /** TIV of "Unknown supplier(s)" per year (in the total, no row). */
  unknownSupplierTiv: Map<number, number>
}

export function importDeliveries(
  text: string,
  file: string,
  releaseDate: string,
  source: string,
): DeliveriesImport {
  const table = tableFrom(text, file, (cells) => cells.filter((c) => YEAR.test(c)).length >= 2)
  const header = table[0] as string[]
  const yearCols = header.map((h, i) => [h, i] as const).filter(([h]) => YEAR.test(h))
  const years = yearCols.map(([h]) => Number(h))
  const totals = new Map<number, number>()
  const sums = new Map<number, number>()
  const unknownSupplierTiv = new Map<number, number>()
  const unknown = new Set<string>()
  const perSupplier: { iso3: string; values: Map<number, number> }[] = []
  for (const cells of table.slice(1)) {
    const name = cells[0] ?? ''
    if (name === '') continue
    const values = new Map(yearCols.map(([h, i]) => [Number(h), number(cells[i])]))
    if (TOTAL.has(foldName(name))) {
      for (const [y, v] of values) totals.set(y, v)
      continue
    }
    for (const [y, v] of values) sums.set(y, (sums.get(y) ?? 0) + v)
    if (UNKNOWN_SUPPLIER.test(name)) {
      for (const [y, v] of values) unknownSupplierTiv.set(y, v)
      continue
    }
    const iso3 = iso3ForName(name)
    if (iso3 === undefined) {
      unknown.add(name)
      continue
    }
    perSupplier.push({ iso3, values })
  }
  const summedTotals = totals.size === 0
  const totalOf = (y: number) => (summedTotals ? (sums.get(y) ?? 0) : (totals.get(y) ?? 0))
  const rows: DeliveryRow[] = []
  for (const s of perSupplier) {
    for (const y of years) {
      const v = s.values.get(y) ?? 0
      if (v <= 0) continue
      rows.push({
        release_date: releaseDate,
        data_year: y,
        supplier_iso3: s.iso3,
        tiv_to_israel: v,
        tiv_total_to_israel: totalOf(y),
        source,
      })
    }
  }
  return { rows, years, unknownNames: [...unknown].sort(), summedTotals, unknownSupplierTiv }
}

export type OrderRow = {
  release_date: string
  data_year: number
  buyer_iso3: string
  tiv_new_orders_from_israel: number
  source: string
}

export interface OrdersImport {
  rows: OrderRow[]
  unknownNames: string[]
  /** Register lines whose order year SIPRI marks uncertain. */
  uncertainYears: string[]
}

export function importOrders(
  text: string,
  file: string,
  releaseDate: string,
  source: string,
): OrdersImport {
  const norm = (c: string) => foldName(c)
  const table = tableFrom(text, file, (cells) => {
    const f = cells.map(norm)
    return (
      f.includes('recipient') &&
      f.includes('supplier') &&
      f.some((c) => c.startsWith('year s of order') || c === 'year of order' || c === 'order date')
    )
  })
  const header = (table[0] as string[]).map(norm)
  const col = (pred: (h: string) => boolean, what: string) => {
    const i = header.findIndex(pred)
    if (i === -1)
      throw new Error(
        `${file}: no ${what} column in the header "${(table[0] as string[]).join(',')}"`,
      )
    return i
  }
  const iRecipient = col((h) => h === 'recipient', 'Recipient')
  const iSupplier = col((h) => h === 'supplier', 'Supplier')
  const iYear = col(
    (h) => h.includes('order') && (h.includes('year') || h.includes('date')),
    'Year of order',
  )
  const iTiv = col(
    (h) => h.includes('tiv') && h.includes('total order'),
    'SIPRI TIV for total order',
  )
  const unknown = new Set<string>()
  const uncertain: string[] = []
  const sums = new Map<string, number>()
  for (const cells of table.slice(1)) {
    if (foldName(cells[iSupplier] ?? '') !== 'israel') continue
    const name = cells[iRecipient] ?? ''
    const iso3 = iso3ForName(name)
    if (iso3 === undefined) {
      if (name !== '') unknown.add(name)
      continue
    }
    const yearCell = cells[iYear] ?? ''
    const y = /(\d{4})/.exec(yearCell)?.[1]
    if (!y) continue
    if (/[?()]/.test(yearCell)) uncertain.push(`${name} ${yearCell}`)
    const k = `${iso3}\u0000${y}`
    sums.set(k, (sums.get(k) ?? 0) + number(cells[iTiv]))
  }
  const rows: OrderRow[] = [...sums].map(([k, v]) => {
    const [iso3, y] = k.split('\u0000') as [string, string]
    return {
      release_date: releaseDate,
      data_year: Number(y),
      buyer_iso3: iso3,
      tiv_new_orders_from_israel: v,
      source,
    }
  })
  return { rows, unknownNames: [...unknown].sort(), uncertainYears: uncertain }
}
