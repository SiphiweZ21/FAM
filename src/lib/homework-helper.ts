export type MathsHomework = {
  kind: 'maths'
  operation: 'addition' | 'subtraction'
  first: number
  second: number
  answer: string
  symbol: '+' | '−'
  objectEmoji: string
  objectName: string
  hints: string[]
}

export type LanguageHomework = {
  kind: 'language'
  task: 'spell' | 'first-letter'
  word: string
  answer: string
  visual: string
  hints: string[]
}

export type HomeworkAnalysis = MathsHomework | LanguageHomework

const objectWords: Array<[RegExp, string, string]> = [
  [/apple/i, '🍎', 'apples'], [/balloon/i, '🎈', 'balloons'], [/sweet|candy/i, '🍬', 'sweets'],
  [/ball/i, '⚽', 'balls'], [/bird/i, '🐦', 'birds'], [/cat/i, '🐈', 'cats'], [/dog/i, '🐕', 'dogs']
]

const wordVisuals: Record<string, string> = { cat: '🐈', dog: '🐕', sun: '☀️', moon: '🌙', tree: '🌳', fish: '🐟', ball: '⚽', apple: '🍎' }

function findObject(text: string) {
  const match = objectWords.find(([pattern]) => pattern.test(text))
  return match ? { objectEmoji: match[1], objectName: match[2] } : { objectEmoji: '⭐', objectName: 'objects' }
}

export function analyseMathsHomework(text: string): MathsHomework | null {
  const values = text.match(/\d+/g)?.map(Number) ?? []
  if (values.length < 2 || values[0] > 20 || values[1] > 20) return null
  const addition = /\+|plus|add|more|altogether|total|in all|gives (?:him|her|them)/i.test(text)
  const subtraction = /-|−|minus|subtract|take away|left|remain|lost|fly away|gives? away/i.test(text)
  if (!addition && !subtraction) return null
  const operation = subtraction && !addition ? 'subtraction' : 'addition'
  const first = values[0]
  const second = values[1]
  if (operation === 'subtraction' && second > first) return null
  const answer = String(operation === 'addition' ? first + second : first - second)
  const object = findObject(text)
  return {
    kind: 'maths', operation, first, second, answer,
    symbol: operation === 'addition' ? '+' : '−', ...object,
    hints: operation === 'addition'
      ? ['The group becomes bigger, so think about adding.', `Start with ${first} ${object.objectName}.`, `Count ${second} more from ${first}.`]
      : ['The group becomes smaller, so think about taking away.', `Start with ${first} ${object.objectName}.`, `Move ${second} away, then count what remains.`]
  }
}

export function analyseLanguageHomework(text: string): LanguageHomework | null {
  const clean = text.trim().replace(/[?.!]/g, '')
  const firstLetterMatch = clean.match(/(?:starts?|begins?)(?:\s+with)?\s+([a-z]+)/i) || clean.match(/first letter (?:of|in)\s+([a-z]+)/i)
  if (firstLetterMatch) {
    const word = firstLetterMatch[1].toLowerCase()
    return { kind: 'language', task: 'first-letter', word, answer: word[0].toUpperCase(), visual: wordVisuals[word] || '🔤', hints: [`Say “${word}” slowly.`, `Listen to the first sound: ${word[0]}...`, 'Choose the letter that makes that sound.'] }
  }
  const spellMatch = clean.match(/(?:spell|build|write)(?: the word)?\s+([a-z]+)/i)
  if (!spellMatch) return null
  const word = spellMatch[1].toLowerCase()
  if (word.length < 2 || word.length > 8) return null
  return { kind: 'language', task: 'spell', word, answer: word.toUpperCase(), visual: wordVisuals[word] || '📝', hints: [`Say “${word}” slowly.`, `Listen for each sound in “${word}”.`, `The word has ${word.length} letters.`] }
}
