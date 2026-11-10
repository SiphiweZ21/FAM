export type GradeOneChoiceActivity = {
  id: string
  prompt: string
  visual: string
  helper: string
  options: string[]
  answer: string
  explanation: string
  countItems?: string[]
}

export type GradeOneTopic = {
  id: string
  title: string
  shortTitle: string
  emoji: string
  colour: string
  description: string
  activities: GradeOneChoiceActivity[]
}

export const gradeOneTopics: GradeOneTopic[] = [
  {
    id: 'counting', title: 'Counting Objects', shortTitle: 'Counting', emoji: '🔢', colour: 'mint', description: 'Touch, count and choose the matching number.',
    activities: [
      { id: 'count-stars', prompt: 'How many stars can you see?', visual: '⭐ ⭐ ⭐ ⭐ ⭐', helper: 'Touch each star and count slowly.', options: ['4', '5', '6'], answer: '5', explanation: 'There are 5 stars. We count: 1, 2, 3, 4, 5.', countItems: ['⭐', '⭐', '⭐', '⭐', '⭐'] },
      { id: 'count-lions', prompt: 'How many lions are together?', visual: '🦁 🦁 🦁', helper: 'Touch every lion once.', options: ['2', '3', '4'], answer: '3', explanation: 'There are 3 lions.', countItems: ['🦁', '🦁', '🦁'] },
      { id: 'count-apples', prompt: 'Count the apples.', visual: '🍎 🍎 🍎 🍎', helper: 'Touch each apple as you count.', options: ['3', '4', '5'], answer: '4', explanation: 'Four apples: 1, 2, 3, 4.', countItems: ['🍎', '🍎', '🍎', '🍎'] },
      { id: 'count-butterflies', prompt: 'How many butterflies are there?', visual: '🦋 🦋 🦋 🦋 🦋 🦋', helper: 'Count each butterfly only once.', options: ['5', '6', '7'], answer: '6', explanation: 'There are 6 butterflies.', countItems: ['🦋', '🦋', '🦋', '🦋', '🦋', '🦋'] },
      { id: 'count-zero', prompt: 'How many bananas are in the basket?', visual: '🧺', helper: 'The basket is empty.', options: ['0', '1', '2'], answer: '0', explanation: 'There are no bananas. We write zero: 0.' },
      { id: 'count-fingers', prompt: 'Count the hands. How many hands?', visual: '✋ ✋', helper: 'Touch each hand once.', options: ['1', '2', '3'], answer: '2', explanation: 'There are 2 hands.', countItems: ['✋', '✋'] },
      { id: 'count-cars', prompt: 'How many cars are here?', visual: '🚗 🚗 🚗 🚗 🚗 🚗 🚗', helper: 'Touch each car as you count.', options: ['6', '7', '8'], answer: '7', explanation: 'There are 7 cars.', countItems: Array(7).fill('🚗') },
      { id: 'count-flowers', prompt: 'How many flowers are here?', visual: '🌼 🌼 🌼 🌼 🌼 🌼 🌼 🌼', helper: 'Count the flowers one at a time.', options: ['7', '8', '9'], answer: '8', explanation: 'There are 8 flowers.', countItems: Array(8).fill('🌼') },
      { id: 'count-numbers', prompt: 'Which number matches the balls?', visual: '⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽', helper: 'Touch and count the balls.', options: ['8', '9', '10'], answer: '9', explanation: 'There are 9 balls.', countItems: Array(9).fill('⚽') },
      { id: 'count-ten', prompt: 'Count the ten stars.', visual: '⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐', helper: 'Touch each star once.', options: ['9', '10', '11'], answer: '10', explanation: 'There are 10 stars.', countItems: Array(10).fill('⭐') }
    ]
  },
  {
    id: 'comparing', title: 'Comparing Numbers', shortTitle: 'Compare', emoji: '🐊', colour: 'blue', description: 'Find which group has more, fewer or the same.',
    activities: [
      { id: 'compare-fruit', prompt: 'Which group has more fruit?', visual: '🍊 🍊 🍊 🍊   |   🍓 🍓', helper: 'Count both groups before choosing.', options: ['Oranges', 'Strawberries', 'They are equal'], answer: 'Oranges', explanation: 'Four oranges are more than two strawberries.' },
      { id: 'compare-equal', prompt: 'How do these groups compare?', visual: '⚽ ⚽ ⚽   |   🏀 🏀 🏀', helper: 'Count the balls on each side.', options: ['Left has more', 'Right has more', 'They are equal'], answer: 'They are equal', explanation: 'Each side has 3 balls, so the groups are equal.' },
      { id: 'compare-fewer', prompt: 'Which group has fewer animals?', visual: '🐘 🐘   |   🐦 🐦 🐦 🐦', helper: 'Fewer means the smaller group.', options: ['Elephants', 'Birds', 'They are equal'], answer: 'Elephants', explanation: 'Two elephants are fewer than four birds.' },
      { id: 'compare-numbers', prompt: 'Which number is bigger?', visual: '7   |   9', helper: 'Count up from seven.', options: ['7', '9', 'They are equal'], answer: '9', explanation: '9 is bigger than 7.' },
      { id: 'compare-same', prompt: 'Are the groups the same size?', visual: '🍌 🍌 🍌 🍌   |   🍎 🍎 🍎 🍎', helper: 'Count both groups.', options: ['Yes', 'No', 'Cannot tell'], answer: 'Yes', explanation: 'Both groups have four pieces of fruit.' },
      { id: 'compare-less', prompt: 'Which number is smaller?', visual: '4   |   6', helper: 'Which comes first when you count?', options: ['4', '6', 'Equal'], answer: '4', explanation: '4 is smaller than 6.' },
      { id: 'compare-zero', prompt: 'Which basket has fewer apples?', visual: 'Basket A: empty   |   Basket B: 🍎 🍎', helper: 'Empty means zero.', options: ['Basket A', 'Basket B', 'Equal'], answer: 'Basket A', explanation: 'Zero apples are fewer than two apples.' },
      { id: 'compare-ten', prompt: 'Which number is greater?', visual: '10   |   8', helper: 'Think of counting from eight to ten.', options: ['10', '8', 'Equal'], answer: '10', explanation: '10 is greater than 8.' },
      { id: 'compare-equal-numbers', prompt: 'Compare these numbers.', visual: '5   |   5', helper: 'Are the two numbers the same?', options: ['Left is greater', 'Right is greater', 'Equal'], answer: 'Equal', explanation: '5 and 5 are equal.' },
      { id: 'compare-fewer-stars', prompt: 'Which side has fewer stars?', visual: 'Left: ⭐ ⭐ ⭐   |   Right: ⭐ ⭐ ⭐ ⭐ ⭐', helper: 'Count each side.', options: ['Left', 'Right', 'Equal'], answer: 'Left', explanation: 'Three stars are fewer than five stars.' }
    ]
  },
  {
    id: 'sequences', title: 'Number Sequences', shortTitle: 'Sequences', emoji: '🚂', colour: 'purple', description: 'Complete number trains and discover what comes next.',
    activities: [
      { id: 'sequence-one', prompt: 'Which number comes next?', visual: '1 → 2 → 3 → 4 → ?', helper: 'The numbers grow by one each time.', options: ['3', '5', '6'], answer: '5', explanation: 'After 4 comes 5.' },
      { id: 'sequence-two', prompt: 'Complete the number train.', visual: '2 → 4 → 6 → ?', helper: 'Count forward in twos.', options: ['7', '8', '10'], answer: '8', explanation: 'We count 2, 4, 6, 8.' },
      { id: 'sequence-missing', prompt: 'Which number is missing?', visual: '5 → 6 → ? → 8', helper: 'Count forward from five.', options: ['6', '7', '9'], answer: '7', explanation: '5, 6, 7, 8. The missing number is 7.' },
      { id: 'sequence-back', prompt: 'Count backwards. What comes next?', visual: '5 → 4 → 3 → ?', helper: 'Take one away each time.', options: ['1', '2', '4'], answer: '2', explanation: 'After 3, counting backwards, comes 2.' },
      { id: 'sequence-tens', prompt: 'What comes after 20?', visual: '10 → 20 → ?', helper: 'Count in tens.', options: ['21', '30', '40'], answer: '30', explanation: '10, 20, 30. We add ten each time.' },
      { id: 'sequence-zero', prompt: 'What number comes after zero?', visual: '0 → ?', helper: 'Start counting at zero.', options: ['1', '2', '10'], answer: '1', explanation: 'One comes after zero.' },
      { id: 'sequence-before', prompt: 'What comes before 5?', visual: '? → 5 → 6', helper: 'Count backwards from five.', options: ['3', '4', '7'], answer: '4', explanation: '4 comes before 5.' },
      { id: 'sequence-threes', prompt: 'Complete the pattern.', visual: '3 → 6 → 9 → ?', helper: 'Count three more each time.', options: ['10', '11', '12'], answer: '12', explanation: '3, 6, 9, 12. We count in threes.' },
      { id: 'sequence-fives', prompt: 'Count in fives. What comes next?', visual: '5 → 10 → 15 → ?', helper: 'Add five after fifteen.', options: ['16', '20', '25'], answer: '20', explanation: '5, 10, 15, 20.' },
      { id: 'sequence-back-ten', prompt: 'Count backwards. Which number is missing?', visual: '10 → 9 → ? → 7', helper: 'Take away one at each step.', options: ['6', '8', '11'], answer: '8', explanation: '10, 9, 8, 7.' }
    ]
  },
  {
    id: 'shapes-patterns', title: 'Shapes & Patterns', shortTitle: 'Patterns', emoji: '🔺', colour: 'pink', description: 'Recognise shapes and finish colourful patterns.',
    activities: [
      { id: 'shape-triangle', prompt: 'Which shape has 3 sides?', visual: '○   △   □', helper: 'Trace the sides with your finger.', options: ['Circle', 'Triangle', 'Square'], answer: 'Triangle', explanation: 'A triangle has 3 straight sides.' },
      { id: 'pattern-colour', prompt: 'What comes next in the pattern?', visual: '🔴 🔵 🔴 🔵 ?', helper: 'The colours take turns.', options: ['🔴', '🔵', '🟢'], answer: '🔴', explanation: 'The pattern repeats red, blue, red, blue, so red comes next.' },
      { id: 'shape-square', prompt: 'Which shape has four equal sides?', visual: '△   □   ○', helper: 'Look for four sides of the same length.', options: ['Triangle', 'Square', 'Circle'], answer: 'Square', explanation: 'A square has four equal sides.' },
      { id: 'pattern-shapes', prompt: 'Which shape comes next?', visual: '🔺 🟦 🔺 🟦 ?', helper: 'Triangle, square, triangle, square.', options: ['🔺', '🟦', '⚪'], answer: '🔺', explanation: 'The repeating pattern starts again with a triangle.' },
      { id: 'shape-circle', prompt: 'Which shape has no straight sides?', visual: '□   ○   △', helper: 'Trace each edge.', options: ['Square', 'Circle', 'Triangle'], answer: 'Circle', explanation: 'A circle has a curved edge and no straight sides.' },
      { id: 'shape-rectangle', prompt: 'Which shape looks like a door?', visual: '○   ▭   △', helper: 'Look for a shape with four straight sides.', options: ['Circle', 'Rectangle', 'Triangle'], answer: 'Rectangle', explanation: 'A door often has a rectangular shape.' },
      { id: 'pattern-three', prompt: 'What comes next?', visual: '🔴 🔴 🔵 🔴 🔴 🔵 ?', helper: 'Look for two red circles, then one blue circle.', options: ['🔴', '🔵', '🟢'], answer: '🔴', explanation: 'The repeating group starts again with red.' },
      { id: 'shape-sides', prompt: 'How many sides does a square have?', visual: '□', helper: 'Trace each straight side.', options: ['3', '4', '5'], answer: '4', explanation: 'A square has four straight sides.' },
      { id: 'pattern-objects', prompt: 'Which picture completes the pattern?', visual: '🍎 🍌 🍎 🍌 ?', helper: 'The fruits take turns.', options: ['🍎', '🍌', '🍊'], answer: '🍎', explanation: 'Apple, banana repeats, so apple comes next.' },
      { id: 'shape-corners', prompt: 'Which shape has no corners?', visual: '△   ○   □', helper: 'A corner is where straight sides meet.', options: ['Triangle', 'Circle', 'Square'], answer: 'Circle', explanation: 'A circle has no corners.' }
    ]
  },
  {
    id: 'money', title: 'South African Money', shortTitle: 'Money', emoji: '🪙', colour: 'gold', description: 'Recognise coins and make simple amounts.',
    activities: [
      { id: 'money-two-rand', prompt: 'How much money is shown?', visual: 'R1 + R1', helper: 'Add one rand and one rand.', options: ['R1', 'R2', 'R3'], answer: 'R2', explanation: 'R1 plus R1 makes R2.' },
      { id: 'money-five-rand', prompt: 'Which amount can buy a R5 snack?', visual: '🥪  Price: R5', helper: 'Choose the amount that matches the price.', options: ['R2', 'R4', 'R5'], answer: 'R5', explanation: 'The snack costs R5, so we need R5.' },
      { id: 'money-three-rand', prompt: 'How much is R2 plus R1?', visual: 'R2 + R1', helper: 'Count one more after two.', options: ['R2', 'R3', 'R4'], answer: 'R3', explanation: 'R2 plus R1 equals R3.' },
      { id: 'money-four-rand', prompt: 'Which two amounts make R4?', visual: 'R4 = ? + ?', helper: 'Try adding the two amounts.', options: ['R2 + R2', 'R1 + R2', 'R1 + R1'], answer: 'R2 + R2', explanation: 'R2 plus R2 equals R4.' },
      { id: 'money-change', prompt: 'You have R5. A fruit costs R3. How much is left?', visual: 'R5 − R3 = ?', helper: 'Count back three from five.', options: ['R1', 'R2', 'R3'], answer: 'R2', explanation: 'R5 minus R3 leaves R2.' },
      { id: 'money-one-coin', prompt: 'Which coin matches this amount?', visual: 'R1', helper: 'Look at the value written on the coin.', options: ['R1', 'R2', 'R5'], answer: 'R1', explanation: 'The amount is one rand.' },
      { id: 'money-two-coins', prompt: 'How much do two R2 coins make?', visual: 'R2 + R2', helper: 'Count two, then two more.', options: ['R2', 'R4', 'R5'], answer: 'R4', explanation: 'Two rand plus two rand makes four rand.' },
      { id: 'money-enough', prompt: 'A pencil costs R4. Is R5 enough?', visual: '✏️ R4   |   You have R5', helper: 'Compare five rand with four rand.', options: ['Yes', 'No', 'Equal'], answer: 'Yes', explanation: 'R5 is more than R4, so it is enough.' },
      { id: 'money-three-coins', prompt: 'How much do three R1 coins make?', visual: 'R1 + R1 + R1', helper: 'Count one, two, three.', options: ['R2', 'R3', 'R4'], answer: 'R3', explanation: 'Three one-rand coins make R3.' },
      { id: 'money-ten', prompt: 'How much is R5 plus R5?', visual: 'R5 + R5', helper: 'Count five more after five.', options: ['R8', 'R10', 'R15'], answer: 'R10', explanation: 'R5 plus R5 makes R10.' }
    ]
  },
  {
    id: 'time-measurement', title: 'Time & Measurement', shortTitle: 'Time & Measure', emoji: '⏰', colour: 'orange', description: 'Read simple times and compare size and length.',
    activities: [
      { id: 'time-three', prompt: 'What time does the clock show?', visual: '🕒', helper: 'The short hand points to 3 and the long hand points to 12.', options: ['2 o’clock', '3 o’clock', '6 o’clock'], answer: '3 o’clock', explanation: 'The clock shows 3 o’clock.' },
      { id: 'measure-longer', prompt: 'Which object is usually longer?', visual: '✏️   |   🚌', helper: 'Imagine the real size of each object.', options: ['Pencil', 'Bus', 'Same length'], answer: 'Bus', explanation: 'A bus is much longer than a pencil.' },
      { id: 'time-six', prompt: 'What time does this clock show?', visual: '🕕', helper: 'The short hand points to six.', options: ['3 o’clock', '6 o’clock', '9 o’clock'], answer: '6 o’clock', explanation: 'The clock shows 6 o’clock.' },
      { id: 'measure-shorter', prompt: 'Which object is usually shorter?', visual: '🖍️   |   🚂', helper: 'Think about their real sizes.', options: ['Crayon', 'Train', 'Same length'], answer: 'Crayon', explanation: 'A crayon is shorter than a train.' },
      { id: 'time-morning', prompt: 'When do we usually eat breakfast?', visual: '🌅 → 🍽️', helper: 'Think about the start of the day.', options: ['Morning', 'Afternoon', 'Night'], answer: 'Morning', explanation: 'Breakfast is usually eaten in the morning.' },
      { id: 'time-nine', prompt: 'What time does the clock show?', visual: '🕘', helper: 'The short hand points to nine.', options: ['6 o’clock', '9 o’clock', '12 o’clock'], answer: '9 o’clock', explanation: 'The clock shows 9 o’clock.' },
      { id: 'time-twelve', prompt: 'What time is shown?', visual: '🕛', helper: 'Both hands point to twelve.', options: ['3 o’clock', '6 o’clock', '12 o’clock'], answer: '12 o’clock', explanation: 'The clock shows 12 o’clock.' },
      { id: 'measure-heavier', prompt: 'Which is usually heavier?', visual: '🪨   |   🍃', helper: 'Imagine holding a rock and a leaf.', options: ['Rock', 'Leaf', 'Same weight'], answer: 'Rock', explanation: 'A rock is usually heavier than a leaf.' },
      { id: 'measure-taller', prompt: 'Which is usually taller?', visual: '🌳   |   🌷', helper: 'Think about the real objects.', options: ['Tree', 'Flower', 'Same height'], answer: 'Tree', explanation: 'A tree is usually taller than a flower.' },
      { id: 'time-night', prompt: 'When can we usually see the moon?', visual: '🌙 ⭐', helper: 'Think about when the sky is dark.', options: ['Morning', 'Afternoon', 'Night'], answer: 'Night', explanation: 'We usually see the moon at night, though it can sometimes be seen during the day.' }
    ]
  }
]

export function getGradeOneTopic(topicId?: string) {
  return gradeOneTopics.find(topic => topic.id === topicId)
}
