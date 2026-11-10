import { unitCatalogue } from '../data/term-unit-catalogue'
import manifest from './grade-premium-manifest.json'
export const gradeSubjects: Record<string, Array<{id:string;title:string}>> = manifest
export function gradePathPolicy(pathname:string) {
  const path=pathname.replace(/\/$/,'')
  const unitMatch=path.match(/^\/grades\/grade-(\d+)\/programmes\/([^/]+)\/terms\/([1-4])\/units\/([^/]+)$/)
  if(unitMatch){const unit=unitCatalogue.find(u=>u.grade===Number(unitMatch[1])&&u.subject===unitMatch[2]&&u.term===Number(unitMatch[3])&&u.id===unitMatch[4]);if(unit)return {premium:unit.access==='PREMIUM',title:unit.title,back:path.slice(0,path.lastIndexOf('/units/'))}}
  if (['/grades/grade-1/mathematics/addition','/grades/grade-1/mathematics/number-mission'].includes(path)) return {premium:true,title:'Add & Subtract',back:'/grades/grade-1/mathematics'}
  const match=path.match(/^(\/grades\/grade-\d+\/[^/]+)\/practice\/([^/]+)$/)
  if (!match) return null
  const topics=gradeSubjects[match[1]], topic=topics?.find(item=>item.id===match[2])
  if (!topic) return null
  return {premium:topic.id!==topics[0].id,title:topic.title,back:match[1]}
}
export function safeLearningReturn(value:string|null) {
  return value && value.startsWith('/') && !value.startsWith('//') && !/[\\\r\n]/.test(value) && (/^\/grades\//.test(value)||/^\/subjects\//.test(value)||/^\/quiz\//.test(value)) ? value : null
}
