import type { GradeOneTopic } from './grade-one-topics'

// Grade 3 Mathematics starter activities. Teacher review will refine term order and range.
export const gradeThreeMathPaths: GradeOneTopic[] = [
  { id: 'hundreds-tens-ones', title: 'Hundreds, Tens & Ones', shortTitle: 'Place Value', emoji: '💯', colour: 'mint', description: 'Build and compare three-digit numbers.', activities: [
    { id: 'place-236', prompt: 'Two hundreds, three tens and six ones make?', visual: '200 + 30 + 6', helper: 'Put the hundreds, tens and ones together.', options: ['236', '263', '326'], answer: '236', explanation: '200 + 30 + 6 = 236.' },
    { id: 'place-470', prompt: 'What is the value of the 7 in 470?', visual: '470', helper: 'The 7 is in the tens place.', options: ['7', '70', '700'], answer: '70', explanation: 'The 7 stands for seven tens, or 70.' },
    { id: 'place-508', prompt: 'Which number is five hundreds and eight ones?', visual: '500 + 8', helper: 'There are no tens.', options: ['580', '508', '805'], answer: '508', explanation: '500 + 0 + 8 = 508.' },
    { id: 'compare-341', prompt: 'Which number is greater?', visual: '341   |   314', helper: 'Compare hundreds, then tens.', options: ['341', '314', 'Equal'], answer: '341', explanation: 'Both have three hundreds; 341 has more tens.' },
    { id: 'place-900', prompt: 'How many hundreds make 900?', visual: '100 × ?', helper: 'Count by hundreds.', options: ['9', '90', '900'], answer: '9', explanation: 'Nine hundreds make 900.' }
  ]},
  { id: 'addition-subtraction', title: 'Add & Subtract', shortTitle: 'Operations', emoji: '➕', colour: 'blue', description: 'Use tens and ones to solve number stories.', activities: [
    { id: 'add-24-13', prompt: 'What is 24 plus 13?', visual: '24 + 13 = ?', helper: 'Add tens, then ones.', options: ['37', '36', '47'], answer: '37', explanation: '20 + 10 = 30 and 4 + 3 = 7, so 37.' },
    { id: 'subtract-58-24', prompt: 'What is 58 minus 24?', visual: '58 − 24 = ?', helper: 'Take away two tens and four ones.', options: ['32', '34', '44'], answer: '34', explanation: '58 − 20 = 38; 38 − 4 = 34.' },
    { id: 'add-46-27', prompt: 'What is 46 plus 27?', visual: '46 + 27 = ?', helper: 'Make a ten from the ones.', options: ['63', '73', '83'], answer: '73', explanation: '46 + 20 = 66; add 7 to get 73.' },
    { id: 'subtract-100-35', prompt: 'What is 100 minus 35?', visual: '100 − 35 = ?', helper: 'Take away 30, then 5.', options: ['65', '75', '85'], answer: '65', explanation: '100 − 30 = 70; 70 − 5 = 65.' },
    { id: 'missing-add', prompt: 'Which number completes the sum?', visual: '38 + ? = 50', helper: 'Count from 38 up to 50.', options: ['10', '12', '22'], answer: '12', explanation: '38 + 12 = 50.' }
  ]},
  { id: 'groups-and-sharing', title: 'Groups & Sharing', shortTitle: 'Groups', emoji: '🧺', colour: 'purple', description: 'Make equal groups and share fairly.', activities: [
    { id: 'groups-3', prompt: 'Three groups of four make how many?', visual: '●●●● | ●●●● | ●●●●', helper: 'Count four, eight, twelve.', options: ['7', '12', '16'], answer: '12', explanation: '3 × 4 = 12.' },
    { id: 'share-12', prompt: 'Twelve apples shared equally between three friends: how many each?', visual: '🍎 12 ÷ 3', helper: 'Make three equal groups.', options: ['3', '4', '6'], answer: '4', explanation: 'Each friend gets four apples.' },
    { id: 'groups-5', prompt: 'Four groups of five make how many?', visual: '5 + 5 + 5 + 5', helper: 'Count in fives.', options: ['15', '20', '25'], answer: '20', explanation: 'Four groups of five make 20.' },
    { id: 'share-18', prompt: 'Eighteen crayons go into three equal boxes. How many in each?', visual: '18 ÷ 3', helper: 'Share one at a time across three boxes.', options: ['5', '6', '9'], answer: '6', explanation: 'Three groups of six make 18.' },
    { id: 'groups-2', prompt: 'Seven pairs of shoes have how many shoes?', visual: '👟👟 × 7', helper: 'Count in twos seven times.', options: ['12', '14', '16'], answer: '14', explanation: '7 × 2 = 14.' }
  ]},
  { id: 'fractions-patterns', title: 'Fractions & Patterns', shortTitle: 'Fractions', emoji: '🍕', colour: 'pink', description: 'Recognise equal parts and number rules.', activities: [
    { id: 'half', prompt: 'One of two equal parts is called?', visual: '◐', helper: 'The whole has two equal parts.', options: ['A half', 'A quarter', 'A whole'], answer: 'A half', explanation: 'One of two equal parts is a half.' },
    { id: 'quarter', prompt: 'One of four equal pieces is called?', visual: '🍕 ÷ 4', helper: 'The whole has four equal pieces.', options: ['A half', 'A quarter', 'A whole'], answer: 'A quarter', explanation: 'One of four equal parts is a quarter.' },
    { id: 'two-halves', prompt: 'Two halves make how many wholes?', visual: '½ + ½', helper: 'Put two equal halves together.', options: ['One whole', 'Two wholes', 'One quarter'], answer: 'One whole', explanation: 'Two halves make one whole.' },
    { id: 'pattern-3', prompt: 'What comes next?', visual: '3 → 6 → 9 → 12 → ?', helper: 'Count in threes.', options: ['13', '15', '18'], answer: '15', explanation: 'Add three to twelve to get 15.' },
    { id: 'pattern-10', prompt: 'What is the missing number?', visual: '40 → 50 → ? → 70', helper: 'Count in tens.', options: ['55', '60', '80'], answer: '60', explanation: '40, 50, 60, 70.' }
  ]},
  { id: 'time-shapes-data', title: 'Time, Shapes & Data', shortTitle: 'Explore', emoji: '⏰', colour: 'gold', description: 'Read time, recognise shapes and count picture data.', activities: [
    { id: 'time-quarter', prompt: 'What time is quarter past four?', visual: '🕓 + 15 min', helper: 'Quarter past means fifteen minutes after.', options: ['4:15', '4:30', '4:45'], answer: '4:15', explanation: 'Quarter past four is 4:15.' },
    { id: 'time-half', prompt: 'What time is half past seven?', visual: '🕢', helper: 'Half past means thirty minutes after.', options: ['7:00', '7:30', '8:30'], answer: '7:30', explanation: 'Half past seven is 7:30.' },
    { id: 'shape-cube', prompt: 'Which object is shaped like a cube?', visual: '🎲 ⚽', helper: 'Think of a box with square faces.', options: ['Dice', 'Ball', 'Coin'], answer: 'Dice', explanation: 'A dice is shaped like a cube.' },
    { id: 'data-most', prompt: 'Which fruit has the most votes?', visual: '🍎: ●●●●  🍌: ●●  🍊: ●●●', helper: 'Count each row of dots.', options: ['Apples', 'Bananas', 'Oranges'], answer: 'Apples', explanation: 'Apples have four votes, the most.' },
    { id: 'data-total', prompt: 'How many votes were cast for bananas and oranges together?', visual: '🍌: ●●  🍊: ●●●', helper: 'Add two and three.', options: ['4', '5', '6'], answer: '5', explanation: 'Two plus three votes make five.' }
  ]}
]

export function getGradeThreeMathPath(id?: string) {
  return gradeThreeMathPaths.find(path => path.id === id)
}
