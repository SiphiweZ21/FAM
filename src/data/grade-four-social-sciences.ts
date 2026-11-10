import type { GradeOneTopic } from './grade-one-topics'

// Grade 4 Social Sciences Geography and History starter; requires source and map work with a teacher.
export const gradeFourSocialSciencesPaths: GradeOneTopic[] = [
  { id: 'settlements-and-maps', title: 'Settlements & Maps', shortTitle: 'Maps', emoji: '🗺️', colour: 'blue', description: 'Explore places people live and map directions.', activities: [
    { id: 'settlement-meaning', prompt: 'What is a settlement?', visual: '🏘️', helper: 'Think about where people live.', options: ['A place where people live', 'A kind of cloud', 'A farm animal'], answer: 'A place where people live', explanation: 'A settlement is a place where people live.' },
    { id: 'settlement-rural', prompt: 'Which picture is more likely to show a rural settlement?', visual: '🚜 🏡 | 🏙️', helper: 'Think of farms and open space.', options: ['Farms with houses spread out', 'Tall buildings close together', 'A busy city centre'], answer: 'Farms with houses spread out', explanation: 'Rural settlements often have farms and houses spread out.' },
    { id: 'map-north', prompt: 'On a map with north at the top, which direction is on the right?', visual: '🧭 N ↑', helper: 'Face north and check your right.', options: ['East', 'West', 'South'], answer: 'East', explanation: 'East is to the right when north is at the top.' },
    { id: 'map-symbol', prompt: 'Why does a map have a key?', visual: '🗺️ 🔑', helper: 'Think about what the symbols mean.', options: ['To explain symbols', 'To lock the map', 'To show only the date'], answer: 'To explain symbols', explanation: 'A map key explains the symbols used on the map.' },
    { id: 'map-plan', prompt: 'A plan view shows a place as seen from where?', visual: '🏠 ⬇️', helper: 'Imagine looking down from above.', options: ['Above', 'Under the ground', 'Inside a wall'], answer: 'Above', explanation: 'A plan view looks down on a place from above.' }
  ]},
  { id: 'food-and-farming', title: 'Food & Farming', shortTitle: 'Farming', emoji: '🌽', colour: 'mint', description: 'Find out where food comes from and how it is farmed.', activities: [
    { id: 'food-plant', prompt: 'Which food comes from a plant?', visual: '🌽 🥚', helper: 'Think about a crop.', options: ['Maize', 'Egg', 'Milk'], answer: 'Maize', explanation: 'Maize is grown as a crop.' },
    { id: 'food-animal', prompt: 'Which food comes from an animal?', visual: '🥛 🌽', helper: 'Think of cows.', options: ['Milk', 'Maize', 'Carrot'], answer: 'Milk', explanation: 'Milk can come from cows.' },
    { id: 'farm-crop', prompt: 'What is crop farming?', visual: '🚜 🌱', helper: 'Think about what farmers grow.', options: ['Growing plants for food or other uses', 'Only raising chickens', 'Building roads'], answer: 'Growing plants for food or other uses', explanation: 'Crop farming is growing useful plants.' },
    { id: 'farm-stock', prompt: 'What is stock farming?', visual: '🐄 🐑', helper: 'Think of farm animals.', options: ['Raising farm animals', 'Growing maize only', 'Mining rocks'], answer: 'Raising farm animals', explanation: 'Stock farming is raising livestock.' },
    { id: 'farm-city', prompt: 'Can people grow food in towns and cities?', visual: '🏙️ 🪴', helper: 'Think of a community garden.', options: ['Yes, in gardens and other suitable spaces', 'No, never', 'Only in rivers'], answer: 'Yes, in gardens and other suitable spaces', explanation: 'People can grow food in urban gardens.' }
  ]},
  { id: 'water-in-south-africa', title: 'Water in South Africa', shortTitle: 'Water', emoji: '💧', colour: 'purple', description: 'Learn about fresh water, storage and use.', activities: [
    { id: 'water-fresh', prompt: 'Which is a natural source of fresh water?', visual: '🏞️', helper: 'Think of flowing water on land.', options: ['River', 'Sea', 'Ocean'], answer: 'River', explanation: 'A river is a natural source of fresh water.' },
    { id: 'water-farm', prompt: 'Why do farmers need water?', visual: '🚜 💧', helper: 'Think of crops and livestock.', options: ['To grow crops and care for animals', 'To make clouds disappear', 'To turn soil into plastic'], answer: 'To grow crops and care for animals', explanation: 'Farming uses water for crops and animals.' },
    { id: 'water-storage', prompt: 'Which structure can store large amounts of water?', visual: '🏞️ 🧱', helper: 'Think of a reservoir behind a wall.', options: ['Dam', 'Road sign', 'Window'], answer: 'Dam', explanation: 'A dam can store water for later use.' },
    { id: 'water-borehole', prompt: 'Where does a borehole bring water from?', visual: '⛏️ 💧', helper: 'Think of water below the surface.', options: ['Underground', 'A television', 'An aeroplane'], answer: 'Underground', explanation: 'Boreholes can draw water from underground.' },
    { id: 'water-care', prompt: 'What helps save water at home?', visual: '🚰', helper: 'Stop a tap after using it.', options: ['Close a running tap', 'Leave it running', 'Ignore a leak'], answer: 'Close a running tap', explanation: 'Closing taps helps avoid wasting water.' }
  ]},
  { id: 'local-history-and-leaders', title: 'Local History & Leaders', shortTitle: 'History', emoji: '🏛️', colour: 'gold', description: 'Use sources to learn about the past and leadership.', activities: [
    { id: 'history-source', prompt: 'Which can tell us how a street looked long ago?', visual: '📷 🏘️', helper: 'Look for evidence from the past.', options: ['An old photograph', 'A guess with no evidence', 'A blank page'], answer: 'An old photograph', explanation: 'An old photograph is one source about the past.' },
    { id: 'history-interview', prompt: 'Whom could you ask about changes in your local area?', visual: '👵 💬', helper: 'Ask someone who remembers earlier times.', options: ['A longtime resident', 'Only a new poster', 'A locked door'], answer: 'A longtime resident', explanation: 'A longtime resident can share memories; compare them with other sources.' },
    { id: 'history-compare', prompt: 'Two people remember an event differently. What should a historian do?', visual: '💬 💬', helper: 'Consider more than one source.', options: ['Compare their accounts and other evidence', 'Assume one is always right', 'Throw away both accounts'], answer: 'Compare their accounts and other evidence', explanation: 'Comparing sources helps build a fuller picture.' },
    { id: 'leader-listen', prompt: 'Which action shows a leader listening to others?', visual: '👥 👂', helper: 'Think about giving people a voice.', options: ['Hearing the team before deciding', 'Interrupting everyone', 'Ignoring the team'], answer: 'Hearing the team before deciding', explanation: 'Listening to others is a useful leadership quality.' },
    { id: 'leader-community', prompt: 'How can a leader serve a community?', visual: '🤝 🏘️', helper: 'Think about working for others.', options: ['Work with people on a shared need', 'Keep every resource for themselves', 'Refuse to hear concerns'], answer: 'Work with people on a shared need', explanation: 'A leader can work with others for the community’s benefit.' }
  ]},
  { id: 'transport-and-communication', title: 'Transport & Communication', shortTitle: 'Change', emoji: '🚂', colour: 'pink', description: 'Notice how moving and sharing messages changed over time.', activities: [
    { id: 'transport-past', prompt: 'Which was used to move goods on land long before motor vehicles?', visual: '🐂 🛞', helper: 'Think of animals pulling a cart.', options: ['Ox wagon', 'Jet plane', 'Mobile phone'], answer: 'Ox wagon', explanation: 'Ox wagons were used to transport goods on land.' },
    { id: 'transport-water', prompt: 'Which vehicle moves across water?', visual: '🚢 🌊', helper: 'Think of a ship.', options: ['Boat', 'Train', 'Bicycle'], answer: 'Boat', explanation: 'A boat travels across water.' },
    { id: 'transport-air', prompt: 'Which vehicle can fly passengers?', visual: '✈️', helper: 'Think of air travel.', options: ['Aeroplane', 'Bicycle', 'Rowing boat'], answer: 'Aeroplane', explanation: 'An aeroplane can carry passengers through the air.' },
    { id: 'message-post', prompt: 'Which method carried written letters before electronic messaging?', visual: '✉️ 📮', helper: 'Think of a post office.', options: ['Postal service', 'Video call', 'Instant message'], answer: 'Postal service', explanation: 'Postal services carried letters between places.' },
    { id: 'message-now', prompt: 'Which can send a message electronically today?', visual: '📱', helper: 'Think of a connected device.', options: ['Mobile phone', 'Paper-only envelope', 'Stone wall'], answer: 'Mobile phone', explanation: 'A mobile phone can send an electronic message.' }
  ]}
]

export function getGradeFourSocialSciencesPath(id?: string) {
  return gradeFourSocialSciencesPaths.find(path => path.id === id)
}
