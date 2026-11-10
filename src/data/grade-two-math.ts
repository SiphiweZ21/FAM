import type { GradeOneTopic } from './grade-one-topics'

// Grade 2 starter set. Teacher review will refine term order and difficulty.
export const gradeTwoMathPaths: GradeOneTopic[] = [
  { id: 'tens-and-ones', title: 'Tens & Ones', shortTitle: 'Place Value', emoji: '🔟', colour: 'mint', description: 'Build two-digit numbers from tens and ones.', activities: [
    { id: 'place-14', prompt: 'One ten and four ones make which number?', visual: '🔟 + ● ● ● ●', helper: 'Start at ten, then count four more.', options: ['14', '41', '10'], answer: '14', explanation: '10 + 4 = 14.' },
    { id: 'place-23', prompt: 'How many tens and ones are in 23?', visual: '23', helper: 'Read each digit by its place.', options: ['2 tens and 3 ones', '3 tens and 2 ones', '23 tens'], answer: '2 tens and 3 ones', explanation: '23 is 20 plus 3.' },
    { id: 'place-30', prompt: 'Which number is three tens?', visual: '🔟 🔟 🔟', helper: 'Count ten, twenty, thirty.', options: ['3', '13', '30'], answer: '30', explanation: 'Three tens make 30.' },
    { id: 'place-47', prompt: 'What is the value of the 4 in 47?', visual: '47', helper: 'The 4 is in the tens place.', options: ['4', '40', '7'], answer: '40', explanation: 'The 4 represents four tens, or 40.' },
    { id: 'place-52', prompt: 'Five tens and two ones make which number?', visual: '🔟 🔟 🔟 🔟 🔟 + ● ●', helper: 'Count the tens, then the ones.', options: ['25', '52', '50'], answer: '52', explanation: '50 + 2 = 52.' }
  ]},
  { id: 'add-and-subtract', title: 'Add & Subtract', shortTitle: 'Operations', emoji: '🍎', colour: 'blue', description: 'Use pictures and number facts within 20.', activities: [
    { id: 'add-8-5', prompt: 'Eight apples plus five apples make how many?', visual: '🍎 8 + 🍎 5', helper: 'Make ten, then count three more.', options: ['12', '13', '14'], answer: '13', explanation: '8 + 5 = 13.' },
    { id: 'subtract-15-4', prompt: 'Fifteen birds. Four fly away. How many remain?', visual: '🐦 15 − 4', helper: 'Count backwards four steps.', options: ['11', '12', '19'], answer: '11', explanation: '15 − 4 = 11.' },
    { id: 'add-9-6', prompt: 'What is 9 plus 6?', visual: '9 + 6 = ?', helper: 'Nine plus one makes ten. Add five more.', options: ['14', '15', '16'], answer: '15', explanation: '9 + 6 = 15.' },
    { id: 'subtract-18-7', prompt: 'What is 18 minus 7?', visual: '18 − 7 = ?', helper: 'Count back seven.', options: ['10', '11', '12'], answer: '11', explanation: '18 − 7 = 11.' },
    { id: 'missing-number', prompt: 'Which number makes this true?', visual: '7 + ? = 12', helper: 'Count from seven up to twelve.', options: ['4', '5', '6'], answer: '5', explanation: '7 + 5 = 12.' }
  ]},
  { id: 'number-patterns', title: 'Number Patterns', shortTitle: 'Patterns', emoji: '🚂', colour: 'purple', description: 'Count in twos, fives and tens.', activities: [
    { id: 'twos', prompt: 'What comes next when counting in twos?', visual: '2 → 4 → 6 → ?', helper: 'Add two to six.', options: ['7', '8', '10'], answer: '8', explanation: '2, 4, 6, 8.' },
    { id: 'fives', prompt: 'What comes next when counting in fives?', visual: '5 → 10 → 15 → ?', helper: 'Add five to fifteen.', options: ['16', '20', '25'], answer: '20', explanation: '5, 10, 15, 20.' },
    { id: 'tens', prompt: 'What is the missing number?', visual: '10 → 20 → ? → 40', helper: 'Count in tens.', options: ['25', '30', '50'], answer: '30', explanation: '10, 20, 30, 40.' },
    { id: 'back-twos', prompt: 'Count backwards in twos.', visual: '12 → 10 → 8 → ?', helper: 'Take away two.', options: ['4', '6', '7'], answer: '6', explanation: '12, 10, 8, 6.' },
    { id: 'find-rule', prompt: 'What is the rule?', visual: '3 → 5 → 7 → 9', helper: 'Compare two numbers next to each other.', options: ['Add 1', 'Add 2', 'Add 5'], answer: 'Add 2', explanation: 'Each number is two more than the last.' }
  ]},
  { id: 'shapes-and-measurement', title: 'Shapes & Measurement', shortTitle: 'Measure', emoji: '📏', colour: 'pink', description: 'Explore shape, length, time and capacity.', activities: [
    { id: 'shape-rectangle', prompt: 'Which shape has four straight sides?', visual: '▭ ○ △', helper: 'Count the edges.', options: ['Rectangle', 'Circle', 'Triangle'], answer: 'Rectangle', explanation: 'A rectangle has four straight sides.' },
    { id: 'measure-longer', prompt: 'Which pencil is longer?', visual: 'A: ━━━━━━━   B: ━━━', helper: 'Compare the drawn lines.', options: ['A', 'B', 'Same length'], answer: 'A', explanation: 'Pencil A is drawn longer.' },
    { id: 'time-half', prompt: 'What time is half past three?', visual: '🕞', helper: 'The minute hand points to six.', options: ['3:00', '3:30', '6:30'], answer: '3:30', explanation: 'Half past three is 3:30.' },
    { id: 'capacity', prompt: 'Which container can usually hold more water?', visual: '🥄 🪣', helper: 'Compare a spoon and a bucket.', options: ['Spoon', 'Bucket', 'Same amount'], answer: 'Bucket', explanation: 'A bucket usually holds more than a spoon.' },
    { id: 'sides-triangle', prompt: 'How many sides does a triangle have?', visual: '△', helper: 'Trace each edge.', options: ['2', '3', '4'], answer: '3', explanation: 'A triangle has three sides.' }
  ]},
  { id: 'money-and-data', title: 'Money & Picture Graphs', shortTitle: 'Money & Data', emoji: '🪙', colour: 'gold', description: 'Work with rand and read simple picture counts.', activities: [
    { id: 'money-10', prompt: 'How much is R5 plus R5?', visual: 'R5 + R5', helper: 'Count five more.', options: ['R8', 'R10', 'R15'], answer: 'R10', explanation: 'R5 + R5 = R10.' },
    { id: 'money-change', prompt: 'You pay R10 for a R7 item. How much is left?', visual: 'R10 − R7', helper: 'Count from seven to ten.', options: ['R2', 'R3', 'R4'], answer: 'R3', explanation: 'R10 − R7 = R3.' },
    { id: 'graph-apples', prompt: 'Which fruit has more pictures?', visual: 'Apples: 🍎 🍎 🍎   Bananas: 🍌 🍌', helper: 'Count each row.', options: ['Apples', 'Bananas', 'Equal'], answer: 'Apples', explanation: 'There are three apples and two bananas.' },
    { id: 'graph-total', prompt: 'How many fruits are shown in all?', visual: '🍎 🍎   🍌 🍌 🍌', helper: 'Count both kinds together.', options: ['4', '5', '6'], answer: '5', explanation: 'Two apples plus three bananas make five fruits.' },
    { id: 'money-enough', prompt: 'A snack costs R8. Is R10 enough?', visual: '🥪 R8   |   You have R10', helper: 'Compare eight rand with ten rand.', options: ['Yes', 'No', 'Equal'], answer: 'Yes', explanation: 'R10 is more than R8.' }
  ]}
]

export function getGradeTwoMathPath(id?: string) {
  return gradeTwoMathPaths.find(path => path.id === id)
}
