import {useEffect,useState} from 'react'
import './InteractiveDiscovery.css'

type Scene={title:string;steps:string[];question:string;max:number;initial:number;unit:string;explain:(n:number)=>string;render:'stars'|'blocks'|'groups'|'tenths'|'ratio'|'story';story?:string}
const scenes:Record<string,Scene>={
 'g1-number-bonds':{title:'Fill the ten-frame',steps:['Look at the ten spaces.','Six stars are already shining.','Add stars until the frame is full.'],question:'How many more stars do we need?',max:10,initial:6,unit:'stars',render:'stars',explain:n=>`${n} stars are showing. ${10-n} spaces are empty. ${n} + ${10-n} = 10.`},
 'g2-place-value':{title:'Build a number',steps:['Each long rod stands for ten.','Each small cube stands for one.','Change the number of ones and watch the total.'],question:'Explore three tens and some ones',max:9,initial:4,unit:'ones',render:'blocks',explain:n=>`3 tens and ${n} ones make ${30+n}.`},
 'g3-multiplication':{title:'See equal groups',steps:['Multiplication combines equal groups.','Each basket holds four dots.','Add baskets and count the total.'],question:'How many groups of four?',max:5,initial:3,unit:'groups',render:'groups',explain:n=>`${n} groups of 4 = ${n*4} dots.`},
 'g5-decimals':{title:'Paint the tenths',steps:['A whole is divided into ten equal parts.','One painted part means one tenth.','Paint more parts to see a decimal grow.'],question:'How many tenths are painted?',max:10,initial:4,unit:'tenths',render:'tenths',explain:n=>`${n} out of 10 = ${n}/10 = ${(n/10).toFixed(1)}.`},
 'g6-ratios':{title:'Mix red and blue',steps:['A ratio compares two quantities.','Keep two red counters fixed.','Change the blue counters to explore red : blue.'],question:'How many blue counters?',max:8,initial:3,unit:'blue counters',render:'ratio',explain:n=>`There are 2 red and ${n} blue counters. The ratio red : blue is 2 : ${n}.`},
 'g4-reading':{title:'Watch the story unfold',steps:['Lebo looks up and sees dark clouds.','She packs an umbrella in her schoolbag.','Think about what she expects to happen next.'],question:'Which scene should we show?',max:3,initial:1,unit:'scene',render:'story',story:'Lebo sees dark clouds → Lebo packs an umbrella → Rain begins.',explain:n=>['','Dark clouds are a clue that rain may come.','Lebo prepares by packing an umbrella.','Her preparation helps when rain starts.'][n]},
 'g5-reading':{title:'Discover the main idea',steps:['Start with one fact about trees.','Add another supporting fact.','All three details support one big idea.'],question:'How many details can you reveal?',max:3,initial:1,unit:'details',render:'story',story:'Trees give shade → Trees shelter animals → Trees help clean the air.',explain:n=>`You have revealed ${n} supporting ${n===1?'detail':'details'}. Together they show that trees are useful in many ways.`},
 'g6-language':{title:'Cause and effect chain',steps:['Heavy rain is the cause.','Water gathers on the road.','The flooded road is the effect.'],question:'Move through the chain',max:3,initial:1,unit:'stage',render:'story',story:'Heavy rain → Water rises → Road floods.',explain:n=>['','The cause is heavy rain.','Rainwater gathers and rises.','The effect is a flooded road.'][n]},
 'g7-sentences':{title:'Connect two ideas',steps:['First idea: It rained.','Second idea: We played.','Use “but” to show a contrast between them.'],question:'Reveal the sentence',max:3,initial:1,unit:'part',render:'story',story:'It rained → but → we played.',explain:n=>['','“It rained” is the first idea.','“But” tells us the next idea is surprising or different.','“It rained, but we played” expresses contrast.'][n]}
}
export default function InteractiveDiscovery({lessonId,onExplore}:{lessonId:string;onExplore:()=>void}){
 const scene=scenes[lessonId];const [count,setCount]=useState(scene?.initial??1);const [step,setStep]=useState(0);const [playing,setPlaying]=useState(false)
 useEffect(()=>{setCount(scene?.initial??1);setStep(0);setPlaying(false)},[lessonId,scene])
 useEffect(()=>{if(!playing||!scene)return;const timer=window.setInterval(()=>setStep(s=>{if(s>=scene.steps.length-1){setPlaying(false);return s}return s+1}),2200);return()=>window.clearInterval(timer)},[playing,scene])
 if(!scene)return null
 const cells=(n:number,active:number)=>Array.from({length:n},(_,i)=><span key={i} className={`fam-discovery-cell ${i<active?'filled':''}`} aria-hidden="true"/>)
 return <section className="fam-discovery" aria-label="Interactive animated demonstration">
  <div className="fam-discovery-heading"><span>🎬 Animated discovery · Explore before practising</span><h2>{scene.title}</h2></div>
  <div className="fam-discovery-stage">
   <div className="fam-discovery-step" aria-live="polite"><strong>Step {step+1} of {scene.steps.length}</strong><p>{scene.steps[step]}</p></div>
   <div className="fam-discovery-controls"><button onClick={()=>{setStep(0);setPlaying(true)}}>▶ Play</button><button onClick={()=>setPlaying(false)} disabled={!playing}>Ⅱ Pause</button><button onClick={()=>{setPlaying(false);setStep(s=>(s+1)%scene.steps.length)}}>Next step →</button></div>
   <div className="fam-discovery-visual" role="img" aria-label={scene.explain(count)}>
    {scene.render==='stars'&&<div className="fam-discovery-ten">{cells(10,count)}</div>}
    {scene.render==='blocks'&&<div className="fam-discovery-blocks"><div className="fam-discovery-rods">{[0,1,2].map(i=><span key={i}>10</span>)}</div><div className="fam-discovery-small">{cells(9,count)}</div></div>}
    {scene.render==='groups'&&<div className="fam-discovery-groups">{Array.from({length:count},(_,i)=><div key={i} className="fam-discovery-group">● ●<br/>● ●</div>)}</div>}
    {scene.render==='tenths'&&<div className="fam-discovery-tenths">{cells(10,count)}</div>}
    {scene.render==='ratio'&&<div className="fam-discovery-ratio"><div>🔴 🔴</div><div>{Array.from({length:count},(_,i)=><span key={i}>🔵 </span>)}</div></div>}
    {scene.render==='story'&&<div className="fam-discovery-story">{scene.steps.slice(0,count).map((s,i)=><div className="fam-discovery-story-card" key={i}><span>{['①','②','③'][i]}</span>{s}</div>)}</div>}
   </div>
   <label className="fam-discovery-label" htmlFor={`fam-explore-${lessonId}`}>{scene.question}: <strong>{count} {scene.unit}</strong></label>
   <input id={`fam-explore-${lessonId}`} type="range" min={scene.render==='story'?1:0} max={scene.max} value={count} onChange={e=>{setCount(Number(e.target.value));onExplore()}} />
   <div className="fam-discovery-adjust"><button onClick={()=>{setCount(v=>Math.max(scene.render==='story'?1:0,v-1));onExplore()}} disabled={count<=(scene.render==='story'?1:0)}>− Less</button><button onClick={()=>{setCount(v=>Math.min(scene.max,v+1));onExplore()}} disabled={count>=scene.max}>+ More</button></div>
   <p className="fam-discovery-explanation" aria-live="polite">💡 {scene.explain(count)}</p>
  </div>
 </section>
}
