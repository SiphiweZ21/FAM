import type { GradeOneTopic } from './grade-one-topics'

// Grade 3 introductory Life Skills practice; practical tasks require an adult or teacher.
export const gradeThreeLifeSkillsPaths: GradeOneTopic[] = [
  { id: 'living-things', title: 'Living Things', shortTitle: 'Nature', emoji: '🌱', colour: 'mint', description: 'Observe plants, animals and their needs.', activities: [
    { id: 'plant-water', prompt: 'What does a young plant need to grow?', visual: '🌱 💧', helper: 'Think about caring for a seedling.', options: ['Water and light', 'Only stones', 'No air'], answer: 'Water and light', explanation: 'Plants need water and light to grow.' },
    { id: 'plant-roots', prompt: 'Which part of a plant takes in water from soil?', visual: '🌱', helper: 'Look below the stem.', options: ['Roots', 'Flowers', 'Petals'], answer: 'Roots', explanation: 'Roots take in water from soil.' },
    { id: 'animal-shelter', prompt: 'Why does an animal need shelter?', visual: '🐦 🪺', helper: 'Think about weather and safety.', options: ['For protection', 'To stop breathing', 'To stop eating'], answer: 'For protection', explanation: 'Shelter helps protect animals.' },
    { id: 'living-observe', prompt: 'How can you observe an insect safely?', visual: '🐞 👀', helper: 'Let it stay in its home.', options: ['Look without harming it', 'Pull off its wings', 'Step on it'], answer: 'Look without harming it', explanation: 'Observing without harming the insect is respectful.' },
    { id: 'plant-seed', prompt: 'What might grow from a bean seed?', visual: '🫘 🌱', helper: 'Think of a seedling.', options: ['A bean plant', 'A stone', 'A plastic cup'], answer: 'A bean plant', explanation: 'A bean seed can grow into a bean plant.' }
  ]},
  { id: 'weather-and-water', title: 'Weather & Water', shortTitle: 'Weather', emoji: '🌦️', colour: 'blue', description: 'Notice weather and use water carefully.', activities: [
    { id: 'weather-rain', prompt: 'Which picture shows rainy weather?', visual: '☀️ 🌧️', helper: 'Look for falling water.', options: ['🌧️', '☀️', '🌙'], answer: '🌧️', explanation: 'Rain falls from clouds.' },
    { id: 'weather-dress', prompt: 'It is cold and windy. What can help you stay warm?', visual: '🌬️ 🧥', helper: 'Choose suitable clothing.', options: ['A warm jacket', 'Only a swimsuit', 'Bare feet'], answer: 'A warm jacket', explanation: 'A warm jacket can help in cold weather.' },
    { id: 'water-tap', prompt: 'What should you do after using a tap?', visual: '🚰', helper: 'Save clean water.', options: ['Close it properly', 'Leave it running', 'Break it'], answer: 'Close it properly', explanation: 'Closing a tap avoids wasting water.' },
    { id: 'storm-safety', prompt: 'Where should you go during a thunderstorm?', visual: '⛈️', helper: 'Find a safe place with an adult.', options: ['Inside a safe building', 'Under a lone tree', 'Into open water'], answer: 'Inside a safe building', explanation: 'Go indoors with an adult during a thunderstorm.' },
    { id: 'water-reuse', prompt: 'Which is a sensible use of collected rainwater with adult help?', visual: '🪣 🌱', helper: 'Think about watering plants.', options: ['Watering plants', 'Drinking it without checking', 'Pouring it down a drain'], answer: 'Watering plants', explanation: 'Collected rainwater can be used to water plants.' }
  ]},
  { id: 'healthy-choices', title: 'Healthy Choices', shortTitle: 'Healthy', emoji: '🥗', colour: 'pink', description: 'Care for your body and choose safe habits.', activities: [
    { id: 'health-hands', prompt: 'When should you wash your hands?', visual: '🧼 🍽️', helper: 'Think about eating safely.', options: ['Before eating', 'Only once a year', 'Never'], answer: 'Before eating', explanation: 'Wash your hands before eating.' },
    { id: 'health-food', prompt: 'Which snack includes fruit?', visual: '🍎 🍬', helper: 'Choose the fruit.', options: ['An apple', 'Only sweets', 'A stone'], answer: 'An apple', explanation: 'An apple is a fruit.' },
    { id: 'health-teeth', prompt: 'What helps keep your teeth clean?', visual: '🪥', helper: 'Think of a toothbrush.', options: ['Brushing teeth', 'Never cleaning them', 'Eating toothpaste'], answer: 'Brushing teeth', explanation: 'Brushing helps keep teeth clean.' },
    { id: 'health-ill', prompt: 'You feel unwell at school. What should you do?', visual: '🤒 🏫', helper: 'Tell someone responsible.', options: ['Tell a teacher', 'Hide how you feel', 'Take another learner’s medicine'], answer: 'Tell a teacher', explanation: 'A teacher can help you get care.' },
    { id: 'health-rest', prompt: 'What helps your body recover after a busy day?', visual: '😴', helper: 'Think about bedtime.', options: ['Enough sleep', 'Staying up all night', 'Skipping rest'], answer: 'Enough sleep', explanation: 'Sleep helps your body rest.' }
  ]},
  { id: 'community-and-safety', title: 'Community & Safety', shortTitle: 'Community', emoji: '🤝', colour: 'gold', description: 'Respect others and make safe choices.', activities: [
    { id: 'community-cross', prompt: 'How should you cross a road?', visual: '🚦 🚶', helper: 'Follow the crossing rules and your adult.', options: ['Use a safe crossing with an adult', 'Run between cars', 'Ignore traffic'], answer: 'Use a safe crossing with an adult', explanation: 'Use a safe crossing and follow an adult’s guidance.' },
    { id: 'community-lost', prompt: 'You cannot find your caregiver at a shop. What should you do?', visual: '🛒 ❓', helper: 'Look for a safe adult at the shop.', options: ['Ask a shop worker for help', 'Leave with a stranger', 'Hide outside'], answer: 'Ask a shop worker for help', explanation: 'A shop worker can help you contact your caregiver.' },
    { id: 'community-kind', prompt: 'A classmate has a different idea. What can you do?', visual: '🧒 💬', helper: 'Let them speak.', options: ['Listen respectfully', 'Laugh at them', 'Stop them speaking'], answer: 'Listen respectfully', explanation: 'Listening shows respect.' },
    { id: 'community-bully', prompt: 'Someone repeatedly hurts another learner. What is a safe response?', visual: '⚠️ 🏫', helper: 'Get help.', options: ['Tell a trusted adult', 'Join in', 'Keep it secret'], answer: 'Tell a trusted adult', explanation: 'Tell a trusted adult so the learner can get help.' },
    { id: 'community-clean', prompt: 'How can you help care for a shared classroom?', visual: '🏫 🧹', helper: 'Think about shared spaces.', options: ['Put litter in a bin', 'Drop litter on the floor', 'Damage the desks'], answer: 'Put litter in a bin', explanation: 'Using a bin helps keep shared spaces clean.' }
  ]},
  { id: 'create-and-move', title: 'Create & Move', shortTitle: 'Arts & Move', emoji: '🎨', colour: 'purple', description: 'Explore rhythm, art and movement safely.', activities: [
    { id: 'art-warm', prompt: 'Which colour might you choose to draw a bright sun?', visual: '☀️ 🖍️', helper: 'Think about a yellow sun.', options: ['Yellow', 'Transparent', 'No colour exists'], answer: 'Yellow', explanation: 'Yellow is one colour you can use for a sun; artists may choose others too.' },
    { id: 'art-rhythm', prompt: 'Clap, clap, pause. What follows if the pattern repeats?', visual: '👏 👏 ⏸️ 👏 👏 ?', helper: 'Repeat the same rhythm.', options: ['Pause', 'Jump', 'Shout'], answer: 'Pause', explanation: 'The repeating rhythm ends with a pause.' },
    { id: 'art-texture', prompt: 'Which material may feel rough to touch?', visual: '📄 🪨', helper: 'Think about a rough surface.', options: ['A rough stone', 'Smooth glass', 'Soft cotton'], answer: 'A rough stone', explanation: 'A rough stone can have a rough texture.' },
    { id: 'move-space', prompt: 'What should you check before dancing with a group?', visual: '💃 ↔️', helper: 'Keep everyone safe.', options: ['Enough clear space', 'A crowded stairway', 'An open road'], answer: 'Enough clear space', explanation: 'Clear space helps everyone move safely.' },
    { id: 'move-balance', prompt: 'What can you do if a balance activity feels difficult?', visual: '🧍 🤝', helper: 'Work within your ability.', options: ['Ask for support and try safely', 'Push another learner', 'Stand on a high wall'], answer: 'Ask for support and try safely', explanation: 'Ask a teacher for help and practise at a safe level.' }
  ]}
]

export function getGradeThreeLifeSkillsPath(id?: string) {
  return gradeThreeLifeSkillsPaths.find(path => path.id === id)
}
