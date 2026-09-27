/**
 * Short indicator labels for generated text: the summary line (spec §5: "Last change:
 * 2026-09-12, UNGA vote (B1, +3).") and change explanations. Noun phrases, lower case except
 * proper names and acronyms, no adjectives; the full names stay in indicators.yaml. The same
 * wording pattern is used for positive and negative indicators.
 */
import type { LangText } from './types.js'

const LABELS: Record<string, LangText> = {
  A1: { en: 'arms deliveries (SIPRI)', fr: "livraisons d'armes (SIPRI)" },
  A2: { en: 'military exports (customs data)', fr: 'exportations militaires (données douanières)' },
  A3: { en: 'F-35 supply chain', fr: "chaîne d'approvisionnement du F-35" },
  A4: { en: 'arms purchases from Israel', fr: "achats d'armes à Israël" },
  A5: { en: 'military cooperation', fr: 'coopération militaire' },
  A6: { en: 'export licence suspension', fr: "suspension de licences d'exportation" },
  A7: { en: 'two-way arms embargo', fr: 'embargo sur les armes dans les deux sens' },
  A8: { en: 'arms transit denial', fr: "refus de transit d'armes" },
  B1: { en: 'UNGA vote', fr: "vote à l'Assemblée générale" },
  B2: { en: 'Security Council veto', fr: 'veto au Conseil de sécurité' },
  B3: { en: 'ICJ intervention', fr: 'intervention devant la CIJ' },
  B4: {
    en: 'position against ICJ provisional measures',
    fr: 'position contre les mesures conservatoires de la CIJ',
  },
  B5: {
    en: 'commitment to execute ICC warrants',
    fr: 'engagement à exécuter les mandats de la CPI',
  },
  B6: {
    en: 'refusal to execute ICC warrants, hosting of a person under warrant, or Rome Statute withdrawal',
    fr: "refus d'exécuter les mandats de la CPI, accueil d'une personne visée par un mandat, ou retrait du Statut de Rome",
  },
  B7: {
    en: 'sanctions on ICC judges or prosecutors',
    fr: 'sanctions contre des juges ou des procureurs de la CPI',
  },
  B8: {
    en: 'recognition of the State of Palestine',
    fr: "reconnaissance de l'État de Palestine",
  },
  B9: {
    en: 'statement calling for a ceasefire or naming violations',
    fr: 'déclaration appelant à un cessez-le-feu ou nommant des violations',
  },
  B10: {
    en: 'statement of unconditional support or denial of documented violations',
    fr: 'déclaration de soutien inconditionnel ou niant des violations documentées',
  },
  B11: {
    en: 'sanctions on Israeli ministers or settler entities',
    fr: 'sanctions contre des ministres israéliens ou des entités de colons',
  },
  B12: {
    en: 'downgrade of diplomatic relations',
    fr: 'abaissement du niveau des relations diplomatiques',
  },
  C1: {
    en: 'trade agreement suspension or review',
    fr: "suspension ou réexamen d'un accord commercial",
  },
  C2: { en: 'new agreement with Israel', fr: 'nouvel accord avec Israël' },
  C3: {
    en: 'trade with Israel at pre-war level',
    fr: "commerce avec Israël au niveau d'avant-guerre",
  },
  C4: { en: 'settlement goods measure', fr: 'mesure sur les produits des colonies' },
  C5: { en: 'divestment decision', fr: 'décision de désinvestissement' },
  C6: { en: 'procurement exclusion', fr: 'exclusion des marchés publics' },
  D1: { en: 'humanitarian funding (FTS)', fr: 'financement humanitaire (FTS)' },
  D2: { en: 'UNRWA funding suspension', fr: "suspension du financement de l'UNRWA" },
  D3: { en: 'UNRWA funding restoration', fr: "rétablissement du financement de l'UNRWA" },
  D4: {
    en: 'medical evacuation or field hospital',
    fr: 'évacuation médicale ou hôpital de campagne',
  },
  D5: { en: 'visa or refugee pathway', fr: "voie d'accès par visa ou statut de réfugié" },
  E1: { en: 'domestic investigation or prosecution', fr: 'enquête ou poursuites nationales' },
  E2: { en: 'protest ban', fr: 'interdiction de manifestations' },
  E3: { en: 'universal-jurisdiction complaint', fr: 'plainte en compétence universelle' },
}
for (const label of Object.values(LABELS)) Object.freeze(label)

export const INDICATOR_LABELS: Readonly<Record<string, LangText>> = Object.freeze(LABELS)

/** The label of an indicator; throws when the indicator has none. */
export function indicatorLabel(id: string): LangText {
  const label = INDICATOR_LABELS[id]
  if (label === undefined) throw new Error(`no short label for indicator ${id}`)
  return label
}
