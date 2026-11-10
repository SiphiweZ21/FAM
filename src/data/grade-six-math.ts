import type { GradeOneTopic } from './grade-one-topics'

// Grade 6 Mathematics introductory practice informed by DBE Intermediate Phase ATP.
export const gradeSixMathPaths: GradeOneTopic[] = [
  { id: 'whole-numbers-and-operations', title: 'Whole Numbers & Operations', shortTitle: 'Numbers', emoji: '🔢', colour: 'mint', description: 'Use place value, factors and the four operations.', activities: [
    { id: 'place-million', prompt: 'What is the value of 6 in 2 645 091?', visual: '2 645 091', helper: 'Locate the hundred-thousands digit.', options: ['600 000', '60 000', '6 000'], answer: '600 000', explanation: 'The 6 is in the hundred-thousands place.' },
    { id: 'round-ten-thousand', prompt: 'Round 476 381 to the nearest ten thousand.', visual: '476 381 → ?', helper: 'Look at the thousands digit, 6.', options: ['480 000', '470 000', '476 000'], answer: '480 000', explanation: 'Six thousands means the ten-thousands digit rounds up.' },
    { id: 'multiply-36', prompt: 'Calculate 36 × 24.', visual: '36 × (20 + 4)', helper: 'Add 36 × 20 and 36 × 4.', options: ['864', '844', '904'], answer: '864', explanation: '720 + 144 = 864.' },
    { id: 'divide-936', prompt: 'Calculate 936 ÷ 12.', visual: '936 ÷ 12', helper: '12 × 78 = ?', options: ['78', '68', '88'], answer: '78', explanation: '12 × 78 = 936.' },
    { id: 'multiple-9', prompt: 'Which number is a multiple of both 6 and 9?', visual: '6 | 9', helper: 'Check whether both divide the number exactly.', options: ['18', '24', '27'], answer: '18', explanation: '18 = 6 × 3 and 9 × 2.' }
  ]},
  { id: 'fractions-and-percentages', title: 'Fractions & Percentages', shortTitle: 'Fractions', emoji: '🍕', colour: 'purple', description: 'Find equivalent parts, calculate and connect percentages.', activities: [
    { id: 'equivalent-thirds', prompt: 'Which fraction equals 2/3?', visual: '2/3 = ?', helper: 'Multiply the top and bottom by two.', options: ['4/6', '3/6', '4/9'], answer: '4/6', explanation: '2/3 and 4/6 cover the same amount.' },
    { id: 'add-quarters', prompt: 'What is 1/2 + 1/4?', visual: '2/4 + 1/4', helper: 'Write the half as quarters.', options: ['3/4', '2/6', '1/4'], answer: '3/4', explanation: 'Two quarters plus one quarter is three quarters.' },
    { id: 'fraction-of-40', prompt: 'What is 3/5 of 40?', visual: '40 ÷ 5 × 3', helper: 'Find one fifth first.', options: ['24', '15', '20'], answer: '24', explanation: 'One fifth of 40 is 8; three fifths is 24.' },
    { id: 'percent-200', prompt: 'What is 25% of 200?', visual: '25% = 1/4', helper: 'Find one quarter of 200.', options: ['50', '25', '75'], answer: '50', explanation: 'A quarter of 200 is 50.' },
    { id: 'percent-equivalent', prompt: 'Which percentage equals 3/4?', visual: '3/4 = ?%', helper: 'A quarter is 25%.', options: ['75%', '34%', '25%'], answer: '75%', explanation: 'Three quarters is three lots of 25%.' }
  ]},
  { id: 'decimal-fractions', title: 'Decimal Fractions', shortTitle: 'Decimals', emoji: '🔟', colour: 'blue', description: 'Compare, calculate and link decimals to fractions.', activities: [
    { id: 'decimal-place', prompt: 'What is the value of the 7 in 4.73?', visual: '4.73', helper: 'It is the first digit after the decimal point.', options: ['7 tenths', '7 hundredths', '7 ones'], answer: '7 tenths', explanation: 'The first place after the decimal point is tenths.' },
    { id: 'decimal-compare', prompt: 'Which decimal is greatest?', visual: '0.8 | 0.75 | 0.09', helper: 'Write 0.8 as 0.80.', options: ['0.8', '0.75', '0.09'], answer: '0.8', explanation: '0.80 is greater than 0.75 and 0.09.' },
    { id: 'decimal-add', prompt: 'Calculate 3.45 + 2.30.', visual: '3.45 + 2.30', helper: 'Line up the decimal points.', options: ['5.75', '5.48', '5.65'], answer: '5.75', explanation: '45 hundredths plus 30 hundredths is 75 hundredths.' },
    { id: 'decimal-subtract', prompt: 'Calculate 8.00 − 1.65.', visual: '8.00 − 1.65', helper: 'Subtract 1, then 0.65.', options: ['6.35', '7.35', '6.45'], answer: '6.35', explanation: '8.00 − 1.65 = 6.35.' },
    { id: 'decimal-hundred', prompt: 'What is 0.36 × 100?', visual: '0.36 × 100', helper: 'Thirty-six hundredths make how many ones?', options: ['36', '3.6', '0.0036'], answer: '36', explanation: 'Multiplying by 100 turns 36 hundredths into 36.' }
  ]},
  { id: 'patterns-and-number-sentences', title: 'Patterns & Number Sentences', shortTitle: 'Patterns', emoji: '🧩', colour: 'pink', description: 'Find rules, complete equations and test inputs.', activities: [
    { id: 'pattern-double', prompt: 'What comes next in this pattern?', visual: '3 → 6 → 12 → 24 → ?', helper: 'Each number is doubled.', options: ['48', '30', '36'], answer: '48', explanation: '24 × 2 = 48.' },
    { id: 'pattern-difference', prompt: 'What comes next?', visual: '50 → 45 → 40 → 35 → ?', helper: 'Subtract the same amount each time.', options: ['30', '25', '32'], answer: '30', explanation: 'The rule is subtract 5.' },
    { id: 'input-output', prompt: 'The rule is multiply by 4, then subtract 1. What is the output for 6?', visual: '6 → ×4 → −1', helper: 'Multiply first.', options: ['23', '20', '24'], answer: '23', explanation: '6 × 4 − 1 = 23.' },
    { id: 'missing-value', prompt: 'Which number completes 8 × □ = 72?', visual: '8 × □ = 72', helper: 'Divide 72 by 8.', options: ['9', '8', '10'], answer: '9', explanation: '8 × 9 = 72.' },
    { id: 'word-equation', prompt: 'Thabo has 15 marbles and receives some more. He now has 23. How many did he receive?', visual: '15 + □ = 23', helper: 'Find the difference.', options: ['8', '7', '38'], answer: '8', explanation: '23 − 15 = 8.' }
  ]},
  { id: 'geometry-measurement-and-data', title: 'Geometry, Measurement & Data', shortTitle: 'Shapes', emoji: '📐', colour: 'gold', description: 'Explore angles, area, volume, time and data.', activities: [
    { id: 'angle-obtuse', prompt: 'Which angle is greater than 90° but smaller than 180°?', visual: '90° < ? < 180°', helper: 'It is wider than a right angle.', options: ['Obtuse angle', 'Acute angle', 'Right angle'], answer: 'Obtuse angle', explanation: 'An obtuse angle is between 90° and 180°.' },
    { id: 'perimeter', prompt: 'What is the perimeter of a 9 cm by 4 cm rectangle?', visual: '▭ 9 cm × 4 cm', helper: 'Add the lengths of all four sides.', options: ['26 cm', '36 cm', '13 cm'], answer: '26 cm', explanation: '9 + 4 + 9 + 4 = 26 cm.' },
    { id: 'area', prompt: 'What is the area of a 9 cm by 4 cm rectangle?', visual: '▭ 9 cm × 4 cm', helper: 'Multiply the two side lengths.', options: ['36 cm²', '26 cm²', '13 cm²'], answer: '36 cm²', explanation: '9 × 4 = 36 square centimetres.' },
    { id: 'volume-cubes', prompt: 'A box holds 3 layers of 4 × 2 unit cubes. What is its volume?', visual: '3 layers × 4 × 2', helper: 'Count cubes in one layer, then all layers.', options: ['24 cubic units', '9 cubic units', '12 cubic units'], answer: '24 cubic units', explanation: '4 × 2 × 3 = 24 unit cubes.' },
    { id: 'data-range', prompt: 'What is the range of these test scores?', visual: '12, 15, 18, 20, 25', helper: 'Subtract the smallest from the largest.', options: ['13', '25', '12'], answer: '13', explanation: '25 − 12 = 13.' }
  ]}
]

export function getGradeSixMathPath(id?: string) {
  return gradeSixMathPaths.find(path => path.id === id)
}
