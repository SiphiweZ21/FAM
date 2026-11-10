import type { GradeOneTopic } from './grade-one-topics'

// Grade 3 Coding and Robotics starter practice for teacher review.
export const gradeThreeCodingPaths: GradeOneTopic[] = [
  { id: 'patterns-and-rules', title: 'Patterns & Rules', shortTitle: 'Patterns', emoji: '🧩', colour: 'purple', description: 'Read repeated rules and spot errors.', activities: [
    { id: 'repeat-colour', prompt: 'What comes next?', visual: '🔴 🔴 🔵 🟡 🔴 🔴 🔵 🟡 ?', helper: 'Repeat the four-colour group.', options: ['🔴', '🔵', '🟡'], answer: '🔴', explanation: 'The group starts with red again.' },
    { id: 'repeat-count', prompt: 'What number follows this rule?', visual: '3 → 6 → 9 → 12 → ?', helper: 'Add three each time.', options: ['15', '14', '18'], answer: '15', explanation: '12 plus 3 is 15.' },
    { id: 'debug-four', prompt: 'Which number breaks the add-four rule?', visual: '4 → 8 → 12 → 15 → 20', helper: 'Count in fours.', options: ['15', '12', '20'], answer: '15', explanation: '16 belongs between 12 and 20.' },
    { id: 'repeat-shapes', prompt: 'What comes after the square?', visual: '⭐ 🔺 🟦 ⭐ 🔺 🟦 ?', helper: 'Find the first shape in the group.', options: ['⭐', '🔺', '🟦'], answer: '⭐', explanation: 'The three-shape pattern starts again with a star.' },
    { id: 'pattern-rule', prompt: 'Which rule describes this pattern?', visual: '🟢 🟢 🟡 🟢 🟢 🟡', helper: 'Count each colour in one group.', options: ['Two green, one yellow', 'One green, two yellow', 'Only green'], answer: 'Two green, one yellow', explanation: 'Two green circles are followed by one yellow circle.' }
  ]},
  { id: 'algorithms-and-debugging', title: 'Algorithms & Debugging', shortTitle: 'Algorithms', emoji: '🧠', colour: 'blue', description: 'Sequence instructions and correct a mistake.', activities: [
    { id: 'algo-order', prompt: 'Which order makes sense for planting a seed?', visual: '🫘 🪴 💧', helper: 'Prepare soil, place the seed, then water.', options: ['Soil, seed, water', 'Water, soil, seed', 'Seed, water, soil'], answer: 'Soil, seed, water', explanation: 'Start with soil, then plant and water the seed.' },
    { id: 'algo-route', prompt: 'From the robot, which program reaches the star?', visual: '🤖 ⬜ ⭐', helper: 'Each right move crosses one space.', options: ['Right, right', 'Right, left', 'Left, left'], answer: 'Right, right', explanation: 'Two right moves reach the star.' },
    { id: 'algo-bug', prompt: 'The robot should go right, then down. Which step is wrong?', visual: 'Goal: ➡️ ⬇️    Code: ➡️ ⬆️', helper: 'Compare the second arrows.', options: ['Up', 'Right', 'Both'], answer: 'Up', explanation: 'Change the second step from up to down.' },
    { id: 'algo-repeat', prompt: 'To move right three times, which repeated command works?', visual: '🤖 ➡️ ➡️ ➡️ ⭐', helper: 'Repeat the same direction three times.', options: ['Repeat right 3 times', 'Repeat left 3 times', 'Repeat up 3 times'], answer: 'Repeat right 3 times', explanation: 'Three right moves reach the star.' },
    { id: 'algo-test', prompt: 'A program misses its goal. What should you do?', visual: '🤖 ❓ ⭐', helper: 'Check the steps and try again.', options: ['Find the wrong step and rerun', 'Give up', 'Add random steps without checking'], answer: 'Find the wrong step and rerun', explanation: 'Testing and fixing a step is debugging.' }
  ]},
  { id: 'robot-input-output', title: 'Robot Input & Output', shortTitle: 'Robot', emoji: '⚙️', colour: 'gold', description: 'Explore sensors, motors and safe tests.', activities: [
    { id: 'robot-sensor', prompt: 'Which part can detect something close to a robot?', visual: '🤖 📦', helper: 'Think about input.', options: ['Distance sensor', 'Sticker', 'Paint'], answer: 'Distance sensor', explanation: 'A distance sensor can detect a nearby object.' },
    { id: 'robot-motor', prompt: 'Which part can turn the wheels?', visual: '🤖 🛞', helper: 'Think about movement.', options: ['Motor', 'Sticker', 'Screen picture'], answer: 'Motor', explanation: 'A motor can turn wheels.' },
    { id: 'robot-power', prompt: 'What can provide power for a small classroom robot?', visual: '🤖 🔋', helper: 'Think of an energy source.', options: ['Battery', 'Dry paper', 'A painted circle'], answer: 'Battery', explanation: 'A battery can supply electrical power.' },
    { id: 'robot-flow', prompt: 'The sensor notices a wall. What can the program tell the motor to do?', visual: '📦 → 🤖', helper: 'Avoid hitting the wall.', options: ['Stop the wheels', 'Move faster into the wall', 'Ignore the sensor'], answer: 'Stop the wheels', explanation: 'A program can use sensor input to stop the motor.' },
    { id: 'robot-safe', prompt: 'Before inspecting the robot’s wires with a teacher, what should happen?', visual: '🤖 ⏻', helper: 'Think about safe handling.', options: ['Turn off the power', 'Pour water on it', 'Pull live wires'], answer: 'Turn off the power', explanation: 'Turn off power before a teacher checks the parts.' }
  ]},
  { id: 'digital-citizenship', title: 'Digital Citizenship', shortTitle: 'Safety', emoji: '🛡️', colour: 'mint', description: 'Make safe and respectful online decisions.', activities: [
    { id: 'safe-location', prompt: 'A game asks you to share where you live. What should you do?', visual: '🎮 🏠', helper: 'Keep personal details private.', options: ['Do not share; tell a trusted adult', 'Share your address', 'Post your location publicly'], answer: 'Do not share; tell a trusted adult', explanation: 'Your home address is private.' },
    { id: 'safe-message', prompt: 'You receive a mean message. What can you do?', visual: '📱 😟', helper: 'Ask for help instead of replying angrily.', options: ['Show a trusted adult', 'Send a mean reply', 'Share it with everyone'], answer: 'Show a trusted adult', explanation: 'A trusted adult can help you respond safely.' },
    { id: 'safe-photo', prompt: 'Before sharing someone else’s photo, what should you do?', visual: '📷 👥', helper: 'Respect their privacy.', options: ['Ask them and a trusted adult', 'Post without asking', 'Send it to strangers'], answer: 'Ask them and a trusted adult', explanation: 'Check consent and ask an adult before sharing.' },
    { id: 'safe-password', prompt: 'Which detail must you keep private?', visual: '🔒', helper: 'It protects your account.', options: ['Password', 'Favourite colour', 'A book title'], answer: 'Password', explanation: 'Do not share passwords with other players.' },
    { id: 'safe-link', prompt: 'An unknown link says you have won a prize. What should you do?', visual: '🔗 🎁', helper: 'Pause and ask for help.', options: ['Ask a trusted adult before opening', 'Tap at once', 'Send it to friends'], answer: 'Ask a trusted adult before opening', explanation: 'Unknown links may not be safe.' }
  ]},
  { id: 'digital-tools', title: 'Digital Tools', shortTitle: 'Tools', emoji: '⌨️', colour: 'pink', description: 'Create, save and correct simple work.', activities: [
    { id: 'tool-type', prompt: 'Which tool can you use to type a story?', visual: '⌨️ 📖', helper: 'Think of letters on keys.', options: ['Keyboard', 'Paintbrush only', 'Ruler only'], answer: 'Keyboard', explanation: 'A keyboard can enter letters.' },
    { id: 'tool-correct', prompt: 'You typed CATTT. Which key can remove extra letters?', visual: '⌫ CATTT', helper: 'Think of the delete key behind the cursor.', options: ['Backspace', 'Space bar', 'Caps Lock'], answer: 'Backspace', explanation: 'Backspace can remove extra letters.' },
    { id: 'tool-space', prompt: 'How can you separate two typed words?', visual: 'GOODMORNING', helper: 'Add a gap.', options: ['Press Space bar', 'Press every letter again', 'Turn off the screen'], answer: 'Press Space bar', explanation: 'The Space bar puts a space between words.' },
    { id: 'tool-save', prompt: 'What should you do before closing your drawing?', visual: '🎨 💾', helper: 'Keep your work.', options: ['Save it with help', 'Delete it without checking', 'Unplug the device'], answer: 'Save it with help', explanation: 'Saving lets you find your drawing later.' },
    { id: 'tool-care', prompt: 'How should you carry a shared tablet?', visual: '📱 🤲', helper: 'Protect the device.', options: ['Hold it carefully with both hands', 'Throw it to a friend', 'Carry it by a cable'], answer: 'Hold it carefully with both hands', explanation: 'Careful carrying helps keep devices safe.' }
  ]}
]

export function getGradeThreeCodingPath(id?: string) {
  return gradeThreeCodingPaths.find(path => path.id === id)
}
