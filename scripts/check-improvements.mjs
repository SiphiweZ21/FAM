import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/data/fam-lesson-release.json'),'utf8'))
const file=path.join(root,`docs/quality-evidence/improvements/${manifest.lessonId}-proposals.json`)
if(!fs.existsSync(file)){console.error('No proposals found. Run the AI reviewer and improvement engine first.');process.exit(2)}
const proposals=JSON.parse(fs.readFileSync(file,'utf8'))
const lesson=fs.readFileSync(path.join(root,'src/pages/InteractiveFractionsPage.tsx'),'utf8')
const captions=fs.readFileSync(path.join(root,'public/learning-videos/grade4-fractions-guided.vtt'),'utf8')
const issues=[]
if(proposals.lessonVersion!==manifest.version||proposals.lessonId!==manifest.lessonId)issues.push('Lesson identity/version mismatch')
for(const [i,c] of proposals.changes.entries()){
 if(!lesson.includes(c.existingText)&&!captions.includes(c.existingText))issues.push(`Change ${i+1}: original text not found; needs manual inspection`)
 if(c.requiresNewMedia)issues.push(`Change ${i+1}: requires video/audio re-rendering`)
}
console.log(JSON.stringify({status:issues.length?'NEEDS_REVIEW':'PROPOSALS_LOCATED_NOT_APPLIED',proposedChanges:proposals.changes.length,issues},null,2))
if(issues.length)process.exitCode=1
