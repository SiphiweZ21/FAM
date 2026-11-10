import type {ObjectMathActivity} from '../data/grade-one-math'
export function activityAnswer(activity: ObjectMathActivity) {
  return activity.operation === 'addition'
    ? activity.startingQuantity + activity.changeQuantity
    : activity.startingQuantity - activity.changeQuantity
}

export function answerChoices(activity: ObjectMathActivity): number[] {
  const answer = activityAnswer(activity)
  const choices = [Math.max(0, answer - 1), answer, answer + 1]
  return activity.operation === 'addition' ? choices : [...choices].reverse()
}
