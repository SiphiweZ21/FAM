import { ChevronRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSubjects } from '../lib/content'
import { getLearnerSubjectTargets } from '../lib/learner'
import type { Subject } from '../types'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'ALL' | 'MINE'>('ALL')

  useEffect(() => {
    let active = true

    getSubjects()
      .then(availableSubjects => {
        if (!active) return
        setSubjects(availableSubjects)
      })
      .catch(error => {
        console.error(error)
        if (active) setError('Unable to load FAM subjects.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    getLearnerSubjectTargets()
      .then(selectedSubjects => {
        if (active) setSelectedIds(new Set(selectedSubjects.map(item => item.subjectId)))
      })
      .catch(error => console.error('Unable to load selected subjects:', error))

    return () => { active = false }
  }, [])

  const visibleSubjects = useMemo(() => subjects
    .filter(subject => filter === 'ALL' || selectedIds.has(subject.id))
    .filter(subject => subject.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => Number(selectedIds.has(b.id)) - Number(selectedIds.has(a.id)) || a.name.localeCompare(b.name)), [subjects, selectedIds, query, filter])

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

      <div className="subject-discovery-tools">
        <label className="subject-search"><Search size={18} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search 17 subjects" aria-label="Search subjects" /></label>
        {selectedIds.size > 0 && <div className="subject-filter" aria-label="Subject filters"><button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>All subjects</button><button className={filter === 'MINE' ? 'active' : ''} onClick={() => setFilter('MINE')}>My subjects</button></div>}
      </div>

      <div className="mission-list">
        {visibleSubjects.map(subject => {
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
                {selectedIds.has(subject.id) && <span className="my-subject-badge">MY SUBJECT</span>}
              </div>

              <ChevronRight size={20} />
            </Link>
          )
        })}
        {visibleSubjects.length === 0 && <div className="subjects-empty"><strong>No subjects found</strong><p>Try another search or show all subjects.</p></div>}
      </div>
    </div>
  )
}
