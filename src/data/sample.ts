import type { Subject } from '../types'

const questions = [
  {
    id: 'q1',
    prompt: 'In which direction do mid-latitude cyclones generally move across South Africa?',
    options: ['East to west', 'West to east', 'North to south', 'South to north'],
    answer: 1,
    explanation: 'Mid-latitude cyclones are steered by the westerly wind belt and usually move from west to east.'
  },
  {
    id: 'q2',
    prompt: 'Which front usually brings a sudden drop in temperature?',
    options: ['Warm front', 'Cold front', 'Stationary front', 'Occluded high'],
    answer: 1,
    explanation: 'A cold front marks the leading edge of colder air and commonly causes a noticeable temperature drop.'
  },
  {
    id: 'q3',
    prompt: 'Where are mid-latitude cyclones most commonly found?',
    options: ['Near the equator', 'Between 30° and 60° latitude', 'Only above deserts', 'Only over oceans'],
    answer: 1,
    explanation: 'They typically develop in the mid-latitudes, roughly between 30° and 60° in both hemispheres.'
  }
]

export const subjects: Subject[] = [
  {
    id: 'geography',
    name: 'Geography',
    emoji: '🌍',
    description: 'Climate, geomorphology, settlements, economic geography and mapwork.',
    topics: [
      {
        id: 'mid-latitude-cyclones',
        name: 'Mid-Latitude Cyclones',
        missions: [
          {
            id: 'meet-the-cyclone',
            title: 'Meet the Cyclone',
            description: 'Learn the structure, movement and key features of a mid-latitude cyclone.',
            premium: false,
            questions
          },
          {
            id: 'cold-fronts',
            title: 'Cold Fronts',
            description: 'Revise weather changes before, during and after a cold front.',
            premium: true,
            questions
          }
        ]
      }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    emoji: '📐',
    description: 'Functions, calculus, algebra, geometry, trigonometry and more.',
    topics: [
      {
        id: 'functions',
        name: 'Functions',
        missions: [
          {
            id: 'functions-foundations',
            title: 'Functions Foundations',
            description: 'Revise domain, range, intercepts and transformations.',
            premium: true,
            questions
          }
        ]
      }
    ]
  },
  {
    id: 'physical-sciences',
    name: 'Physical Sciences',
    emoji: '⚛️',
    description: 'Physics and chemistry revision built around exam-style practice.',
    topics: [
      {
        id: 'momentum-impulse',
        name: 'Momentum & Impulse',
        missions: [
          {
            id: 'momentum-basics',
            title: 'Momentum Basics',
            description: 'Build confidence with momentum, impulse and conservation laws.',
            premium: true,
            questions
          }
        ]
      }
    ]
  }
]
