import type { GradeOneTopic } from './grade-one-topics'

// Grade 5 Mathematics starter informed by DBE Intermediate Phase CAPS and Grade 5 ATP.
export const gradeFiveMathPaths: GradeOneTopic[] = [
  { id: 'large-numbers-place-value', title: 'Large Numbers & Place Value', shortTitle: 'Numbers', emoji: '🔢', colour: 'mint', description: 'Read, compare and round numbers up to six digits.', activities: [
    { id: 'value-407258', prompt: 'What is the value of 7 in 407 258?', visual: '407 258', helper: 'Find the thousands position.', options: ['7 000', '700', '70 000'], answer: '7 000', explanation: 'The 7 is in the thousands place, so it is worth 7 000.' },
    { id: 'expand-150306', prompt: 'Which expanded form makes 150 306?', visual: '150 306 = ?', helper: 'Find the nonzero place values.', options: ['100 000 + 50 000 + 300 + 6', '100 000 + 5 000 + 300 + 6', '10 000 + 50 000 + 300 + 6'], answer: '100 000 + 50 000 + 300 + 6', explanation: '150 306 has one hundred thousand, five ten-thousands, three hundreds and six ones.' },
    { id: 'compare-604210', prompt: 'Which number is greatest?', visual: '604 210 | 640 120 | 604 201', helper: 'Compare hundred-thousands, then ten-thousands.', options: ['640 120', '604 210', '604 201'], answer: '640 120', explanation: '640 120 has four ten-thousands; the others have zero.' },
    { id: 'round-37846', prompt: 'Round 37 846 to the nearest hundred.', visual: '37 846 → ?', helper: 'Look at the tens digit.', options: ['37 800', '37 900', '38 000'], answer: '37 800', explanation: 'The tens digit is 4, so the hundreds stay at 8.' },
    { id: 'round-thousand', prompt: 'Round 52 680 to the nearest thousand.', visual: '52 680 → ?', helper: 'The hundreds digit is 6.', options: ['53 000', '52 000', '60 000'], answer: '53 000', explanation: '680 is at least 500, so round up to 53 000.' }
  ]},
  { id: 'operations-and-number-stories', title: 'Operations & Number Stories', shortTitle: 'Operations', emoji: '➕', colour: 'blue', description: 'Calculate with larger numbers and check the result.', activities: [
    { id: 'add-13450', prompt: 'What is 13 450 + 2 375?', visual: '13 450 + 2 375', helper: 'Add 2 000, then 375.', options: ['15 825', '15 725', '16 825'], answer: '15 825', explanation: '13 450 + 2 000 = 15 450; add 375 to get 15 825.' },
    { id: 'subtract-20000', prompt: 'What is 20 000 − 3 675?', visual: '20 000 − 3 675', helper: 'Subtract 3 000 and then 675.', options: ['16 325', '17 325', '16 425'], answer: '16 325', explanation: '20 000 − 3 000 = 17 000; 17 000 − 675 = 16 325.' },
    { id: 'multiply-24-6', prompt: 'There are 24 books in each of 6 boxes. How many books altogether?', visual: '24 × 6', helper: 'Six groups of 20 and six groups of 4.', options: ['144', '124', '164'], answer: '144', explanation: '20 × 6 = 120 and 4 × 6 = 24; total 144.' },
    { id: 'divide-96-8', prompt: '96 pencils are shared equally among 8 groups. How many in each?', visual: '96 ÷ 8', helper: 'Eight times what equals 96?', options: ['12', '11', '14'], answer: '12', explanation: '8 × 12 = 96, so each group has 12 pencils.' },
    { id: 'number-sentence', prompt: 'Which number completes 450 + □ = 1 000?', visual: '450 + □ = 1 000', helper: 'Subtract 450 from 1 000.', options: ['550', '450', '650'], answer: '550', explanation: '1 000 − 450 = 550; 450 + 550 = 1 000.' }
  ]},
  { id: 'fractions-and-sharing', title: 'Fractions & Sharing', shortTitle: 'Fractions', emoji: '🍕', colour: 'purple', description: 'Compare fractions and share equal parts.', activities: [
    { id: 'fractions-equivalent', prompt: 'Which fraction is equal to 1/2?', visual: '1/2 = ?', helper: 'Multiply numerator and denominator by two.', options: ['2/4', '1/4', '2/3'], answer: '2/4', explanation: 'Two quarters cover the same part of a whole as one half.' },
    { id: 'fractions-compare', prompt: 'Which is greater if the wholes are the same size?', visual: '3/5 | 2/5', helper: 'The denominators are the same.', options: ['3/5', '2/5', 'They are equal'], answer: '3/5', explanation: 'Three fifths is more than two fifths.' },
    { id: 'fractions-add', prompt: 'What is 2/8 + 3/8?', visual: '2/8 + 3/8', helper: 'Add the numerators; keep the denominator.', options: ['5/8', '5/16', '1/8'], answer: '5/8', explanation: 'Two eighths plus three eighths equals five eighths.' },
    { id: 'fraction-of-24', prompt: 'What is one quarter of 24?', visual: '24 ÷ 4', helper: 'Split 24 into four equal groups.', options: ['6', '8', '12'], answer: '6', explanation: '24 ÷ 4 = 6.' },
    { id: 'mixed-number', prompt: 'One whole and one half can be written as?', visual: '1 + 1/2', helper: 'Name the whole and the part.', options: ['1 1/2', '2 1/2', '1/3'], answer: '1 1/2', explanation: 'One whole plus one half is 1 1/2.' }
  ]},
  { id: 'patterns-and-shapes', title: 'Patterns & Shapes', shortTitle: 'Patterns', emoji: '🧩', colour: 'pink', description: 'Find pattern rules and recognise shape properties.', activities: [
    { id: 'pattern-six', prompt: 'What comes next?', visual: '6 → 12 → 18 → 24 → ?', helper: 'Add six each time.', options: ['30', '28', '36'], answer: '30', explanation: '24 + 6 = 30.' },
    { id: 'pattern-input', prompt: 'The rule is “multiply by 3, then add 2”. What is the output for 4?', visual: '4 → ×3 → +2 → ?', helper: 'Multiply first, then add.', options: ['14', '18', '12'], answer: '14', explanation: '4 × 3 = 12; 12 + 2 = 14.' },
    { id: 'shape-parallel', prompt: 'Which shape has two pairs of parallel sides?', visual: '▭ 🔺 ⚪', helper: 'Look at opposite sides.', options: ['Rectangle', 'Triangle', 'Circle'], answer: 'Rectangle', explanation: 'A rectangle has two pairs of opposite parallel sides.' },
    { id: 'shape-right-angle', prompt: 'How many right angles does a rectangle have?', visual: '▭', helper: 'Check its four corners.', options: ['4', '2', '0'], answer: '4', explanation: 'Each corner of a rectangle is a right angle.' },
    { id: 'shape-prism', prompt: 'Which solid has two triangular faces and three rectangular faces?', visual: '🔺 📦', helper: 'Think of a triangle stretched into a solid.', options: ['Triangular prism', 'Cube', 'Sphere'], answer: 'Triangular prism', explanation: 'A triangular prism has two triangular ends and three rectangular faces.' }
  ]},
  { id: 'measurement-and-data', title: 'Measurement & Data', shortTitle: 'Measure', emoji: '📊', colour: 'gold', description: 'Work with perimeter, area, time and picture data.', activities: [
    { id: 'perimeter-rect', prompt: 'What is the perimeter of a 6 cm by 4 cm rectangle?', visual: '6 cm × 4 cm rectangle', helper: 'Add all four sides.', options: ['20 cm', '24 cm', '10 cm'], answer: '20 cm', explanation: '6 + 4 + 6 + 4 = 20 cm.' },
    { id: 'area-grid', prompt: 'A rectangle has 3 rows of 5 equal square units. What is its area?', visual: '⬜⬜⬜⬜⬜ / ⬜⬜⬜⬜⬜ / ⬜⬜⬜⬜⬜', helper: 'Count the squares in all three rows.', options: ['15 square units', '8 square units', '16 square units'], answer: '15 square units', explanation: '3 × 5 = 15 square units.' },
    { id: 'time-elapsed', prompt: 'A class starts at 10:20 and ends at 11:05. How long is it?', visual: '10:20 → 11:05', helper: 'Count 40 minutes to 11:00, then 5 more.', options: ['45 minutes', '35 minutes', '55 minutes'], answer: '45 minutes', explanation: '10:20 to 11:00 is 40 minutes; add 5 to get 45.' },
    { id: 'data-most', prompt: 'Which transport has the most votes?', visual: 'Bus ●●●●●  Walk ●●●  Bike ●●', helper: 'Count each row of dots.', options: ['Bus', 'Walk', 'Bike'], answer: 'Bus', explanation: 'Bus has five votes, more than walk or bike.' },
    { id: 'data-total', prompt: 'How many voted for walk or bike altogether?', visual: 'Walk ●●●  Bike ●●', helper: 'Add three and two.', options: ['5', '6', '3'], answer: '5', explanation: '3 + 2 = 5 votes.' }
  ]}
]

export function getGradeFiveMathPath(id?: string) {
  return gradeFiveMathPaths.find(path => path.id === id)
}
