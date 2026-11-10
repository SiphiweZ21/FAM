import type { WordPath } from './grade-one-words'

// Grade 2 English Home Language starter activities; teacher review sets term sequence.
export const gradeTwoWordPaths: WordPath[] = [
  { id: 'sounds-and-blends', title: 'Sounds & Blends', shortTitle: 'Sounds', emoji: '👂', colour: 'purple', description: 'Listen for beginning and ending sounds.', activities: [
    { type: 'choice', id: 'blend-sh', prompt: 'Which word begins with sh?', visual: '🐚', helper: 'Say the start of shell.', options: ['shell', 'sell', 'tell'], answer: 'shell', explanation: 'Shell starts with sh.' },
    { type: 'choice', id: 'blend-ch', prompt: 'Which word begins with ch?', visual: '🪑', helper: 'Say chair slowly.', options: ['chair', 'share', 'hair'], answer: 'chair', explanation: 'Chair starts with ch.' },
    { type: 'choice', id: 'blend-th', prompt: 'Which word begins with th?', visual: '👍', helper: 'Say thumb slowly.', options: ['thumb', 'tub', 'drum'], answer: 'thumb', explanation: 'Thumb starts with th.' },
    { type: 'choice', id: 'blend-st', prompt: 'Which word begins with st?', visual: '⭐', helper: 'Say star slowly.', options: ['star', 'tar', 'car'], answer: 'star', explanation: 'Star starts with st.' },
    { type: 'choice', id: 'ending-ng', prompt: 'Which word ends with ng?', visual: '🎵', helper: 'Say sing slowly.', options: ['sing', 'sit', 'sip'], answer: 'sing', explanation: 'Sing ends with ng.' }
  ]},
  { id: 'picture-vocabulary', title: 'Picture Vocabulary', shortTitle: 'Words', emoji: '🖼️', colour: 'mint', description: 'Match pictures and descriptive words.', activities: [
    { type: 'choice', id: 'vocab-tall', prompt: 'Which word describes the tree?', visual: '🌳 ↑', helper: 'The tree reaches high.', options: ['tall', 'tiny', 'short'], answer: 'tall', explanation: 'The tree is tall.' },
    { type: 'choice', id: 'vocab-wet', prompt: 'How might your shoes feel in the rain?', visual: '🌧️ 👟', helper: 'Rain has water.', options: ['wet', 'dry', 'hot'], answer: 'wet', explanation: 'Rain can make shoes wet.' },
    { type: 'choice', id: 'vocab-fast', prompt: 'Which word describes a running cheetah?', visual: '🐆 💨', helper: 'It moves quickly.', options: ['fast', 'still', 'slow'], answer: 'fast', explanation: 'A running cheetah can be fast.' },
    { type: 'choice', id: 'vocab-empty', prompt: 'Which word describes this basket?', visual: '🧺', helper: 'There is nothing inside.', options: ['empty', 'full', 'heavy'], answer: 'empty', explanation: 'The basket is empty.' },
    { type: 'choice', id: 'vocab-cold', prompt: 'Which word describes ice?', visual: '🧊', helper: 'Think about how ice feels.', options: ['cold', 'warm', 'soft'], answer: 'cold', explanation: 'Ice feels cold.' }
  ]},
  { id: 'build-words', title: 'Build Longer Words', shortTitle: 'Builder', emoji: '🧩', colour: 'pink', description: 'Put letter tiles in order.', activities: [
    { type: 'build', id: 'build-frog', prompt: 'Build the word FROG.', visual: '🐸', helper: 'Listen for F, R, O, G.', letters: ['O', 'G', 'F', 'R'], answer: 'FROG', explanation: 'F, R, O, G makes FROG.' },
    { type: 'build', id: 'build-star', prompt: 'Build the word STAR.', visual: '⭐', helper: 'Start with S and T.', letters: ['R', 'A', 'S', 'T'], answer: 'STAR', explanation: 'S, T, A, R makes STAR.' },
    { type: 'build', id: 'build-fish', prompt: 'Build the word FISH.', visual: '🐟', helper: 'Start with F.', letters: ['H', 'I', 'F', 'S'], answer: 'FISH', explanation: 'F, I, S, H makes FISH.' },
    { type: 'build', id: 'build-bird', prompt: 'Build the word BIRD.', visual: '🐦', helper: 'Start with B.', letters: ['D', 'I', 'R', 'B'], answer: 'BIRD', explanation: 'B, I, R, D makes BIRD.' },
    { type: 'build', id: 'build-rain', prompt: 'Build the word RAIN.', visual: '🌧️', helper: 'Start with R.', letters: ['N', 'A', 'R', 'I'], answer: 'RAIN', explanation: 'R, A, I, N makes RAIN.' }
  ]},
  { id: 'read-sentences', title: 'Read a Sentence', shortTitle: 'Sentences', emoji: '💬', colour: 'gold', description: 'Read and choose a sentence that fits.', activities: [
    { type: 'choice', id: 'sentence-rain', prompt: 'Which sentence fits the picture?', visual: '🌧️ ☔', helper: 'Look at the rain and umbrella.', options: ['It is raining, so I use an umbrella.', 'It is sunny, so I use an umbrella.', 'The cat is sleeping.'], answer: 'It is raining, so I use an umbrella.', explanation: 'The umbrella helps in the rain.' },
    { type: 'choice', id: 'sentence-frog', prompt: 'Which sentence fits the picture?', visual: '🐸 💧', helper: 'Look at the frog and water.', options: ['The frog sits near the water.', 'The bird sits near the water.', 'The frog flies over a house.'], answer: 'The frog sits near the water.', explanation: 'The picture shows a frog near water.' },
    { type: 'choice', id: 'sentence-girl', prompt: 'Which sentence fits the picture?', visual: '👧 📚', helper: 'Think about the books.', options: ['The girl reads books.', 'The girl kicks a ball.', 'The girl eats lunch.'], answer: 'The girl reads books.', explanation: 'The girl has books to read.' },
    { type: 'choice', id: 'sentence-bus', prompt: 'Which sentence fits the picture?', visual: '🚌 🧒', helper: 'Look at the bus.', options: ['The child waits for the bus.', 'The child rides a horse.', 'The child swims.'], answer: 'The child waits for the bus.', explanation: 'The child and bus are shown.' },
    { type: 'choice', id: 'sentence-plant', prompt: 'Which sentence fits the picture?', visual: '🌱 💧', helper: 'Think about water and plants.', options: ['I water the small plant.', 'I paint the small plant.', 'I eat the small plant.'], answer: 'I water the small plant.', explanation: 'Water helps the small plant grow.' }
  ]},
  { id: 'listen-and-understand', title: 'Listen & Understand', shortTitle: 'Stories', emoji: '🎧', colour: 'blue', description: 'Hear a short story and answer a question.', activities: [
    { type: 'choice', id: 'story-seed', prompt: 'Listen. What does Kavi plant?', visual: '🌱', helper: 'Tap Read story to hear it again.', audioText: 'Kavi digs a small hole in the garden. He plants a seed and gives it water.', options: ['A seed', 'A stone', 'A toy'], answer: 'A seed', explanation: 'Kavi plants a seed.' },
    { type: 'choice', id: 'story-bus', prompt: 'Listen. How does Nia travel?', visual: '🚌', helper: 'Tap Read story to hear it again.', audioText: 'Nia waits with her aunt. A bus stops and they climb on to visit the library.', options: ['By bus', 'By bicycle', 'By boat'], answer: 'By bus', explanation: 'Nia travels by bus.' },
    { type: 'choice', id: 'story-kite', prompt: 'Listen. What colour is the kite?', visual: '🪁', helper: 'Tap Read story to hear it again.', audioText: 'The wind blows gently. Musa flies his red kite in the park.', options: ['Red', 'Blue', 'Yellow'], answer: 'Red', explanation: 'Musa has a red kite.' },
    { type: 'choice', id: 'story-cat', prompt: 'Listen. Where does the cat sleep?', visual: '🐈', helper: 'Tap Read story to hear it again.', audioText: 'The cat plays with a ball. Later it sleeps on the soft mat.', options: ['On a mat', 'In a tree', 'On a bus'], answer: 'On a mat', explanation: 'The cat sleeps on the mat.' },
    { type: 'choice', id: 'story-lunch', prompt: 'Listen. Who shares an apple?', visual: '🍎', helper: 'Tap Read story to hear it again.', audioText: 'Sana brings two apples for lunch. She gives one apple to her friend Ben.', options: ['Sana', 'Ben', 'Musa'], answer: 'Sana', explanation: 'Sana shares an apple with Ben.' }
  ]}
]

export function getGradeTwoWordPath(id?: string) {
  return gradeTwoWordPaths.find(path => path.id === id)
}
