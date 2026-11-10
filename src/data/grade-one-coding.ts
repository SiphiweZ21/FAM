import type { GradeOneTopic } from './grade-one-topics'

// Starter activities across the Foundation Phase Coding and Robotics study areas.
export const gradeOneCodingPaths: GradeOneTopic[] = [
  { id: 'patterns', title: 'Find the Pattern', shortTitle: 'Patterns', emoji: '🟦', colour: 'purple', description: 'Spot and continue repeating patterns.', activities: [
    { id: 'pattern-colours', prompt: 'Which colour comes next?', visual: '🔴 🔵 🔴 🔵 ?', helper: 'The colours take turns.', options: ['🔴', '🔵', '🟢'], answer: '🔴', explanation: 'Red, blue repeats, so red comes next.' },
    { id: 'pattern-shapes', prompt: 'Which shape comes next?', visual: '🔺 ⚪ 🔺 ⚪ ?', helper: 'Look for the first shape again.', options: ['🔺', '⚪', '🟦'], answer: '🔺', explanation: 'Triangle, circle repeats.' },
    { id: 'pattern-steps', prompt: 'Which picture comes next?', visual: '👣 👣 ⭐ 👣 👣 ⭐ ?', helper: 'Two footprints, then a star.', options: ['👣', '⭐', '🔵'], answer: '👣', explanation: 'The pattern begins again with a footprint.' },
    { id: 'pattern-beats', prompt: 'What comes after clap, tap, clap, tap?', visual: '👏 👆 👏 👆 ?', helper: 'Say the actions aloud.', options: ['👏', '👆', '🦶'], answer: '👏', explanation: 'Clap and tap repeat, so clap comes next.' },
    { id: 'pattern-different', prompt: 'Which picture breaks the pattern?', visual: '🍎 🍌 🍎 🍌 🍊', helper: 'The fruits should take turns.', options: ['Last orange', 'First apple', 'Second banana'], answer: 'Last orange', explanation: 'The last picture should be an apple.' }
  ]},
  { id: 'robot-instructions', title: 'Give the Robot Steps', shortTitle: 'Steps', emoji: '🤖', colour: 'blue', description: 'Choose a direction and put actions in order.', activities: [
    { id: 'step-forward', prompt: 'The star is one space ahead. What should the robot do?', visual: '🤖 → ⭐', helper: 'Look towards the star.', options: ['Move forward', 'Move backward', 'Stop'], answer: 'Move forward', explanation: 'One forward step reaches the star.' },
    { id: 'step-two', prompt: 'There are two empty spaces before the star. Which code reaches it?', visual: '🤖 ⬜ ⬜ ⭐', helper: 'Count the two empty spaces.', options: ['Forward, forward, forward', 'Forward once', 'Turn left'], answer: 'Forward, forward, forward', explanation: 'The robot crosses three spaces to reach the star.' },
    { id: 'step-turn', prompt: 'The robot faces up. The star is on its right. What next?', visual: '⬆️ 🤖   ⭐ ➡️', helper: 'Point your hand towards the star.', options: ['Turn right', 'Turn left', 'Move backward'], answer: 'Turn right', explanation: 'The robot turns right to face the star.' },
    { id: 'step-order', prompt: 'Which order gets ready to draw?', visual: '📄 🖍️ 🎨', helper: 'First get paper, then a crayon.', options: ['Paper, crayon, draw', 'Draw, paper, crayon', 'Crayon, draw, paper'], answer: 'Paper, crayon, draw', explanation: 'An algorithm gives steps in a useful order.' },
    { id: 'step-error', prompt: 'The robot stops before the star. What might help?', visual: '🤖 ⬜ ⭐', helper: 'Think about the missing move.', options: ['Add another forward step', 'Remove every step', 'Turn away'], answer: 'Add another forward step', explanation: 'Checking and fixing steps helps the robot reach its goal.' }
  ]},
  { id: 'robot-parts', title: 'Meet the Robot', shortTitle: 'Robot', emoji: '⚙️', colour: 'gold', description: 'Explore simple robot parts and movement.', activities: [
    { id: 'robot-wheel', prompt: 'Which part can help a robot roll?', visual: '🤖 🛞', helper: 'Look at the round part.', options: ['Wheel', 'Book', 'Cup'], answer: 'Wheel', explanation: 'A wheel can help a robot roll.' },
    { id: 'robot-battery', prompt: 'Which item can give a small robot power?', visual: '🤖 🔋', helper: 'Think about electricity.', options: ['Battery', 'Paper', 'Spoon'], answer: 'Battery', explanation: 'A battery can supply electrical power.' },
    { id: 'robot-sensor', prompt: 'What can help a robot detect an object?', visual: '🤖 📡 📦', helper: 'It helps the robot notice nearby things.', options: ['Sensor', 'Sticker', 'Paint'], answer: 'Sensor', explanation: 'A sensor can detect something nearby.' },
    { id: 'robot-safety', prompt: 'Who should help when building an electrical robot?', visual: '🤖 🧑', helper: 'Ask for supervision.', options: ['A teacher or trusted adult', 'Nobody', 'A small child alone'], answer: 'A teacher or trusted adult', explanation: 'Build and use electrical parts with adult supervision.' },
    { id: 'robot-plan', prompt: 'What should you make before building?', visual: '📝 → 🤖', helper: 'Think about your idea first.', options: ['A simple plan', 'A mess', 'A broken wheel'], answer: 'A simple plan', explanation: 'A plan helps you choose parts and steps.' }
  ]},
  { id: 'online-safety', title: 'Be Safe Online', shortTitle: 'Safety', emoji: '🛡️', colour: 'mint', description: 'Learn simple rules for using devices safely.', activities: [
    { id: 'safety-name', prompt: 'A stranger online asks for your full name. What should you do?', visual: '📱 ❓', helper: 'Keep personal information private.', options: ['Ask a trusted adult', 'Share my full name', 'Send my address'], answer: 'Ask a trusted adult', explanation: 'Ask a trusted adult before sharing personal information.' },
    { id: 'safety-password', prompt: 'Who should help you keep a password safe?', visual: '🔒 🧑', helper: 'Choose someone you trust.', options: ['A trusted parent or caregiver', 'A stranger online', 'Everyone in a game'], answer: 'A trusted parent or caregiver', explanation: 'Keep passwords private with help from a trusted adult.' },
    { id: 'safety-unknown', prompt: 'A strange message appears. What should you do?', visual: '💬 ⚠️', helper: 'Pause before tapping.', options: ['Show a trusted adult', 'Open every link', 'Reply with my address'], answer: 'Show a trusted adult', explanation: 'A trusted adult can help you decide what is safe.' },
    { id: 'safety-photo', prompt: 'Before sharing a photo online, what should you do?', visual: '📷 📱', helper: 'Check with someone who cares for you.', options: ['Ask a trusted adult', 'Send it to strangers', 'Share it everywhere'], answer: 'Ask a trusted adult', explanation: 'Ask a trusted adult before sharing photos online.' },
    { id: 'safety-break', prompt: 'Your eyes feel tired after using a screen. What can you do?', visual: '👀 📱', helper: 'Give your eyes a rest.', options: ['Take a break', 'Keep staring', 'Move closer'], answer: 'Take a break', explanation: 'A break gives your eyes time to rest.' }
  ]},
  { id: 'device-skills', title: 'Use a Device', shortTitle: 'Devices', emoji: '💻', colour: 'pink', description: 'Recognise basic tools and careful device use.', activities: [
    { id: 'device-screen', prompt: 'Which part shows pictures on a computer?', visual: '🖥️', helper: 'Look where you see words and images.', options: ['Screen', 'Chair', 'Desk'], answer: 'Screen', explanation: 'A screen shows words and pictures.' },
    { id: 'device-keyboard', prompt: 'Which tool helps you type letters?', visual: '⌨️', helper: 'It has many letter keys.', options: ['Keyboard', 'Cup', 'Book'], answer: 'Keyboard', explanation: 'A keyboard helps you type.' },
    { id: 'device-tap', prompt: 'How can you choose a picture on a touch screen?', visual: '👆 📱', helper: 'Use a gentle finger.', options: ['Tap it', 'Throw the device', 'Cover the screen'], answer: 'Tap it', explanation: 'Tap gently to choose an item.' },
    { id: 'device-care', prompt: 'What should you keep away from a device?', visual: '💧 💻', helper: 'Liquids can damage it.', options: ['Spilled water', 'Clean hands', 'A safe desk'], answer: 'Spilled water', explanation: 'Keep liquids away from electrical devices.' },
    { id: 'device-ask', prompt: 'The device does something unexpected. What should you do?', visual: '💻 ❓', helper: 'Get help calmly.', options: ['Ask a teacher or trusted adult', 'Hit the screen', 'Pull every cable'], answer: 'Ask a teacher or trusted adult', explanation: 'An adult can help you safely check the device.' }
  ]}
]

export function getGradeOneCodingPath(id?: string) {
  return gradeOneCodingPaths.find(path => path.id === id)
}
