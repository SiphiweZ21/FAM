import type { GradeOneTopic } from './grade-one-topics'

// Introductory picture activities drawn from the four Foundation Phase Life Skills study areas.
// Physical and creative practice must also happen away from the screen with an adult or teacher.
export const gradeOneLifeSkills: GradeOneTopic[] = [
  { id: 'myself-and-others', title: 'Myself & Others', shortTitle: 'People', emoji: '🤝', colour: 'mint', description: 'Feelings, kindness and being part of a group.', activities: [
    { id: 'feel-happy', prompt: 'Which face looks happy?', visual: '😊 😢 😠', helper: 'Look at each mouth and face.', options: ['😊', '😢', '😠'], answer: '😊', explanation: 'The smiling face looks happy.' },
    { id: 'feel-sad', prompt: 'Your friend feels sad. What can you do?', visual: '😢 🤝', helper: 'Think of a kind way to help.', options: ['Ask if they are okay', 'Laugh at them', 'Walk away'], answer: 'Ask if they are okay', explanation: 'Asking kindly shows you care.' },
    { id: 'feel-angry', prompt: 'You feel angry. What is a safe first step?', visual: '😠 🌬️', helper: 'Pause before you act.', options: ['Take a slow breath', 'Push someone', 'Throw a toy'], answer: 'Take a slow breath', explanation: 'A slow breath can help you pause. Ask a trusted adult for help if needed.' },
    { id: 'share', prompt: 'A classmate needs a crayon. What can you do?', visual: '🖍️ 🧒', helper: 'Think about sharing.', options: ['Share if I can', 'Break the crayon', 'Hide all the crayons'], answer: 'Share if I can', explanation: 'Sharing when you can helps people work together.' },
    { id: 'different-families', prompt: 'Do all families look the same?', visual: '👩‍👧 👨‍👦 👵👧', helper: 'Families can include different people.', options: ['No, families can be different', 'Yes, every family is the same', 'Only one kind is a family'], answer: 'No, families can be different', explanation: 'Families can look different and care for one another.' }
  ]},
  { id: 'healthy-and-safe', title: 'Healthy & Safe', shortTitle: 'Healthy', emoji: '🧼', colour: 'blue', description: 'Everyday hygiene and asking for help.', activities: [
    { id: 'wash-hands', prompt: 'When should we wash our hands?', visual: '🚽 🧼', helper: 'Think about what we do after using the toilet.', options: ['After using the toilet', 'Only on birthdays', 'Never'], answer: 'After using the toilet', explanation: 'Wash your hands with soap and water after using the toilet.' },
    { id: 'drink-water', prompt: 'Which drink helps your body stay hydrated?', visual: '💧 🥤', helper: 'Choose the everyday drink.', options: ['Water', 'Only fizzy drinks', 'Nothing'], answer: 'Water', explanation: 'Drinking water helps your body.' },
    { id: 'road-crossing', prompt: 'What should you do before crossing a road?', visual: '🚶 🚗', helper: 'Stop and get help when you need it.', options: ['Stop, look and cross with an adult', 'Run without looking', 'Play in the road'], answer: 'Stop, look and cross with an adult', explanation: 'Stop and look carefully. A trusted adult can help you cross safely.' },
    { id: 'unsafe-secret', prompt: 'Something makes you feel unsafe. Who can you tell?', visual: '🧒 🧑', helper: 'You can ask for help.', options: ['A trusted adult', 'Nobody', 'Only a stranger'], answer: 'A trusted adult', explanation: 'Tell a trusted adult. Keep telling someone safe until you get help.' },
    { id: 'healthy-snack', prompt: 'Which is a fruit?', visual: '🍎 🍬', helper: 'Find the food that grows on a tree.', options: ['Apple', 'Sweet', 'Both'], answer: 'Apple', explanation: 'An apple is a fruit.' }
  ]},
  { id: 'world-around-us', title: 'Our World', shortTitle: 'World', emoji: '🌱', colour: 'gold', description: 'Observe plants, weather and caring for our environment.', activities: [
    { id: 'plant-water', prompt: 'What does a plant need to grow?', visual: '🌱 💧', helper: 'Think about watering a plant.', options: ['Water', 'Plastic', 'A stone only'], answer: 'Water', explanation: 'Plants need water to grow.' },
    { id: 'sunny-weather', prompt: 'Which picture shows sunny weather?', visual: '☀️ 🌧️ ☁️', helper: 'Look for the sun.', options: ['☀️', '🌧️', '☁️'], answer: '☀️', explanation: 'The sun picture shows sunny weather.' },
    { id: 'raincoat', prompt: 'What can help keep you dry in the rain?', visual: '🌧️ 🧥', helper: 'Choose something you can wear.', options: ['Raincoat', 'Sunglasses', 'Sandals'], answer: 'Raincoat', explanation: 'A raincoat can help keep you dry.' },
    { id: 'plant-parts', prompt: 'Which part of a plant grows under the soil?', visual: '🌱', helper: 'Think about what holds the plant in place.', options: ['Roots', 'Flower', 'Leaf'], answer: 'Roots', explanation: 'Roots grow under the soil.' },
    { id: 'litter', prompt: 'Where should a small piece of litter go?', visual: '🗑️ 🌳', helper: 'Help keep shared places clean.', options: ['In a bin', 'On the ground', 'In a river'], answer: 'In a bin', explanation: 'Put litter in a bin when one is available.' }
  ]},
  { id: 'create-and-move', title: 'Create & Move', shortTitle: 'Move', emoji: '🎨', colour: 'pink', description: 'Explore rhythm, art and safe movement.', activities: [
    { id: 'colour-mix', prompt: 'What colour can red and yellow paint make?', visual: '🔴 + 🟡', helper: 'Imagine mixing the paints.', options: ['Orange', 'Blue', 'Green'], answer: 'Orange', explanation: 'Red and yellow paint can make orange.' },
    { id: 'clap-rhythm', prompt: 'Which action can make a rhythm?', visual: '👏 🎵', helper: 'Try a steady clap with an adult.', options: ['Clapping', 'Sleeping', 'Standing still'], answer: 'Clapping', explanation: 'Clapping can make a rhythm.' },
    { id: 'move-space', prompt: 'Before you dance, what should you check?', visual: '💃 ↔️ 🪑', helper: 'Look around you.', options: ['There is safe space', 'There are toys under my feet', 'My eyes are closed'], answer: 'There is safe space', explanation: 'Make sure there is room to move safely.' },
    { id: 'draw-lines', prompt: 'What can you use to draw lines on paper?', visual: '🖍️ 📄', helper: 'Choose a drawing tool.', options: ['Crayon', 'Spoon', 'Shoe'], answer: 'Crayon', explanation: 'A crayon can make lines and shapes on paper.' },
    { id: 'warm-up', prompt: 'Before active play, which movement is gentle?', visual: '🚶 🏃', helper: 'Begin slowly with an adult or teacher.', options: ['Walking', 'Jumping into someone', 'Running into a wall'], answer: 'Walking', explanation: 'Gentle walking can help you start moving.' }
  ]}
]

export function getGradeOneLifeSkillsPath(id?: string) {
  return gradeOneLifeSkills.find(path => path.id === id)
}
