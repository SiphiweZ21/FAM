export type WordChoiceActivity = {
  type: 'choice'
  id: string
  prompt: string
  visual: string
  helper: string
  options: string[]
  answer: string
  explanation: string
  audioText?: string
}

export type WordBuildActivity = {
  type: 'build'
  id: string
  prompt: string
  visual: string
  helper: string
  letters: string[]
  answer: string
  explanation: string
}

export type WordActivity = WordChoiceActivity | WordBuildActivity

export type WordPath = {
  id: string
  title: string
  shortTitle: string
  emoji: string
  colour: string
  description: string
  activities: WordActivity[]
}

export const gradeOneWordPaths: WordPath[] = [
  { id: 'letters', title: 'Meet the Letters', shortTitle: 'Letters', emoji: '🔤', colour: 'blue', description: 'Recognise capital and small letters.', activities: [
    { type: 'choice', id: 'letter-a', prompt: 'Which letter is A?', visual: 'A', helper: 'Look for the same shape as the big letter.', options: ['A', 'E', 'O'], answer: 'A', explanation: 'This is the letter A.' },
    { type: 'choice', id: 'letter-b-small', prompt: 'Find the small letter b.', visual: 'B → ?', helper: 'Capital B and small b belong together.', options: ['d', 'b', 'p'], answer: 'b', explanation: 'The small letter for B is b.' },
    { type: 'choice', id: 'letter-a-small', prompt: 'Find the small letter a.', visual: 'A → ?', helper: 'Capital A matches small a.', options: ['a', 'o', 'e'], answer: 'a', explanation: 'A and a are the same letter.' },
    { type: 'choice', id: 'letter-d-small', prompt: 'Find the small letter d.', visual: 'D → ?', helper: 'Look for the letter with the round part on the left.', options: ['b', 'd', 'p'], answer: 'd', explanation: 'D and d belong together.' },
    { type: 'choice', id: 'letter-m', prompt: 'Which letter is M?', visual: 'M', helper: 'Match the big letter.', options: ['N', 'M', 'W'], answer: 'M', explanation: 'This is the capital letter M.' }
  ]},
  { id: 'sounds', title: 'Letter Sounds', shortTitle: 'Sounds', emoji: '👂', colour: 'purple', description: 'Hear a sound and connect it to a letter.', activities: [
    { type: 'choice', id: 'sound-s', prompt: 'Which letter starts sun?', visual: '☀️ SUN', helper: 'Say sun slowly: sss-un.', options: ['S', 'M', 'T'], answer: 'S', explanation: 'Sun begins with the S sound.' },
    { type: 'choice', id: 'sound-m', prompt: 'Which letter starts moon?', visual: '🌙 MOON', helper: 'Say moon slowly: mmm-oon.', options: ['N', 'M', 'B'], answer: 'M', explanation: 'Moon begins with the M sound.' },
    { type: 'choice', id: 'sound-b', prompt: 'Which letter starts ball?', visual: '⚽ BALL', helper: 'Say ball slowly: b-all.', options: ['B', 'D', 'P'], answer: 'B', explanation: 'Ball starts with the B sound.' },
    { type: 'choice', id: 'sound-t', prompt: 'Which letter starts tree?', visual: '🌳 TREE', helper: 'Say tree slowly: t-ree.', options: ['T', 'S', 'M'], answer: 'T', explanation: 'Tree starts with the T sound.' },
    { type: 'choice', id: 'sound-c', prompt: 'Which letter starts cat?', visual: '🐈 CAT', helper: 'Say cat slowly: c-at.', options: ['C', 'S', 'B'], answer: 'C', explanation: 'Cat starts with the C sound.' }
  ]},
  { id: 'picture-words', title: 'Picture & Word Match', shortTitle: 'Picture Match', emoji: '🖼️', colour: 'mint', description: 'Choose the word that names the picture.', activities: [
    { type: 'choice', id: 'picture-cat', prompt: 'Which word matches this picture?', visual: '🐈', helper: 'The animal says meow.', options: ['dog', 'cat', 'sun'], answer: 'cat', explanation: 'The picture shows a cat.' },
    { type: 'choice', id: 'picture-tree', prompt: 'Choose the correct word.', visual: '🌳', helper: 'It has a trunk, branches and leaves.', options: ['tree', 'car', 'fish'], answer: 'tree', explanation: 'The picture shows a tree.' },
    { type: 'choice', id: 'picture-sun', prompt: 'Choose the word for the picture.', visual: '☀️', helper: 'We see it in the sky during the day.', options: ['sun', 'bun', 'run'], answer: 'sun', explanation: 'The picture shows the sun.' },
    { type: 'choice', id: 'picture-fish', prompt: 'Which word names this animal?', visual: '🐟', helper: 'It swims in water.', options: ['dish', 'fish', 'wish'], answer: 'fish', explanation: 'The picture shows a fish.' },
    { type: 'choice', id: 'picture-bus', prompt: 'Choose the matching word.', visual: '🚌', helper: 'People ride in it.', options: ['bus', 'bug', 'bat'], answer: 'bus', explanation: 'The picture shows a bus.' }
  ]},
  { id: 'action-words', title: 'Action Words', shortTitle: 'Actions', emoji: '🏃', colour: 'orange', description: 'See an action and choose the correct verb.', activities: [
    { type: 'choice', id: 'action-run', prompt: 'What is the child doing?', visual: '🏃‍♀️', helper: 'Her feet are moving quickly.', options: ['sleep', 'run', 'eat'], answer: 'run', explanation: 'The child is running. Run is an action word.' },
    { type: 'choice', id: 'action-jump', prompt: 'Choose the action word.', visual: '🤾', helper: 'The person moves up from the ground.', options: ['sit', 'read', 'jump'], answer: 'jump', explanation: 'The action word is jump.' },
    { type: 'choice', id: 'action-eat', prompt: 'What is the child doing?', visual: '👧 🍎', helper: 'She has food.', options: ['eat', 'sleep', 'jump'], answer: 'eat', explanation: 'The child eats an apple.' },
    { type: 'choice', id: 'action-sleep', prompt: 'Which action matches the picture?', visual: '😴 🛏️', helper: 'The person is resting in bed.', options: ['run', 'sleep', 'read'], answer: 'sleep', explanation: 'The person is sleeping.' },
    { type: 'choice', id: 'action-swim', prompt: 'What is the person doing?', visual: '🏊', helper: 'They move through water.', options: ['swim', 'walk', 'sit'], answer: 'swim', explanation: 'The person is swimming.' }
  ]},
  { id: 'build-words', title: 'Build a Word', shortTitle: 'Word Builder', emoji: '🧩', colour: 'pink', description: 'Put letter blocks together to make a word.', activities: [
    { type: 'build', id: 'build-cat', prompt: 'Build the word CAT.', visual: '🐈', helper: 'Start with C, then A, then T.', letters: ['T', 'C', 'A'], answer: 'CAT', explanation: 'C, A and T make CAT.' },
    { type: 'build', id: 'build-sun', prompt: 'Build the word SUN.', visual: '☀️', helper: 'Listen for the sounds: S, U, N.', letters: ['N', 'U', 'S'], answer: 'SUN', explanation: 'S, U and N make SUN.' },
    { type: 'build', id: 'build-dog', prompt: 'Build the word DOG.', visual: '🐕', helper: 'Listen for D, O, G.', letters: ['G', 'D', 'O'], answer: 'DOG', explanation: 'D, O and G make DOG.' },
    { type: 'build', id: 'build-bus', prompt: 'Build the word BUS.', visual: '🚌', helper: 'Listen for B, U, S.', letters: ['S', 'B', 'U'], answer: 'BUS', explanation: 'B, U and S make BUS.' },
    { type: 'build', id: 'build-pen', prompt: 'Build the word PEN.', visual: '🖊️', helper: 'Listen for P, E, N.', letters: ['N', 'P', 'E'], answer: 'PEN', explanation: 'P, E and N make PEN.' }
  ]},
  { id: 'sentences', title: 'Read a Sentence', shortTitle: 'Sentences', emoji: '💬', colour: 'gold', description: 'Read and choose a sentence that matches the picture.', activities: [
    { type: 'choice', id: 'sentence-dog', prompt: 'Which sentence matches the picture?', visual: '🐕 🏃', helper: 'Look at the animal and its action.', options: ['The dog runs.', 'The cat sleeps.', 'The bird flies.'], answer: 'The dog runs.', explanation: 'The picture shows a dog running.' },
    { type: 'choice', id: 'sentence-girl', prompt: 'Choose the matching sentence.', visual: '👧 📖', helper: 'What is the girl holding and doing?', options: ['The girl reads.', 'The girl jumps.', 'The girl eats.'], answer: 'The girl reads.', explanation: 'The girl is reading a book.' },
    { type: 'choice', id: 'sentence-bird', prompt: 'Which sentence matches the picture?', visual: '🐦 🌳', helper: 'Look at the bird and tree.', options: ['The bird is in the tree.', 'The fish is in the tree.', 'The dog is in the tree.'], answer: 'The bird is in the tree.', explanation: 'The bird is in the tree.' },
    { type: 'choice', id: 'sentence-boy', prompt: 'Choose the matching sentence.', visual: '👦 ⚽', helper: 'Look at what the boy has.', options: ['The boy has a ball.', 'The boy has a book.', 'The boy has a cat.'], answer: 'The boy has a ball.', explanation: 'The boy has a ball.' },
    { type: 'choice', id: 'sentence-sun', prompt: 'Which sentence matches the picture?', visual: '☀️ 🌼', helper: 'Look at the sky and flower.', options: ['The sun shines on the flower.', 'The moon shines on the flower.', 'The rain falls on the flower.'], answer: 'The sun shines on the flower.', explanation: 'The sun shines on the flower.' }
  ]},
  { id: 'listening', title: 'Listen & Understand', shortTitle: 'Listening', emoji: '🎧', colour: 'purple', description: 'Listen to a short story and answer a question.', activities: [
    { type: 'choice', id: 'listen-dog', prompt: 'Listen to the story. What does the dog find?', visual: '🐕 ⚽', helper: 'Tap Read story to hear it again.', audioText: 'Ben has a dog called Max. Max runs in the garden and finds a ball.', options: ['A ball', 'A book', 'An apple'], answer: 'A ball', explanation: 'Max finds a ball.' },
    { type: 'choice', id: 'listen-rain', prompt: 'Listen to the story. What does Mia take?', visual: '👧 ☔', helper: 'Tap Read story to hear it again.', audioText: 'It starts to rain. Mia takes her umbrella before she goes outside.', options: ['A hat', 'An umbrella', 'A bag'], answer: 'An umbrella', explanation: 'Mia takes her umbrella.' },
    { type: 'choice', id: 'listen-cat', prompt: 'Listen to the story. Where is the cat?', visual: '🐈 🪑', helper: 'Tap Read story to hear it again.', audioText: 'The cat is sleeping under the chair. Sam looks for the cat.', options: ['Under the chair', 'In the tree', 'On the bed'], answer: 'Under the chair', explanation: 'The cat is under the chair.' },
    { type: 'choice', id: 'listen-lunch', prompt: 'Listen to the story. What does Lindi eat?', visual: '👧 🍎', helper: 'Tap Read story to hear it again.', audioText: 'Lindi is hungry. She washes an apple and eats it for lunch.', options: ['An apple', 'A banana', 'A sandwich'], answer: 'An apple', explanation: 'Lindi eats an apple.' },
    { type: 'choice', id: 'listen-bird', prompt: 'Listen to the story. What colour is the bird?', visual: '🐦 🌳', helper: 'Tap Read story to hear it again.', audioText: 'A little blue bird sits in the tree. It sings to its friends.', options: ['Red', 'Blue', 'Yellow'], answer: 'Blue', explanation: 'The bird is blue.' }
  ]}
]

export function getGradeOneWordPath(pathId?: string) {
  return gradeOneWordPaths.find(path => path.id === pathId)
}
