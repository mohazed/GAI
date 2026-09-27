import { describe, expect, it } from 'vitest'
import { containsQuote, foldName, normaliseWhitespace, quoteSearcher } from './normalise.js'

describe('normaliseWhitespace', () => {
  it('collapses every kind of whitespace run into one ASCII space', () => {
    const cases: [string, string][] = [
      ['a  b', 'a b'],
      ['a\tb', 'a b'],
      ['a\nb', 'a b'],
      ['a\r\n\r\nb', 'a b'],
      ['a\u00A0b', 'a b'], // no-break space
      ['a\u202Fb', 'a b'], // narrow no-break space (French typography)
      ['a\u2003b', 'a b'], // em space (U+2000 to U+200A)
      ['a\u2009b', 'a b'], // thin space
      ['a\u3000b', 'a b'], // ideographic space
      ['a\u2028b', 'a b'], // line separator
      ['a\u2029b', 'a b'], // paragraph separator
      ['a \u00A0\n\t\u202F b', 'a b'],
    ]
    for (const [input, expected] of cases) expect(normaliseWhitespace(input)).toBe(expected)
  })

  it('trims leading and trailing whitespace', () => {
    expect(normaliseWhitespace('\n\u00A0 Die Bundesregierung \u202F\n')).toBe('Die Bundesregierung')
    expect(normaliseWhitespace(' \n\t ')).toBe('')
  })

  it('removes the soft hyphen and zero-width characters without leaving a space', () => {
    expect(normaliseWhitespace('Rüstungs\u00ADgütern')).toBe('Rüstungsgütern')
    expect(normaliseWhitespace('Gaza\u200Bstreifen')).toBe('Gazastreifen')
    expect(normaliseWhitespace('a\u200Cb\u200Dc\u2060d\uFEFFe')).toBe('abcde')
    expect(normaliseWhitespace('\uFEFFText')).toBe('Text')
  })

  it('removes the bidirectional format characters without leaving a space', () => {
    // Left-to-right and right-to-left marks, the Arabic letter mark, embeddings and overrides
    // (U+202A–U+202E) and isolates (U+2066–U+2069).
    for (const mark of [
      '\u200E',
      '\u200F',
      '\u061C',
      '\u202A',
      '\u202B',
      '\u202C',
      '\u202D',
      '\u202E',
      '\u2066',
      '\u2067',
      '\u2068',
      '\u2069',
    ]) {
      expect(normaliseWhitespace(`a${mark}b`), `U+${mark.codePointAt(0)?.toString(16)}`).toBe('ab')
    }
    // Synthetic Arabic text for the test (not a quotation of a real document).
    expect(normaliseWhitespace('\u200Fالحكومة\u200F ستعلق\u200F')).toBe('الحكومة ستعلق')
  })

  it('removes a format character before composing, so a mark cannot split a letter from its accent', () => {
    expect(normaliseWhitespace('e\u200F\u0301')).toBe('\u00E9')
    expect(normaliseWhitespace('e\u00AD\u0301')).toBe('\u00E9')
  })

  it('applies Unicode NFC', () => {
    const decomposed = 'Ru\u0308stungsgu\u0308ter'
    expect(normaliseWhitespace(decomposed)).toBe('Rüstungsgüter')
    expect(normaliseWhitespace('e\u0301')).toBe('\u00E9')
  })

  it('keeps quotation marks, apostrophes, dashes and case as they are', () => {
    const text = 'l\u2019État « libre » \u2013 „Wortlaut\u201C \u2014 "Quote" It\'s'
    expect(normaliseWhitespace(text)).toBe(text)
    expect(normaliseWhitespace('\u2019')).not.toBe("'")
    expect(normaliseWhitespace('\u2013')).not.toBe('-')
    expect(normaliseWhitespace('ABC')).toBe('ABC')
  })

  it('is idempotent', () => {
    const input = ' a\u00A0\u00ADb\n\nc\u202F '
    const once = normaliseWhitespace(input)
    expect(normaliseWhitespace(once)).toBe(once)
  })
})

describe('containsQuote', () => {
  const text =
    'Das Vorgehen lässt immer weniger erkennen, wie diese Ziele erreicht werden sollen.\n\nUnter diesen Umständen genehmigt die Bundesregierung bis auf Weiteres keine Ausfuhren.'

  it('finds a verbatim quote', () => {
    expect(containsQuote(text, 'genehmigt die Bundesregierung bis auf Weiteres')).toBe(true)
  })

  it('finds a quote that spans a paragraph break', () => {
    expect(containsQuote(text, 'erreicht werden sollen. Unter diesen Umständen')).toBe(true)
  })

  it('finds a quote with a newline, a no-break space or a narrow no-break space inside', () => {
    expect(containsQuote(text, 'genehmigt die\nBundesregierung')).toBe(true)
    expect(containsQuote(text, 'bis\u00A0auf\u00A0Weiteres')).toBe(true)
    expect(containsQuote(text, 'bis\u202Fauf Weiteres')).toBe(true)
  })

  it('finds a quote when the text carries a soft hyphen or a zero-width space', () => {
    const hyphenated = text.replace('Bundesregierung', 'Bundes\u00ADregierung')
    expect(containsQuote(hyphenated, 'genehmigt die Bundesregierung')).toBe(true)
    const zeroWidth = text.replace('Weiteres', 'Wei\u200Bteres')
    expect(containsQuote(zeroWidth, 'bis auf Weiteres')).toBe(true)
  })

  it('finds a quote whose letters are decomposed (NFD)', () => {
    expect(containsQuote(text, 'Unter diesen Umständen'.normalize('NFD'))).toBe(true)
  })

  it('finds an Arabic quote whether the quote or the text carries right-to-left marks (U+200F)', () => {
    // Synthetic Arabic text for the test (not a quotation of a real document).
    const arabic = 'قال المتحدث\u200F: إن الحكومة\u200F ستعلق التصاريح\u200F.'
    const quote = 'إن الحكومة ستعلق التصاريح'
    expect(containsQuote(arabic, quote)).toBe(true)
    expect(containsQuote(arabic.replaceAll('\u200F', ''), `\u200F${quote}\u200F`)).toBe(true)
    expect(containsQuote(arabic, 'إن الحكومة\u200F\u00A0ستعلق')).toBe(true)
    expect(containsQuote(arabic, 'إن الحكومة ستوقف التصاريح')).toBe(false)
  })

  it('rejects a quote that differs by one word', () => {
    expect(containsQuote(text, 'genehmigt die Bundesregierung ab sofort')).toBe(false)
  })

  it('rejects a quote whose apostrophe, quotation marks or dash differ', () => {
    const english =
      'The minister said: \u201Cthe government\u2019s decision stands \u2013 for now\u201D.'
    expect(containsQuote(english, 'the government\u2019s decision stands')).toBe(true)
    expect(containsQuote(english, "the government's decision stands")).toBe(false)
    expect(containsQuote(english, 'decision stands - for now')).toBe(false)
    expect(containsQuote(english, '"the government\u2019s')).toBe(false)
  })

  it('rejects a quote whose case differs', () => {
    expect(containsQuote(text, 'unter diesen Umständen')).toBe(false)
  })

  it('does not insert a space where the text has none', () => {
    expect(containsQuote('Gazastreifen', 'Gaza streifen')).toBe(false)
  })
})

describe('quoteSearcher', () => {
  it('normalises the text once and answers like containsQuote for each quote', () => {
    const text = 'Unter diesen\nUmständen genehmigt die Bundes\u00ADregierung bis\u00A0auf Weiteres'
    const contains = quoteSearcher(text)
    for (const quote of ['diesen Umständen', 'Bundesregierung bis auf', 'bis auf Weiteres']) {
      expect(contains(quote), quote).toBe(true)
      expect(containsQuote(text, quote), quote).toBe(true)
    }
    expect(contains('Bundesregierung ab sofort')).toBe(false)
  })
})

describe('foldName', () => {
  it('folds case, whitespace runs, U+00A0, format characters and trailing punctuation', () => {
    for (const name of [
      'Der Spiegel',
      'DER SPIEGEL',
      ' Der  Spiegel ',
      'Der\u00A0Spiegel',
      'Der\u202FSpiegel',
      'Der Spie\u00ADgel',
      'Der Spiegel.',
      'Der Spiegel,',
    ]) {
      expect(foldName(name), JSON.stringify(name)).toBe('der spiegel')
    }
  })

  it('folds compatibility forms (NFKC): fullwidth letters and ligatures', () => {
    expect(foldName('ＲＥＵＴＥＲＳ')).toBe('reuters')
    expect(foldName('Oﬃce')).toBe('office')
  })

  it('keeps distinct names distinct', () => {
    expect(foldName('Reuters')).not.toBe(foldName('Der Spiegel'))
    expect(foldName('Human Rights Watch')).not.toBe(foldName('Human Rights'))
  })
})
