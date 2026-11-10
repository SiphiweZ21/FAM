import type { GradeOneTopic } from './grade-one-topics'

// Introductory Grade 2 Coding and Robotics activities for teacher review.
export const gradeTwoCodingPaths: GradeOneTopic[] = [
  { id: 'patterns-and-debugging', title: 'Patterns & Debugging', shortTitle: 'Patterns', emoji: '🧩', colour: 'purple', description: 'Find rules and fix a wrong step.', activities: [
    { id: 'repeat-three', prompt: 'Which shape comes next?', visual: '🔴 🔵 🟡 🔴 🔵 🟡 ?', helper: 'Find the group of three.', options: ['🔴', '🔵', '🟡'], answer: '🔴', explanation: 'Red, blue, yellow repeats.' },
    { id: 'debug-colours', prompt: 'Which picture breaks the pattern?', visual: '🟦 🟩 🟦 🟩 🟦 🟥', helper: 'Look for two colours taking turns.', options: ['Last red', 'First blue', 'Second green'], answer: 'Last red', explanation: 'The last picture should be green.' },
    { id: 'pattern-fours', prompt: 'What comes after the star?', visual: '🔺 🔺 ⚪ ⭐ 🔺 🔺 ⚪ ⭐ ?', helper: 'The group has four shapes.', options: ['🔺', '⚪', '⭐'], answer: '🔺', explanation: 'The four-shape group starts again with a triangle.' },
    { id: 'debug-number', prompt: 'Which number does not follow the rule?', visual: '2 → 4 → 6 → 9 → 10', helper: 'Count in twos.', options: ['6', '9', '10'], answer: '9', explanation: 'Counting in twos gives 2, 4, 6, 8, 10.' },
    { id: 'pattern-rule', prompt: 'What is the rule?', visual: '🍎 🍌 🍌 🍎 🍌 🍌', helper: 'Look at the repeated group.', options: ['One apple, two bananas', 'Two apples, one banana', 'Only apples'], answer: 'One apple, two bananas', explanation: 'The group is one apple followed by two bananas.' }
  ]},
  { id: 'code-a-route', title: 'Code a Route', shortTitle: 'Route', emoji: '➡️', colour: 'blue', description: 'Give directions in the correct order.', activities: [
    { id: 'route-right', prompt: 'The star is to the right. Which move reaches it?', visual: '🤖 ➡️ ⭐', helper: 'Look at the arrow.', options: ['Right', 'Left', 'Up'], answer: 'Right', explanation: 'Moving right reaches the star.' },
    { id: 'route-down', prompt: 'The star is below the robot. Which move reaches it?', visual: '🤖\n⬇️\n⭐', helper: 'Look below.', options: ['Down', 'Up', 'Left'], answer: 'Down', explanation: 'Moving down reaches the star.' },
    { id: 'route-two', prompt: 'Which two moves reach the star?', visual: '🤖 ⬜ ⭐', helper: 'Cross one empty space first.', options: ['Right, right', 'Left, left', 'Up, up'], answer: 'Right, right', explanation: 'Two right moves reach the star.' },
    { id: 'route-order', prompt: 'What should the robot do first?', visual: 'Start 🤖 → ⬜ → ⭐', helper: 'Begin at the robot.', options: ['Move right', 'Celebrate', 'Stop'], answer: 'Move right', explanation: 'The first step moves the robot towards the star.' },
    { id: 'route-retry', prompt: 'A robot goes left but the star is right. What can you change?', visual: '⬅️ 🤖 ➡️ ⭐', helper: 'Find the wrong instruction.', options: ['Change left to right', 'Add another left', 'Stop trying'], answer: 'Change left to right', explanation: 'Fix the direction and run the code again.' }
  ]},
  { id: 'robot-systems', title: 'Robot Systems', shortTitle: 'Robot', emoji: '⚙️', colour: 'gold', description: 'Learn how parts help a robot sense and move.', activities: [
    { id: 'system-input', prompt: 'Which part might notice a nearby object?', visual: '🤖 📦', helper: 'It senses the environment.', options: ['Sensor', 'Sticker', 'Paint'], answer: 'Sensor', explanation: 'A sensor can detect an object.' },
    { id: 'system-output', prompt: 'Which part helps a wheeled robot move?', visual: '🤖 🛞', helper: 'It turns.', options: ['Motor', 'Book', 'Ribbon'], answer: 'Motor', explanation: 'A motor can turn the wheels.' },
    { id: 'system-power', prompt: 'What can power a small robot?', visual: '🤖 🔋', helper: 'It supplies electricity.', options: ['Battery', 'Paper', 'Water'], answer: 'Battery', explanation: 'A battery supplies electrical power.' },
    { id: 'system-off', prompt: 'Before changing a robot part, what should an adult check?', visual: '🤖 ⏻', helper: 'Think about safe handling.', options: ['The power is off', 'The robot is moving', 'The wires are wet'], answer: 'The power is off', explanation: 'An adult should turn the power off before checking parts.' },
    { id: 'system-test', prompt: 'The robot does not move. What is a sensible next step with a teacher?', visual: '🤖 ❓', helper: 'Check one thing at a time.', options: ['Check the program and power', 'Hit the robot', 'Put water on it'], answer: 'Check the program and power', explanation: 'Checking the program and power helps find a problem.' }
  ]},
  { id: 'digital-safety', title: 'Digital Safety', shortTitle: 'Safety', emoji: '🛡️', colour: 'mint', description: 'Protect personal information and ask for help.', activities: [
    { id: 'safe-address', prompt: 'An online player asks for your home address. What should you do?', visual: '🎮 🏠', helper: 'An address is private.', options: ['Do not share; tell a trusted adult', 'Send the address', 'Post it publicly'], answer: 'Do not share; tell a trusted adult', explanation: 'Keep your address private and tell a trusted adult.' },
    { id: 'safe-link', prompt: 'An unknown link appears in a message. What should you do?', visual: '🔗 ❓', helper: 'Pause before tapping.', options: ['Ask a trusted adult', 'Tap immediately', 'Forward it to friends'], answer: 'Ask a trusted adult', explanation: 'A trusted adult can help check unknown links.' },
    { id: 'safe-photo', prompt: 'Before posting a class photo, what should you do?', visual: '📷 👥', helper: 'Other people are in the picture.', options: ['Ask a teacher or caregiver', 'Post it without asking', 'Send it to strangers'], answer: 'Ask a teacher or caregiver', explanation: 'Ask a trusted adult before sharing photos of others.' },
    { id: 'safe-password', prompt: 'Which information should stay private?', visual: '🔒', helper: 'It opens an account.', options: ['Password', 'Favourite colour', 'A story title'], answer: 'Password', explanation: 'Keep your password private with help from a trusted adult.' },
    { id: 'safe-break', prompt: 'A screen game makes you upset. What can you do?', visual: '📱 😟', helper: 'Take care of your feelings.', options: ['Take a break and speak to an adult', 'Keep playing while upset', 'Throw the device'], answer: 'Take a break and speak to an adult', explanation: 'A break and a conversation can help.' }
  ]},
  { id: 'device-tools', title: 'Device Tools', shortTitle: 'Tools', emoji: '⌨️', colour: 'pink', description: 'Use simple keys and tools carefully.', activities: [
    { id: 'tool-space', prompt: 'Which key puts a space between two words?', visual: '⌨️ A_B', helper: 'Look for the long key.', options: ['Space bar', 'Enter', 'Backspace'], answer: 'Space bar', explanation: 'The space bar makes a gap between words.' },
    { id: 'tool-enter', prompt: 'Which key can start a new line in a text box?', visual: '⌨️ ↵', helper: 'Look for the return arrow.', options: ['Enter', 'Space bar', 'Shift'], answer: 'Enter', explanation: 'Enter can start a new line.' },
    { id: 'tool-backspace', prompt: 'Which key can remove a letter to the left of the cursor?', visual: '⌨️ ⌫', helper: 'Think about correcting a typo.', options: ['Backspace', 'Space bar', 'Enter'], answer: 'Backspace', explanation: 'Backspace removes the previous letter.' },
    { id: 'tool-save', prompt: 'What should you do with your drawing before closing the app?', visual: '🎨 💾', helper: 'Keep your work.', options: ['Save it with help', 'Delete it by mistake', 'Turn off without checking'], answer: 'Save it with help', explanation: 'Saving helps you find your work again.' },
    { id: 'tool-care', prompt: 'How should you use a touchscreen?', visual: '👆 📱', helper: 'Be gentle.', options: ['Tap gently', 'Press with a sharp object', 'Hit the glass'], answer: 'Tap gently', explanation: 'A gentle tap helps protect the screen.' }
  ]}
]

export function getGradeTwoCodingPath(id?: string) {
  return gradeTwoCodingPaths.find(path => path.id === id)
}
