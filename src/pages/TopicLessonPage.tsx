import Grade12Revision from '../components/Grade12Revision'
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, Clock3, PlayCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSubject } from '../lib/content'
import { getTopicLesson, getYouTubeEmbedUrl } from '../lib/topic-lessons'
import type { Subject, Topic } from '../types'

export default function TopicLessonPage() {
  const { subjectId, topicId } = useParams()
  const [subject, setSubject] = useState<Subject>()
  const [topic, setTopic] = useState<Topic>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subjectId || !topicId) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    setSubject(undefined)
    setTopic(undefined)
    getSubject(subjectId)
      .then(subjectResult => {
        if (!active) return
        setSubject(subjectResult)
        setTopic(subjectResult?.topics.find(item => item.id === topicId))
      })
      .catch(console.error)
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [subjectId, topicId])

  if (loading) return <div className="adventure-loading"><p>Preparing your lesson...</p></div>
  if (!subjectId || !topicId || !subject || !topic) return <Navigate to="/subjects" replace />

  const lesson = getTopicLesson(subjectId, topicId, topic.name)
  if (!lesson) return <Navigate to={`/subjects/${subjectId}`} replace />

  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl)
  const firstMission = topic.missions[0]

  return (
    <div className="topic-lesson-page narrow">
      <Link className="adventure-back" to={`/subjects/${subjectId}`}><ArrowLeft size={18} /> Back to {subject.name}</Link>

      <header className="lesson-page-heading">
        <span className="lesson-page-icon"><PlayCircle size={27} /></span>
        <div><span className="eyebrow">{embedUrl ? 'VIDEO AND REVISION' : 'WORKED REVISION'}</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div>
      </header>

      <section className="lesson-player-card">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="lesson-player-placeholder"><PlayCircle size={54} /><strong>No video published for this topic</strong><span>Read the worked examples below, then practise with the missions.</span></div>
        )}
      </section>

      {embedUrl && lesson.durationMinutes && <div className="lesson-duration"><Clock3 size={16} /><span>{lesson.durationMinutes} min lesson</span></div>}
      <Grade12Revision subjectId={subjectId} topicId={topicId} />

      <section className="lesson-concepts-card">
        <div className="lesson-concepts-heading"><BookOpenCheck size={21} /><div><span className="eyebrow">WHAT YOU WILL LEARN</span><h2>Key concepts</h2></div></div>
        <ul>{lesson.keyConcepts.map(concept => <li key={concept}><CheckCircle2 size={17} />{concept}</li>)}</ul>
      </section>

      {firstMission && (
        <Link className="button primary full mission-launch" to={`/subjects/${subjectId}/${topicId}/${firstMission.id}`}>
          Start Mission 1 <ArrowRight size={18} />
        </Link>
      )}
    </div>
  )
}
