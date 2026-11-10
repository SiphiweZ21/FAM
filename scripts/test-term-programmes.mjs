import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import {stripTypeScriptTypes} from 'node:module'
function load(file,names,globals={}){const source=stripTypeScriptTypes(fs.readFileSync(file,'utf8').replace(/export \{[^\n]+\n/g,''),{mode:'transform'}).replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'');const out={};vm.runInNewContext(source+'\n'+names.map(n=>`out.${n}=${n};`).join(''),{out,...globals});return out}
const {freeTermUnits}=load('src/data/free-term-units.ts',['freeTermUnits'])
const {countingUnit:u,findLearningUnit}=load('src/data/term-programmes.ts',['countingUnit','findLearningUnit'],{freeTermUnits})
const storage=new Map();const {unitStorageKey,readUnitProgress,emptyUnitProgress,checkpointScore,reviewDue}=load('src/lib/unit-progress.ts',['unitStorageKey','readUnitProgress','emptyUnitProgress','checkpointScore','reviewDue'],{localStorage:{getItem:k=>storage.get(k)}})
assert.equal(findLearningUnit(1,'mathematics',1,u.id).access,'FREE');assert.equal(findLearningUnit(2,'mathematics',1,u.id),undefined)
const all=[...u.guided,...u.practice,...u.checkpoint,...u.review];assert.equal(new Set(all.map(q=>q.id)).size,all.length);for(const q of all){assert(q.options.includes(q.count));assert.equal(new Set(q.options).size,q.options.length);assert(q.count>=0&&q.count<=10)}
const key=unitStorageKey('account-a','child-a',u);assert.notEqual(key,unitStorageKey('account-b','child-a',u));assert.notEqual(key,unitStorageKey('account-a','child-b',u))
const p={...emptyUnitProgress(u),phase:'checkpoint',index:2,checkpointAnswers:{c1:9,c2:0}};storage.set(key,JSON.stringify(p));assert.equal(readUnitProgress(key,u).index,2);assert.equal(checkpointScore(u,readUnitProgress(key,u)),2);assert.equal(readUnitProgress(null,u).phase,'teach');assert.equal(readUnitProgress(unitStorageKey('other',null,u),u).phase,'teach')
storage.set(key,'broken');assert.equal(readUnitProgress(key,u).phase,'teach');storage.set(key,JSON.stringify({...p,version:999}));assert.equal(readUnitProgress(key,u).phase,'teach');storage.set(key,JSON.stringify({...p,index:1000,checkpointAnswers:{c1:999}}));assert.equal(readUnitProgress(key,u).index,4);assert.equal(checkpointScore(u,readUnitProgress(key,u)),0)
assert.equal(reviewDue({...p,completedAt:new Date(0).toISOString()},86400000),true);assert.equal(reviewDue({...p,completedAt:new Date(0).toISOString()},100),false)
console.log('Term programme checks passed: unit answers, route matching, resume, account/learner isolation, corrupt/versioned storage and delayed review.')
