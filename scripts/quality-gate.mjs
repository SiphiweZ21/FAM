import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'))
const manifest=read('src/data/fam-lesson-release.json')
const evidence=read(manifest.qualityGate.evidencePath)
const errors=[]
if(evidence.lessonId!==manifest.lessonId||evidence.lessonVersion!==manifest.version) errors.push('Lesson identity/version mismatch')
for(const key of manifest.qualityGate.requiredEvidence){
 const item=evidence.checks[key]
 if(item?.passed!==true||typeof item.evidence!=='string'||item.evidence.trim().length<10) errors.push(`Missing verified evidence: ${key}`)
}
const ai=evidence.independentAiReview
if(!ai?.provider||!ai?.model||!ai?.timestamp||!Number.isFinite(ai?.score)||ai.score<manifest.qualityGate.minimumIndependentAiScore)errors.push('Independent AI review missing or below threshold')
if(ai?.findings?.some(x=>x.severity==='critical'&&!x.resolved))errors.push('Unresolved critical AI findings')
for(const media of ['public/learning-videos/grade4-fractions-guided.mp4','public/learning-videos/grade4-fractions-guided.vtt']){
 if(!fs.existsSync(path.join(root,media)))errors.push(`Missing media: ${media}`)
}
const pass=errors.length===0
console.log(JSON.stringify({lessonId:manifest.lessonId,pass,errors},null,2))
if(process.argv.includes('--publish')){
 if(!pass){console.error('Publication blocked.');process.exit(1)}
 manifest.publicReleaseApproved=true
 manifest.publicationStatus='APPROVED'
 fs.writeFileSync(path.join(root,'src/data/fam-lesson-release.json'),JSON.stringify(manifest,null,2)+'\n')
 console.log('Manifest approved. Commit reviewed evidence and release manifest together.')
}else if(!pass) process.exitCode=1
