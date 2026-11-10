import { Link, useParams } from 'react-router-dom'
import { getGrade } from '../lib/grades'
import { findPlannedSubject } from '../data/planned-subjects'
export default function PlannedSubjectPage() {
 const {gradeId,subjectId=''}=useParams()
 const grade=getGrade(gradeId),subject=grade&&findPlannedSubject(grade.number,subjectId)
 if(!grade||!subject)return <section className="info-card"><h1>Subject not found</h1><Link to={grade?`/grades/${grade.id}`:'/'}>Choose a subject</Link></section>
 return <div className="stack-lg"><Link className="grade-back-link" to={`/grades/${grade.id}`}>← Back to {grade.name}</Link><header className="page-header"><span className="eyebrow">{grade.name}</span><h1>{subject.title}</h1><p>Content being prepared</p></header><section className="info-card"><h2>Lessons are not available yet</h2><p>We’re preparing suitable learning resources for this subject. This page has no lessons, practice questions or assessments yet.</p><p>This subject is not currently included as available Premium learning content. Subject choices may differ by school.</p><Link className="button primary" to={`/grades/${grade.id}/programmes/mathematics/terms/1`}>Explore available Maths</Link> <Link className="button secondary" to={`/grades/${grade.id}/programmes/words/terms/1`}>Explore available English</Link></section></div>
}
