import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/pages/StoryStudio.tsx',import.meta.url),'utf8');
const csv=fs.readFileSync(new URL('../docs/FAM-BATCH10-CONTENT-REVIEW.csv',import.meta.url),'utf8');
const ids=[...source.matchAll(/'(g\d+-[a-z-]+)':\[/g)].map(m=>m[1]);
const missing=ids.filter(id=>!csv.split('\n').some(line=>line.startsWith(id+',')));
if(!ids.length||missing.length){console.error('Missing story IDs:',missing);process.exit(1)}
console.log(`Validated ${ids.length} stories against review register; educator approval pending.`);
