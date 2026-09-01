import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSubjects } from '../lib/content'
import type { Subject } from '../types'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .catch(error => {
        console.error(error)
        setError('Unable to load FAM subjects.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="stack-lg">
        <header className="page-header">
          <span className="eyebrow">GRADE 12</span>
          <h1>Subjects</h1>
          <p>Loading your FAM learning content...</p>
        </header>
      </div>
    )
  }

  if (error) {
    return (
      <div className="stack-lg">
        <header className="page-header">
          <h1>Subjects</h1>
          <p>{error}</p>
        </header>
      </div>
    )
  }

  return (
    <div className="stack-lg">
      <header className="page-header">
        <span className="eyebrow">GRADE 12</span>
        <h1>Choose a subject</h1>
        <p>
          Learn, practise and prepare for your Grade 12 exams.
        </p>
      </header>

      <div className="mission-list">
        {subjects.map(subject => {
          const missionCount = subject.topics.reduce(
            (total, topic) => total + topic.missions.length,
            0
          )

          return (
            <Link
              className="mission-card"
              key={subject.id}
              to={`/subjects/${subject.id}`}
            >
              <span className="subject-icon">{subject.emoji}</span>

              <div>
                <h3>{subject.name}</h3>
                <p>
                  {subject.topics.length} topics · {missionCount} missions
                </p>
              </div>

              <ChevronRight size={20} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
