export type ObjectMathActivity = {
  id: string
  title: string
  instruction: string
  story: string
  operation: 'addition' | 'subtraction'
  startingQuantity: number
  changeQuantity: number
  object: { singular: string; plural: string; emoji: string }
  destinationLabel: string
}

export const gradeOneNumberMission: ObjectMathActivity[] = [
  { id: 'add-apples', title: 'Add the apples', instruction: 'Move 2 apples into the basket.', story: 'Lebo has 4 apples. Her friend gives her 2 more apples. How many apples does Lebo have now?', operation: 'addition', startingQuantity: 4, changeQuantity: 2, object: { singular: 'apple', plural: 'apples', emoji: '🍎' }, destinationLabel: 'Lebo’s basket' },
  { id: 'subtract-balloons', title: 'Balloons fly away', instruction: 'Move 2 balloons out of the group.', story: 'Anele has 6 balloons. Two balloons fly away. How many balloons are left?', operation: 'subtraction', startingQuantity: 6, changeQuantity: 2, object: { singular: 'balloon', plural: 'balloons', emoji: '🎈' }, destinationLabel: 'Balloons left' },
  { id: 'add-footballs', title: 'Fill the sports bag', instruction: 'Move 3 footballs into the sports bag.', story: 'There are 3 footballs in a bag. The coach adds 3 more. How many are in the bag?', operation: 'addition', startingQuantity: 3, changeQuantity: 3, object: { singular: 'football', plural: 'footballs', emoji: '⚽' }, destinationLabel: 'Sports bag' },
  { id: 'subtract-sweets', title: 'Share the sweets', instruction: 'Give 3 sweets to a friend.', story: 'Thandi has 7 sweets. She gives 3 to her friend. How many sweets does Thandi have left?', operation: 'subtraction', startingQuantity: 7, changeQuantity: 3, object: { singular: 'sweet', plural: 'sweets', emoji: '🍬' }, destinationLabel: 'Thandi’s sweets' },
  { id: 'add-oranges', title: 'Pick more oranges', instruction: 'Move 2 oranges into the basket.', story: 'Sipho has 5 oranges. He picks 2 more. How many oranges does he have?', operation: 'addition', startingQuantity: 5, changeQuantity: 2, object: { singular: 'orange', plural: 'oranges', emoji: '🍊' }, destinationLabel: 'Sipho’s basket' },
  { id: 'subtract-birds', title: 'Birds fly away', instruction: 'Move 4 birds away.', story: 'There are 9 birds in a tree. Four fly away. How many birds stay?', operation: 'subtraction', startingQuantity: 9, changeQuantity: 4, object: { singular: 'bird', plural: 'birds', emoji: '🐦' }, destinationLabel: 'Birds in the tree' },
  { id: 'add-stars', title: 'Collect stars', instruction: 'Move 4 stars into your collection.', story: 'You have 2 stars. You earn 4 more. How many stars do you have?', operation: 'addition', startingQuantity: 2, changeQuantity: 4, object: { singular: 'star', plural: 'stars', emoji: '⭐' }, destinationLabel: 'Your stars' },
  { id: 'subtract-flowers', title: 'Give away flowers', instruction: 'Move 2 flowers away.', story: 'Lindiwe has 8 flowers. She gives 2 to her friend. How many flowers are left?', operation: 'subtraction', startingQuantity: 8, changeQuantity: 2, object: { singular: 'flower', plural: 'flowers', emoji: '🌼' }, destinationLabel: 'Flowers left' },
  { id: 'add-pencils', title: 'Fill the pencil box', instruction: 'Move 5 pencils into the box.', story: 'The box has 4 pencils. Add 5 more. How many pencils are in the box?', operation: 'addition', startingQuantity: 4, changeQuantity: 5, object: { singular: 'pencil', plural: 'pencils', emoji: '✏️' }, destinationLabel: 'Pencil box' },
  { id: 'subtract-cookies', title: 'Share the biscuits', instruction: 'Move 3 biscuits away.', story: 'There are 10 biscuits. You share 3. How many biscuits remain?', operation: 'subtraction', startingQuantity: 10, changeQuantity: 3, object: { singular: 'biscuit', plural: 'biscuits', emoji: '🍪' }, destinationLabel: 'Biscuits left' }
]

export function activityAnswer(activity: ObjectMathActivity) {
  return activity.operation === 'addition'
    ? activity.startingQuantity + activity.changeQuantity
    : activity.startingQuantity - activity.changeQuantity
}

export function answerChoices(activity: ObjectMathActivity): number[] {
  const answer = activityAnswer(activity)
  const choices = [Math.max(0, answer - 1), answer, answer + 1]
  return activity.operation === 'addition' ? choices : [...choices].reverse()
}
