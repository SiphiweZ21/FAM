export type PlannedSubject = {id:string;title:string}
const junior: PlannedSubject[] = [
 {id:'science',title:'Natural Sciences'}, {id:'social-sciences',title:'Social Sciences'},
 {id:'technology',title:'Technology'}, {id:'ems',title:'Economic and Management Sciences'},
 {id:'life-orientation',title:'Life Orientation'}, {id:'creative-arts',title:'Creative Arts'},
 {id:'coding',title:'Coding and Robotics'}
]
const senior: PlannedSubject[] = [
 {id:'physical-sciences',title:'Physical Sciences'}, {id:'life-sciences',title:'Life Sciences'},
 {id:'accounting',title:'Accounting'}, {id:'business-studies',title:'Business Studies'},
 {id:'economics',title:'Economics'}, {id:'geography',title:'Geography'}, {id:'history',title:'History'},
 {id:'information-technology',title:'Information Technology'},
 {id:'computer-applications-technology',title:'Computer Applications Technology'},
 {id:'life-orientation',title:'Life Orientation'}, {id:'mathematical-literacy',title:'Mathematical Literacy'}
]
export function plannedSubjectsForGrade(grade:number): PlannedSubject[] {
 return grade===8||grade===9?junior:grade===10||grade===11?senior:[]
}
export function findPlannedSubject(grade:number,subject:string) {
 return plannedSubjectsForGrade(grade).find(s=>s.id===subject)
}
