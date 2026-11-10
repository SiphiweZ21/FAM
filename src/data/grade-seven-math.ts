import type { GradeOneTopic } from './grade-one-topics'

// Grade 7 Mathematics starter informed by DBE Senior Phase ATP.
export const gradeSevenMathPaths: GradeOneTopic[] = [
  { id: 'whole-numbers-and-ratios', title: 'Whole Numbers & Ratios', shortTitle: 'Numbers', emoji: '🔢', colour: 'mint', description: 'Use operations, factors, rates and ratios.', activities: [
    { id: 'order-operations', prompt: 'Calculate 18 + 6 × 3.', visual: '18 + 6 × 3', helper: 'Multiply before adding.', options: ['36', '72', '54'], answer: '36', explanation: '6 × 3 = 18; then 18 + 18 = 36.' },
    { id: 'factor-36', prompt: 'Which number is a factor of 36?', visual: '36 ÷ ?', helper: 'A factor divides with no remainder.', options: ['9', '7', '8'], answer: '9', explanation: '36 ÷ 9 = 4 exactly.' },
    { id: 'prime', prompt: 'Which number is prime?', visual: '11 | 12 | 15', helper: 'It has only two positive factors.', options: ['11', '12', '15'], answer: '11', explanation: '11 has positive factors 1 and 11.' },
    { id: 'ratio', prompt: 'Red to blue counters are in a ratio of 2:3. If there are 4 red counters, how many blue?', visual: '🔴🔴 : 🔵🔵🔵', helper: 'Double both parts.', options: ['6', '5', '8'], answer: '6', explanation: 'Doubling 2:3 gives 4:6.' },
    { id: 'rate', prompt: 'A cyclist travels 30 km in 2 hours at a steady speed. What is the speed?', visual: '30 km ÷ 2 h', helper: 'Find distance for one hour.', options: ['15 km/h', '30 km/h', '60 km/h'], answer: '15 km/h', explanation: '30 ÷ 2 = 15 km per hour.' }
  ]},
  { id: 'fractions-decimals-and-percentages', title: 'Fractions, Decimals & Percentages', shortTitle: 'Fractions', emoji: '🍕', colour: 'purple', description: 'Compare and calculate with three related number forms.', activities: [
    { id: 'fraction-add', prompt: 'What is 1/2 + 1/3?', visual: '3/6 + 2/6', helper: 'Use sixths.', options: ['5/6', '2/5', '1/6'], answer: '5/6', explanation: '3/6 + 2/6 = 5/6.' },
    { id: 'fraction-multiply', prompt: 'What is 2/3 of 18?', visual: '18 ÷ 3 × 2', helper: 'Find one third, then two thirds.', options: ['12', '9', '6'], answer: '12', explanation: 'One third is 6, so two thirds is 12.' },
    { id: 'decimal-place', prompt: 'What is the value of 7 in 2.375?', visual: '2.375', helper: 'Count digits after the decimal point.', options: ['7 hundredths', '7 tenths', '7 thousandths'], answer: '7 hundredths', explanation: 'The 7 is the second digit after the decimal point.' },
    { id: 'decimal-calc', prompt: 'Calculate 4.25 + 1.375.', visual: '4.250 + 1.375', helper: 'Line up the decimal places.', options: ['5.625', '5.500', '6.625'], answer: '5.625', explanation: '4.250 + 1.375 = 5.625.' },
    { id: 'percent-discount', prompt: 'A R100 item has a 20% discount. What is its new price?', visual: 'R100 − 20%', helper: 'Find 20% of R100 first.', options: ['R80', 'R20', 'R120'], answer: 'R80', explanation: '20% of R100 is R20, so the new price is R80.' }
  ]},
  { id: 'integers-and-exponents', title: 'Integers & Exponents', shortTitle: 'Integers', emoji: '➖', colour: 'blue', description: 'Order signed numbers and calculate squares and cubes.', activities: [
    { id: 'integer-order', prompt: 'Which number is smallest?', visual: '−5 | −2 | 0', helper: 'Look left on a number line.', options: ['−5', '−2', '0'], answer: '−5', explanation: '−5 is farther left than −2 and 0.' },
    { id: 'integer-add', prompt: 'Calculate −3 + 7.', visual: '−3 + 7', helper: 'Move seven steps right from −3.', options: ['4', '−10', '10'], answer: '4', explanation: '−3 + 7 = 4.' },
    { id: 'integer-subtract', prompt: 'Calculate 2 − 6.', visual: '2 − 6', helper: 'Move six steps left from 2.', options: ['−4', '4', '8'], answer: '−4', explanation: '2 − 6 = −4.' },
    { id: 'square', prompt: 'What is 12²?', visual: '12 × 12', helper: 'Square means multiply by itself.', options: ['144', '24', '121'], answer: '144', explanation: '12 × 12 = 144.' },
    { id: 'cube-root', prompt: 'What is the cube root of 64?', visual: '□ × □ × □ = 64', helper: 'Four multiplied by itself three times.', options: ['4', '8', '16'], answer: '4', explanation: '4 × 4 × 4 = 64.' }
  ]},
  { id: 'patterns-and-equations', title: 'Patterns & Equations', shortTitle: 'Patterns', emoji: '🧩', colour: 'pink', description: 'Describe input rules and solve simple equations.', activities: [
    { id: 'pattern-rule', prompt: 'What is the next term?', visual: '3 → 7 → 11 → 15 → ?', helper: 'Find the constant difference.', options: ['19', '18', '20'], answer: '19', explanation: 'Add 4 to each term.' },
    { id: 'pattern-table', prompt: 'Rule: output = 3 × input + 1. What is the output for 5?', visual: '5 → ×3 → +1', helper: 'Multiply, then add.', options: ['16', '18', '15'], answer: '16', explanation: '3 × 5 + 1 = 16.' },
    { id: 'equation-add', prompt: 'Solve x + 7 = 19.', visual: 'x + 7 = 19', helper: 'Subtract seven from both sides.', options: ['12', '26', '11'], answer: '12', explanation: '19 − 7 = 12.' },
    { id: 'equation-multiply', prompt: 'Solve 4x = 28.', visual: '4 × x = 28', helper: 'Divide by four.', options: ['7', '24', '32'], answer: '7', explanation: '28 ÷ 4 = 7.' },
    { id: 'equivalent', prompt: 'Which expression is equivalent to 2(n + 3)?', visual: '2(n + 3)', helper: 'Multiply both terms inside by 2.', options: ['2n + 6', '2n + 3', 'n + 6'], answer: '2n + 6', explanation: 'Distributing 2 gives 2n + 6.' }
  ]},
  { id: 'geometry-measurement-and-data', title: 'Geometry, Measurement & Data', shortTitle: 'Geometry', emoji: '📐', colour: 'gold', description: 'Use angle and shape facts, area, volume and data summaries.', activities: [
    { id: 'angle-line', prompt: 'Two angles on a straight line are 110° and x. What is x?', visual: '110° + x = 180°', helper: 'Angles on a straight line total 180°.', options: ['70°', '110°', '90°'], answer: '70°', explanation: '180° − 110° = 70°.' },
    { id: 'triangle-angles', prompt: 'A triangle has angles 50° and 60°. What is its third angle?', visual: '50° + 60° + x = 180°', helper: 'Triangle angles total 180°.', options: ['70°', '80°', '110°'], answer: '70°', explanation: '180° − 50° − 60° = 70°.' },
    { id: 'area', prompt: 'What is the area of a triangle with base 8 cm and height 5 cm?', visual: '1/2 × 8 × 5', helper: 'Half the base times height.', options: ['20 cm²', '40 cm²', '13 cm²'], answer: '20 cm²', explanation: '1/2 × 8 × 5 = 20 cm².' },
    { id: 'volume', prompt: 'What is the volume of a 3 cm × 4 cm × 5 cm rectangular prism?', visual: '3 × 4 × 5', helper: 'Multiply length, width and height.', options: ['60 cm³', '12 cm³', '24 cm³'], answer: '60 cm³', explanation: '3 × 4 × 5 = 60 cubic centimetres.' },
    { id: 'data-median', prompt: 'What is the median of 3, 5, 7, 9, 11?', visual: '3 | 5 | 7 | 9 | 11', helper: 'Find the middle value.', options: ['7', '5', '9'], answer: '7', explanation: 'The middle value of five ordered numbers is 7.' }
  ]}
]

export function getGradeSevenMathPath(id?: string) {
  return gradeSevenMathPaths.find(path => path.id === id)
}
