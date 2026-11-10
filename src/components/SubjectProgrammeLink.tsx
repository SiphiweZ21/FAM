import { Link, useLocation } from 'react-router-dom'
import { unitCatalogue } from '../data/term-unit-catalogue'
import { programmeSubjectName } from '../lib/programme-subjects'
export default function SubjectProgrammeLink() {
 const {pathname}=useLocation()
 const match=pathname.replace(/\/$/,'').match(/^\/grades\/grade-(\d+)\/([^/]+)$/)
 if(!match||['mathematics','words'].includes(match[2]))return null
 const grade=Number(match[1]),subject=match[2]
 if(!unitCatalogue.some(u=>u.grade===grade&&u.subject===subject))return null
 return <aside className="term-card"><h2>{programmeSubjectName(subject)} · Learn step by step</h2><p>Read explanations, practise existing activities, then complete a checkpoint. Term placement is a proposed revision sequence.</p><Link className="button secondary" to={`/grades/grade-${grade}/programmes/${subject}/terms/1`}>Open term programme →</Link></aside>
}
