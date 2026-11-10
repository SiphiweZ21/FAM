import type { GradeOneTopic } from './grade-one-topics'

// Grade 4 Mathematics starter, informed by DBE Intermediate Phase CAPS. Teacher review required.
export const gradeFourMathPaths: GradeOneTopic[] = [
  { id: 'whole-numbers-place-value', title: 'Whole Numbers & Place Value', shortTitle: 'Numbers', emoji: '🔢', colour: 'mint', description: 'Read, compare and round four-digit numbers.', activities: [
    { id: 'place-4382', prompt: 'What is the value of 3 in 4 382?', visual: '4 382', helper: 'Look at the hundreds place.', options: ['300', '30', '3 000'], answer: '300', explanation: 'The 3 represents three hundreds, or 300.' },
    { id: 'expand-5207', prompt: 'Which expanded form makes 5 207?', visual: '5 207 = ?', helper: 'There are no tens.', options: ['5 000 + 200 + 7', '5 000 + 20 + 7', '500 + 200 + 7'], answer: '5 000 + 200 + 7', explanation: '5 207 has five thousands, two hundreds and seven ones.' },
    { id: 'compare-4038', prompt: 'Which number is greatest?', visual: '4 038 | 4 083 | 3 984', helper: 'Compare thousands, then hundreds and tens.', options: ['4 083', '4 038', '3 984'], answer: '4 083', explanation: 'Both 4 000 numbers have zero hundreds; 4 083 has eight tens.' },
    { id: 'round-367', prompt: 'Round 367 to the nearest ten.', visual: '367 → ?', helper: 'Seven ones means round up.', options: ['370', '360', '400'], answer: '370', explanation: '367 is closer to 370 than 360.' },
    { id: 'number-between', prompt: 'Which number is between 2 499 and 2 501?', visual: '2 499 | ? | 2 501', helper: 'Count one step from 2 499.', options: ['2 500', '2 509', '2 490'], answer: '2 500', explanation: '2 500 comes immediately after 2 499.' }
  ]},
  { id: 'operations-and-problems', title: 'Operations & Problems', shortTitle: 'Operations', emoji: '➕', colour: 'blue', description: 'Solve addition, subtraction, multiplication and division stories.', activities: [
    { id: 'add-458-267', prompt: 'What is 458 + 267?', visual: '458 + 267 = ?', helper: 'Add hundreds, tens and ones; regroup where needed.', options: ['725', '715', '625'], answer: '725', explanation: '458 + 200 = 658; + 67 = 725.' },
    { id: 'subtract-804-376', prompt: 'What is 804 − 376?', visual: '804 − 376 = ?', helper: 'Subtract in steps.', options: ['428', '438', '528'], answer: '428', explanation: '804 − 300 = 504; 504 − 76 = 428.' },
    { id: 'groups-8x7', prompt: 'Eight groups of seven pencils: how many pencils?', visual: '8 × 7', helper: 'Use repeated groups or a times table.', options: ['56', '54', '64'], answer: '56', explanation: '8 × 7 = 56.' },
    { id: 'share-72', prompt: '72 sweets are shared equally among 8 learners. How many each?', visual: '72 ÷ 8', helper: 'Eight groups of what make 72?', options: ['9', '8', '12'], answer: '9', explanation: '8 × 9 = 72, so each gets 9.' },
    { id: 'money-change', prompt: 'A notebook costs R37. You pay R50. What change do you get?', visual: 'R50 − R37', helper: 'Count from 37 up to 50.', options: ['R13', 'R17', 'R23'], answer: 'R13', explanation: '50 − 37 = 13, so the change is R13.' }
  ]},
  { id: 'fractions-and-patterns', title: 'Fractions & Patterns', shortTitle: 'Fractions', emoji: '🍕', colour: 'purple', description: 'Compare equal parts and extend number patterns.', activities: [
    { id: 'fraction-quarter', prompt: 'What fraction is one of four equal pieces?', visual: '🍕 ÷ 4', helper: 'One part out of four.', options: ['1/4', '1/2', '4/1'], answer: '1/4', explanation: 'One of four equal parts is one quarter.' },
    { id: 'fraction-equivalent', prompt: 'Which fraction is equal to one half?', visual: '1/2 = ?', helper: 'Two of four equal parts make a half.', options: ['2/4', '1/4', '3/4'], answer: '2/4', explanation: 'Two quarters cover the same amount as one half.' },
    { id: 'fraction-compare', prompt: 'Which fraction of the same whole is larger?', visual: '1/4 | 3/4', helper: 'Both have four equal parts.', options: ['3/4', '1/4', 'They are equal'], answer: '3/4', explanation: 'Three quarters are more than one quarter.' },
    { id: 'pattern-five', prompt: 'What comes next?', visual: '45 → 50 → 55 → ?', helper: 'Add five each time.', options: ['60', '65', '56'], answer: '60', explanation: '55 + 5 = 60.' },
    { id: 'pattern-doubling', prompt: 'Which number follows the doubling rule?', visual: '3 → 6 → 12 → 24 → ?', helper: 'Multiply by two.', options: ['48', '26', '36'], answer: '48', explanation: 'Twice 24 is 48.' }
  ]},
  { id: 'measurement-and-time', title: 'Measurement & Time', shortTitle: 'Measure', emoji: '📏', colour: 'pink', description: 'Work with length, mass, capacity and elapsed time.', activities: [
    { id: 'length-metres', prompt: 'How many centimetres are in one metre?', visual: '1 m = ? cm', helper: 'Think of a metre ruler.', options: ['100', '10', '1 000'], answer: '100', explanation: 'One metre is 100 centimetres.' },
    { id: 'length-compare', prompt: 'Which is longer?', visual: '2 m | 150 cm', helper: 'Convert two metres to centimetres.', options: ['2 m', '150 cm', 'They are equal'], answer: '2 m', explanation: '2 m = 200 cm, which is longer than 150 cm.' },
    { id: 'mass-kilo', prompt: 'How many grams are in one kilogram?', visual: '1 kg = ? g', helper: 'A kilogram has a thousand grams.', options: ['1 000', '100', '10'], answer: '1 000', explanation: '1 kg = 1 000 g.' },
    { id: 'capacity-litre', prompt: 'Which is more liquid?', visual: '1 ℓ | 750 mℓ', helper: 'One litre is 1 000 millilitres.', options: ['1 ℓ', '750 mℓ', 'They are equal'], answer: '1 ℓ', explanation: '1 000 mℓ is more than 750 mℓ.' },
    { id: 'time-elapsed', prompt: 'A lesson starts at 09:15 and lasts 30 minutes. When does it end?', visual: '09:15 + 30 min', helper: 'Add half an hour.', options: ['09:45', '09:30', '10:15'], answer: '09:45', explanation: 'Thirty minutes after 09:15 is 09:45.' }
  ]},
  { id: 'shapes-and-data', title: 'Shapes & Data', shortTitle: 'Explore', emoji: '📊', colour: 'gold', description: 'Recognise shapes and read a simple picture graph.', activities: [
    { id: 'shape-rectangle', prompt: 'Which shape has four right angles and opposite sides equal?', visual: '▭', helper: 'Think of a book cover.', options: ['Rectangle', 'Triangle', 'Circle'], answer: 'Rectangle', explanation: 'A rectangle has four right angles and opposite sides equal.' },
    { id: 'shape-cube', prompt: 'How many faces does a cube have?', visual: '🎲', helper: 'Count front, back, left, right, top and bottom.', options: ['6', '4', '8'], answer: '6', explanation: 'A cube has six square faces.' },
    { id: 'shape-symmetry', prompt: 'Which shape has a vertical line of symmetry?', visual: '⬛ 🔺', helper: 'Imagine folding a square down the middle.', options: ['Square', 'A slanted line', 'An uneven scribble'], answer: 'Square', explanation: 'A vertical line through the centre divides a square into matching halves.' },
    { id: 'data-most', prompt: 'Which fruit got the most votes?', visual: '🍎 ●●●●  🍌 ●●  🍊 ●●●', helper: 'Compare the number of dots.', options: ['Apple', 'Banana', 'Orange'], answer: 'Apple', explanation: 'Apple has four votes, the most.' },
    { id: 'data-difference', prompt: 'How many more votes did apple get than banana?', visual: '🍎 ●●●●  🍌 ●●', helper: 'Subtract the banana count from the apple count.', options: ['2', '4', '6'], answer: '2', explanation: 'Four minus two equals two.' }
  ]}
]

export function getGradeFourMathPath(id?: string) {
  return gradeFourMathPaths.find(path => path.id === id)
}
