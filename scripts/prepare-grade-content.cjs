const ts=require('typescript'),fs=require('fs'),vm=require('vm'),path=require('path');
const nums={one:1,two:2,three:3,four:4,five:5,six:6,seven:7};
let imports=[],rows=[],previews=[],manifest={},freeContent={};
for(const file of fs.readdirSync('src/data').filter(x=>x.startsWith('grade-')&&x.endsWith('.ts'))){
 const match=file.match(/^grade-(one|two|three|four|five|six|seven)-(.*)\.ts$/); if(!match)continue;
 const source=fs.readFileSync('src/data/'+file,'utf8'), names=[...source.matchAll(/export const (\w+)/g)].map(m=>m[1]);
 const mod={exports:{}};const stripped=require('node:module').stripTypeScriptTypes(source,{mode:'transform'}).replace(/export /g,'');
 vm.runInNewContext(stripped+'\n'+names.map(n=>`exports.${n}=${n};`).join('\n'),{exports:mod.exports,module:mod,require});
 for(const [name,value] of Object.entries(mod.exports)){if(!Array.isArray(value))continue;
 const subject={math:'mathematics',topics:'mathematics',words:'words'}[match[2]]||match[2],base=`/grades/grade-${nums[match[1]]}/${subject}`;
 imports.push(`import { ${name} } from '../src/data/${file.slice(0,-3)}'`);
 if(name==='gradeOneNumberMission'){rows.push(`'/grades/grade-1/mathematics/number-mission': {id:'number-mission', title:'Add & Subtract', activities:${name}}`);previews.push(`export const ${name} = {length:${value.length}}`);continue;}
 manifest[base]=value.map(v=>({id:v.id,title:v.title}));
 freeContent[base+'/practice/'+value[0].id]=value[0];
 rows.push(...value.map(v=>`${JSON.stringify(base+'/practice/'+v.id)}: ${name}.find(v=>v.id===${JSON.stringify(v.id)})!`));
 previews.push(`export const ${name} = ${JSON.stringify(value.map(({activities,...v},index)=>({...v,access:index===0?'FREE':'PREMIUM',activities:{length:activities.length}})))}`);
 }
}
fs.writeFileSync('src/data/free-grade-content.json',JSON.stringify(freeContent));
fs.writeFileSync('src/lib/grade-premium-manifest.json',JSON.stringify(manifest,null,2));
fs.writeFileSync('src/data/grade-previews.ts',previews.join('\n')+'\n');
fs.writeFileSync('worker/grade-content.ts',imports.join('\n')+'\nexport const gradeContent:Record<string,unknown> = {\n'+rows.join(',\n')+'\n}\n');
console.log(Object.keys(manifest).length+' subjects, '+rows.length+' server learning paths');
