// Summary class model
import { uuid } from '../common'
import { type TopicId } from './topic'

export type SummaryId = string
export class Summary {
  readonly id: SummaryId
  readonly title: string
  readonly from: TopicId | number
  readonly to: TopicId | number

  constructor(title: string, from: TopicId | number, to: TopicId | number) {
    this.id = uuid()
    this.title = title
    this.from = from
    this.to = to
  }

  public isEqualTo(SummaryToCompare: Summary) {
    return [this.from, this.to].every(
      identifier => SummaryToCompare.from === identifier || SummaryToCompare.to === identifier
    )
  }
}
