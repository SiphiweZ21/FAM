import type { WordPath } from './grade-one-words'

// Grade 3 English Home Language starter activities. Teacher review sets progression.
export const gradeThreeWordPaths: WordPath[] = [
  { id: 'sounds-and-spelling', title: 'Sounds & Spelling', shortTitle: 'Spelling', emoji: '🔤', colour: 'purple', description: 'Notice letter patterns in familiar words.', activities: [
    { type: 'choice', id: 'spell-rain', prompt: 'Which word has the same vowel sound as rain?', visual: '🌧️', helper: 'Say rain and the options aloud.', options: ['train', 'run', 'red'], answer: 'train', explanation: 'Rain and train share the ai sound.' },
    { type: 'choice', id: 'spell-light', prompt: 'Which word has the same igh spelling as light?', visual: '💡', helper: 'Look inside each word.', options: ['night', 'net', 'lit'], answer: 'night', explanation: 'Light and night both have igh.' },
    { type: 'choice', id: 'spell-boat', prompt: 'Which word has the same oa spelling as boat?', visual: '🚣', helper: 'Find the two letters together.', options: ['coat', 'bat', 'boot'], answer: 'coat', explanation: 'Boat and coat both contain oa.' },
    { type: 'choice', id: 'spell-shop', prompt: 'Which word begins with the same sound as shop?', visual: '🏬', helper: 'Listen for sh.', options: ['shell', 'sock', 'chair'], answer: 'shell', explanation: 'Shop and shell start with sh.' },
    { type: 'choice', id: 'spell-tree', prompt: 'Which word begins with the same blend as tree?', visual: '🌳', helper: 'Listen for tr.', options: ['train', 'rain', 'chair'], answer: 'train', explanation: 'Tree and train start with tr.' }
  ]},
  { id: 'word-meanings', title: 'Word Meanings', shortTitle: 'Meaning', emoji: '📖', colour: 'mint', description: 'Choose words that fit a picture or meaning.', activities: [
    { type: 'choice', id: 'meaning-tiny', prompt: 'Which word means very small?', visual: '🐜', helper: 'Think about the ant.', options: ['tiny', 'huge', 'wide'], answer: 'tiny', explanation: 'Tiny means very small.' },
    { type: 'choice', id: 'meaning-quiet', prompt: 'Which word is the opposite of noisy?', visual: '🤫', helper: 'Think of a calm room.', options: ['quiet', 'loud', 'busy'], answer: 'quiet', explanation: 'Quiet is the opposite of noisy.' },
    { type: 'choice', id: 'meaning-quick', prompt: 'Which word is closest in meaning to fast?', visual: '🏃', helper: 'Think of speed.', options: ['quick', 'slow', 'still'], answer: 'quick', explanation: 'Quick and fast have similar meanings.' },
    { type: 'choice', id: 'meaning-cautious', prompt: 'Which word means being careful?', visual: '🚶 ⚠️', helper: 'Think about crossing safely.', options: ['cautious', 'careless', 'noisy'], answer: 'cautious', explanation: 'Cautious means careful.' },
    { type: 'choice', id: 'meaning-collect', prompt: 'Which word means to gather things?', visual: '🧺 🍎', helper: 'Put the apples together.', options: ['collect', 'scatter', 'forget'], answer: 'collect', explanation: 'Collect means to gather things.' }
  ]},
  { id: 'build-words', title: 'Build a Word', shortTitle: 'Builder', emoji: '🧩', colour: 'pink', description: 'Order letter tiles to spell longer words.', activities: [
    { type: 'build', id: 'build-plant', prompt: 'Build the word PLANT.', visual: '🌱', helper: 'Start with P and L.', letters: ['T', 'A', 'P', 'N', 'L'], answer: 'PLANT', explanation: 'P, L, A, N, T makes PLANT.' },
    { type: 'build', id: 'build-cloud', prompt: 'Build the word CLOUD.', visual: '☁️', helper: 'Start with C and L.', letters: ['D', 'O', 'C', 'U', 'L'], answer: 'CLOUD', explanation: 'C, L, O, U, D makes CLOUD.' },
    { type: 'build', id: 'build-train', prompt: 'Build the word TRAIN.', visual: '🚆', helper: 'Start with T and R.', letters: ['N', 'I', 'T', 'A', 'R'], answer: 'TRAIN', explanation: 'T, R, A, I, N makes TRAIN.' },
    { type: 'build', id: 'build-smile', prompt: 'Build the word SMILE.', visual: '😊', helper: 'Start with S and M.', letters: ['E', 'I', 'S', 'L', 'M'], answer: 'SMILE', explanation: 'S, M, I, L, E makes SMILE.' },
    { type: 'build', id: 'build-brush', prompt: 'Build the word BRUSH.', visual: '🖌️', helper: 'Start with B and R.', letters: ['H', 'U', 'B', 'S', 'R'], answer: 'BRUSH', explanation: 'B, R, U, S, H makes BRUSH.' }
  ]},
  { id: 'sentences-and-punctuation', title: 'Sentences & Punctuation', shortTitle: 'Sentences', emoji: '✍️', colour: 'gold', description: 'Choose clear sentences and correct punctuation.', activities: [
    { type: 'choice', id: 'sentence-full-stop', prompt: 'Which sentence ends with a full stop?', visual: '🐕 💤', helper: 'It tells us something.', options: ['The dog sleeps.', 'The dog sleeps?', 'The dog sleeps,'], answer: 'The dog sleeps.', explanation: 'A telling sentence can end with a full stop.' },
    { type: 'choice', id: 'sentence-question', prompt: 'Which sentence asks a question?', visual: '🍎 ❓', helper: 'Look for a question mark.', options: ['Where is the apple?', 'The apple is red.', 'Eat the apple.'], answer: 'Where is the apple?', explanation: 'Where is the apple? asks a question.' },
    { type: 'choice', id: 'sentence-capital', prompt: 'Which sentence starts with a capital letter?', visual: '🌞', helper: 'Check the first letter.', options: ['The sun shines.', 'the sun shines.', 'sun the shines.'], answer: 'The sun shines.', explanation: 'The sentence starts with a capital T.' },
    { type: 'choice', id: 'sentence-order', prompt: 'Which words make a clear sentence?', visual: '🐦 🌳', helper: 'Who is doing something?', options: ['The bird sits in the tree.', 'Tree the bird in sits.', 'Sits bird tree the.'], answer: 'The bird sits in the tree.', explanation: 'The words are in an order that makes sense.' },
    { type: 'choice', id: 'sentence-exclaim', prompt: 'Which sentence shows excitement?', visual: '🎉', helper: 'Look for an exclamation mark.', options: ['We won the game!', 'We won the game?', 'We won the game,'], answer: 'We won the game!', explanation: 'An exclamation mark shows strong feeling.' }
  ]},
  { id: 'stories-and-questions', title: 'Stories & Questions', shortTitle: 'Stories', emoji: '📚', colour: 'blue', description: 'Read or hear a short story, then answer.', activities: [
    { type: 'choice', id: 'story-garden', prompt: 'What did the children plant?', visual: '🌱', helper: 'Read or hear the story again.', audioText: 'Lebo and Sam made a small garden. They planted bean seeds and watered them every morning.', options: ['Bean seeds', 'Trees', 'Flowers'], answer: 'Bean seeds', explanation: 'They planted bean seeds.' },
    { type: 'choice', id: 'story-library', prompt: 'Where did Ayo find the book?', visual: '📚', helper: 'Read or hear the story again.', audioText: 'Ayo visited the library after school. She found a book about planets on the top shelf.', options: ['At the library', 'At the park', 'On a bus'], answer: 'At the library', explanation: 'Ayo found the book at the library.' },
    { type: 'choice', id: 'story-puppy', prompt: 'Why did the puppy hide?', visual: '🐕 ⛈️', helper: 'Read or hear the story again.', audioText: 'Thunder rumbled outside. The puppy felt frightened and hid under a chair. Maya sat nearby until it felt calm.', options: ['It was frightened by thunder', 'It wanted food', 'It was playing fetch'], answer: 'It was frightened by thunder', explanation: 'The thunder frightened the puppy.' },
    { type: 'choice', id: 'story-kite', prompt: 'What happened before Musa flew the kite?', visual: '🪁', helper: 'Think about the order of events.', audioText: 'Musa made a kite from paper. He tied a string to it. Then he flew it in the park.', options: ['He tied a string to it', 'He went to sleep', 'He bought a ball'], answer: 'He tied a string to it', explanation: 'He tied on the string before flying the kite.' },
    { type: 'choice', id: 'story-help', prompt: 'How did Nia help her friend?', visual: '🤝 📚', helper: 'Read or hear the story again.', audioText: 'Ben dropped his books on the way to class. Nia stopped and helped him pick them up.', options: ['She picked up his books', 'She hid his books', 'She ran away'], answer: 'She picked up his books', explanation: 'Nia helped Ben pick up the books.' }
  ]}
]

export function getGradeThreeWordPath(id?: string) {
  return gradeThreeWordPaths.find(path => path.id === id)
}
