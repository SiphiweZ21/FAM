import type { GradeOneTopic } from './grade-one-topics'

// Introductory Grade 2 Life Skills picture practice. Classroom art and movement remain essential.
export const gradeTwoLifeSkillsPaths: GradeOneTopic[] = [
  { id: 'what-we-need', title: 'What We Need to Live', shortTitle: 'Needs', emoji: '💧', colour: 'blue', description: 'Food, water, air and sunlight.', activities: [
    { id: 'need-water', prompt: 'Which drink does your body need?', visual: '💧', helper: 'Think of a drink you need every day.', options: ['Safe water', 'Only fizzy drinks', 'Paint'], answer: 'Safe water', explanation: 'Our bodies need safe drinking water.' },
    { id: 'need-air', prompt: 'What do we breathe?', visual: '🌬️', helper: 'You cannot always see it.', options: ['Air', 'Sand', 'Paint'], answer: 'Air', explanation: 'We breathe air.' },
    { id: 'need-food', prompt: 'Which picture shows food?', visual: '🍎 🪨', helper: 'Which can you eat?', options: ['Apple', 'Stone', 'Both'], answer: 'Apple', explanation: 'An apple is food.' },
    { id: 'need-sun', prompt: 'What can help protect you from strong sun?', visual: '☀️ 🧢', helper: 'Look for shade and protection.', options: ['Hat and shade', 'Staring at the sun', 'No water'], answer: 'Hat and shade', explanation: 'A hat and shade can help protect you in strong sun.' },
    { id: 'need-water-safe', prompt: 'You do not know whether water is safe to drink. What should you do?', visual: '💧 ❓', helper: 'Ask someone responsible.', options: ['Ask a trusted adult', 'Drink it without checking', 'Put sand in it'], answer: 'Ask a trusted adult', explanation: 'A trusted adult can help you find safe drinking water.' }
  ]},
  { id: 'friends-and-respect', title: 'Friends & Respect', shortTitle: 'Friends', emoji: '🤝', colour: 'mint', description: 'Friendship, sharing and handling conflict.', activities: [
    { id: 'friend-listen', prompt: 'A friend wants to tell you something. What can you do?', visual: '🧒 👂', helper: 'Give them a turn to speak.', options: ['Listen', 'Shout over them', 'Laugh at them'], answer: 'Listen', explanation: 'Listening shows respect.' },
    { id: 'friend-share', prompt: 'You both want the same game. What can help?', visual: '🧩 🧒 🧒', helper: 'Think of a fair way.', options: ['Take turns', 'Grab it', 'Break it'], answer: 'Take turns', explanation: 'Taking turns helps you share.' },
    { id: 'friend-bullying', prompt: 'Someone keeps hurting a classmate. What should you do?', visual: '🧒 ⚠️', helper: 'Get help safely.', options: ['Tell a trusted adult', 'Join in', 'Keep it secret'], answer: 'Tell a trusted adult', explanation: 'Tell a trusted adult so the classmate can get help.' },
    { id: 'friend-apologise', prompt: 'You accidentally knock over a friend’s drawing. What can you say?', visual: '🎨', helper: 'Be honest and kind.', options: ['I am sorry. Can I help?', 'It is your fault.', 'I do not care.'], answer: 'I am sorry. Can I help?', explanation: 'Apologising and offering help can repair a mistake.' },
    { id: 'friend-help', prompt: 'A new learner cannot find the classroom. What can you do?', visual: '🏫 🧒', helper: 'Think of a safe, welcoming action.', options: ['Show them with a teacher', 'Send them away', 'Hide'], answer: 'Show them with a teacher', explanation: 'Helping with a teacher can make a new learner feel welcome.' }
  ]},
  { id: 'everyone-is-special', title: 'Everyone Is Special', shortTitle: 'Everyone', emoji: '🌟', colour: 'gold', description: 'Differences, inclusion and asking how to help.', activities: [
    { id: 'special-different', prompt: 'Do all people learn in exactly the same way?', visual: '👧 🧒 👦', helper: 'People have different strengths and needs.', options: ['No, people learn differently', 'Yes, everyone is identical', 'Only one way matters'], answer: 'No, people learn differently', explanation: 'People learn in different ways.' },
    { id: 'special-glasses', prompt: 'What can help someone see more clearly?', visual: '👓', helper: 'It is worn on the face.', options: ['Glasses', 'Shoes', 'A cup'], answer: 'Glasses', explanation: 'Some people use glasses to see more clearly.' },
    { id: 'special-ask', prompt: 'A classmate uses a walking aid. How should you offer help?', visual: '🧑‍🦯 🤝', helper: 'Respect their choice.', options: ['Ask if they would like help', 'Grab the aid', 'Block their path'], answer: 'Ask if they would like help', explanation: 'Ask first and listen to the person’s answer.' },
    { id: 'special-team', prompt: 'A teammate has a different idea. What should you do?', visual: '🧩 👥', helper: 'Everyone deserves a turn.', options: ['Listen to the idea', 'Laugh at the idea', 'Exclude them'], answer: 'Listen to the idea', explanation: 'Listening helps everyone take part.' },
    { id: 'special-strength', prompt: 'Can people be good at different things?', visual: '🎨 ⚽ 📚', helper: 'Think of art, sport and reading.', options: ['Yes', 'No', 'Only one skill matters'], answer: 'Yes', explanation: 'People have different strengths.' }
  ]},
  { id: 'healthy-living', title: 'Healthy Living', shortTitle: 'Healthy', emoji: '🥗', colour: 'pink', description: 'Food care, movement and healthy habits.', activities: [
    { id: 'healthy-wash', prompt: 'What should you do before eating fruit?', visual: '🍎 💧', helper: 'Think about clean food.', options: ['Wash it with safe water', 'Drop it in dirt', 'Leave flies on it'], answer: 'Wash it with safe water', explanation: 'Wash fruit with safe water before eating.' },
    { id: 'healthy-cover', prompt: 'What helps protect food from flies?', visual: '🍞 🪰', helper: 'Keep food covered.', options: ['Cover the food', 'Leave it uncovered', 'Put it on the floor'], answer: 'Cover the food', explanation: 'Covering food helps keep flies away.' },
    { id: 'healthy-move', prompt: 'Which is an active game?', visual: '🏃', helper: 'Think of moving your body.', options: ['Running and playing safely', 'Sitting all day', 'Watching a screen all day'], answer: 'Running and playing safely', explanation: 'Active play gets your body moving.' },
    { id: 'healthy-rest', prompt: 'What should you do when your body needs rest?', visual: '😴', helper: 'Think about sleep.', options: ['Get enough sleep', 'Never sleep', 'Only watch screens'], answer: 'Get enough sleep', explanation: 'Sleep helps your body rest.' },
    { id: 'healthy-smoke', prompt: 'Which place has cleaner air to breathe?', visual: '🚭 🌳', helper: 'Avoid smoke when possible.', options: ['Away from smoke', 'Inside smoke', 'Next to a cigarette'], answer: 'Away from smoke', explanation: 'Staying away from smoke helps protect your lungs.' }
  ]},
  { id: 'create-and-move', title: 'Create & Move', shortTitle: 'Arts & Move', emoji: '🎨', colour: 'purple', description: 'Try rhythm, drawing and safe movement.', activities: [
    { id: 'art-pattern', prompt: 'Which colours continue the pattern?', visual: '🔴 🔵 🔴 🔵 ?', helper: 'Try drawing the pattern on paper.', options: ['🔴', '🔵', '🟢'], answer: '🔴', explanation: 'Red and blue repeat, so red comes next.' },
    { id: 'art-beat', prompt: 'What can help you make a steady beat?', visual: '👏 🎵', helper: 'Try clapping along with an adult.', options: ['Clapping', 'Sleeping', 'Standing silent'], answer: 'Clapping', explanation: 'You can clap a steady beat.' },
    { id: 'move-balance', prompt: 'What helps you balance while standing still?', visual: '🧍', helper: 'Stand where it is safe.', options: ['Look ahead and stand steadily', 'Close your eyes near traffic', 'Push a friend'], answer: 'Look ahead and stand steadily', explanation: 'Standing steadily and looking ahead can help balance.' },
    { id: 'move-space', prompt: 'What should you check before moving quickly?', visual: '🏃 ↔️', helper: 'Look around.', options: ['There is clear safe space', 'There are obstacles everywhere', 'Everyone is too close'], answer: 'There is clear safe space', explanation: 'Check that the space is safe for movement.' },
    { id: 'art-material', prompt: 'Which item can you use for a drawing?', visual: '📄 🖍️', helper: 'Use paper and a drawing tool.', options: ['Crayon', 'A hot stove', 'A sharp wire'], answer: 'Crayon', explanation: 'A crayon is a drawing tool.' }
  ]}
]

export function getGradeTwoLifeSkillsPath(id?: string) {
  return gradeTwoLifeSkillsPaths.find(path => path.id === id)
}
