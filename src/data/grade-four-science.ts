import type { GradeOneTopic } from './grade-one-topics'

// Grade 4 Natural Sciences and Technology introductory questions, for teacher review.
export const gradeFourSciencePaths: GradeOneTopic[] = [
  { id: 'living-things-and-habitats', title: 'Living Things & Habitats', shortTitle: 'Living', emoji: '🌱', colour: 'mint', description: 'Explore living things, plant parts and habitats.', activities: [
    { id: 'living-or-not', prompt: 'Which is a living thing?', visual: '🌱 🪨', helper: 'Think about growing and needing resources.', options: ['Bean plant', 'Stone', 'Plastic spoon'], answer: 'Bean plant', explanation: 'A bean plant grows and needs water, air and light.' },
    { id: 'plant-root', prompt: 'Which plant part takes in water from soil?', visual: '🌿', helper: 'Look below the stem.', options: ['Roots', 'Flowers', 'Petals'], answer: 'Roots', explanation: 'Roots absorb water from the soil.' },
    { id: 'plant-leaf', prompt: 'Which part of a green plant usually makes food using light?', visual: '🍃 ☀️', helper: 'Think of the broad green part.', options: ['Leaves', 'Roots', 'Seeds'], answer: 'Leaves', explanation: 'Green leaves use sunlight to make food.' },
    { id: 'animal-habitat', prompt: 'What is a habitat?', visual: '🐸 🌿', helper: 'Think of the place an animal lives.', options: ['A place where an organism lives', 'A type of ruler', 'An animal’s colour'], answer: 'A place where an organism lives', explanation: 'A habitat is the natural place where an organism lives.' },
    { id: 'habitat-needs', prompt: 'What does a bird need from its habitat?', visual: '🐦 🌳', helper: 'Think about food, water and shelter.', options: ['Food, water and shelter', 'Only toys', 'Only a screen'], answer: 'Food, water and shelter', explanation: 'A suitable habitat provides resources for survival.' }
  ]},
  { id: 'materials-and-properties', title: 'Materials & Properties', shortTitle: 'Materials', emoji: '🧪', colour: 'blue', description: 'Compare materials by properties and uses.', activities: [
    { id: 'material-transparent', prompt: 'Which material lets you see through it clearly?', visual: '🪟', helper: 'Think of a clear window.', options: ['Clear glass', 'Brick', 'Wood'], answer: 'Clear glass', explanation: 'Clear glass is transparent.' },
    { id: 'material-waterproof', prompt: 'Which material is useful for a waterproof raincoat?', visual: '🌧️ 🧥', helper: 'Choose something that keeps water out.', options: ['Waterproof fabric', 'Tissue paper', 'Cotton wool'], answer: 'Waterproof fabric', explanation: 'Waterproof fabric helps keep rain out.' },
    { id: 'material-flexible', prompt: 'Which object can bend without breaking easily?', visual: '〰️', helper: 'Look for a flexible object.', options: ['Rubber band', 'Dry brick', 'Ceramic tile'], answer: 'Rubber band', explanation: 'A rubber band is flexible.' },
    { id: 'material-dissolve', prompt: 'What happens when sugar dissolves in water?', visual: '🥄 💧', helper: 'Stir a small amount into water.', options: ['It mixes into the water', 'It becomes a stone', 'It turns into sand'], answer: 'It mixes into the water', explanation: 'Dissolved sugar mixes through the water, though it is still present.' },
    { id: 'material-mixture', prompt: 'How can you separate small stones from sand?', visual: '🪨 🏖️', helper: 'Think about size differences.', options: ['Use a sieve', 'Add paint', 'Use a magnet for all stones'], answer: 'Use a sieve', explanation: 'A sieve can let sand through while holding larger stones.' }
  ]},
  { id: 'energy-and-sound', title: 'Energy & Sound', shortTitle: 'Energy', emoji: '☀️', colour: 'gold', description: 'Find energy sources and explore sound.', activities: [
    { id: 'energy-sun', prompt: 'Which is a natural source of light and heat?', visual: '☀️', helper: 'Think of daytime.', options: ['The Sun', 'A stone', 'A chair'], answer: 'The Sun', explanation: 'The Sun gives Earth light and heat.' },
    { id: 'energy-battery', prompt: 'What can supply electrical energy to a torch?', visual: '🔦 🔋', helper: 'Look inside a battery torch.', options: ['Battery', 'Paper', 'Sand'], answer: 'Battery', explanation: 'A battery supplies electrical energy to a torch.' },
    { id: 'sound-vibration', prompt: 'What produces sound when a drum is struck?', visual: '🥁', helper: 'Feel the drum skin move.', options: ['Vibration', 'Silence', 'Sunlight'], answer: 'Vibration', explanation: 'The drum skin vibrates and produces sound.' },
    { id: 'sound-distance', prompt: 'How can a bell make a louder sound?', visual: '🔔', helper: 'Compare gentle and firm strikes.', options: ['Strike it more firmly', 'Cover it completely', 'Do not touch it'], answer: 'Strike it more firmly', explanation: 'A firmer strike usually makes a stronger vibration and louder sound.' },
    { id: 'energy-safety', prompt: 'What should you do before touching a damaged electrical plug?', visual: '🔌 ⚠️', helper: 'Electricity can be dangerous.', options: ['Keep away and tell an adult', 'Touch exposed wires', 'Pour water on it'], answer: 'Keep away and tell an adult', explanation: 'Do not touch a damaged plug; tell a responsible adult.' }
  ]},
  { id: 'earth-and-sky', title: 'Earth & Sky', shortTitle: 'Earth', emoji: '🌍', colour: 'purple', description: 'Observe day and night, the Moon and Earth materials.', activities: [
    { id: 'earth-day-night', prompt: 'What causes day and night on Earth?', visual: '🌍 ☀️', helper: 'The Earth turns.', options: ['Earth rotating', 'The Moon switching off', 'Clouds becoming stars'], answer: 'Earth rotating', explanation: 'As Earth rotates, places face toward and away from the Sun.' },
    { id: 'earth-moon', prompt: 'Which object travels around Earth?', visual: '🌍 🌙', helper: 'Look at the night sky.', options: ['The Moon', 'The Sun', 'A mountain'], answer: 'The Moon', explanation: 'The Moon travels around Earth.' },
    { id: 'earth-stars', prompt: 'What is the Sun?', visual: '☀️', helper: 'It gives off its own light.', options: ['A star', 'A planet', 'A cloud'], answer: 'A star', explanation: 'The Sun is a star.' },
    { id: 'earth-soil', prompt: 'What can soil help support?', visual: '🪴', helper: 'Think of a growing seed.', options: ['Plant growth', 'A torch battery', 'A glass window'], answer: 'Plant growth', explanation: 'Soil can support plant roots and provide resources.' },
    { id: 'earth-observe', prompt: 'How can you safely observe the Sun’s position?', visual: '☀️ 👀', helper: 'Never look directly at the Sun.', options: ['Watch the position of shadows', 'Stare into the Sun', 'Look through a magnifying glass'], answer: 'Watch the position of shadows', explanation: 'Shadows can show the Sun’s apparent movement without looking directly at it.' }
  ]},
  { id: 'design-and-structures', title: 'Design & Structures', shortTitle: 'Design', emoji: '🏗️', colour: 'pink', description: 'Choose materials, test structures and improve a design.', activities: [
    { id: 'design-purpose', prompt: 'What is a bridge made to do?', visual: '🌉', helper: 'Think about crossing a river.', options: ['Help people cross a gap', 'Make rain', 'Grow leaves'], answer: 'Help people cross a gap', explanation: 'A bridge is a structure that helps people cross a gap.' },
    { id: 'design-material', prompt: 'Which classroom material might work for a small model bridge?', visual: '🌉 📏', helper: 'It must hold its shape across a gap.', options: ['Stiff cardboard', 'Loose water', 'A single thread'], answer: 'Stiff cardboard', explanation: 'Stiff cardboard can span a small gap in a model.' },
    { id: 'design-triangle', prompt: 'Which shape often helps strengthen a frame?', visual: '🔺', helper: 'Look for a shape that resists bending in a frame.', options: ['Triangle', 'Open curve', 'Single loose line'], answer: 'Triangle', explanation: 'Triangles can help keep a frame rigid.' },
    { id: 'design-test', prompt: 'What should you do after building a model bridge?', visual: '🌉 🧱', helper: 'Check whether it meets the goal.', options: ['Test it safely with small loads', 'Assume it is strong', 'Stand on it'], answer: 'Test it safely with small loads', explanation: 'A safe test shows whether the model works.' },
    { id: 'design-improve', prompt: 'Your paper bridge bends under a small load. What should you do next?', visual: '📄 🌉', helper: 'Use test results to improve it.', options: ['Change the design and test again', 'Ignore the bend', 'Add a much heavier load'], answer: 'Change the design and test again', explanation: 'Improve the model and retest to see if it works better.' }
  ]}
]

export function getGradeFourSciencePath(id?: string) {
  return gradeFourSciencePaths.find(path => path.id === id)
}
