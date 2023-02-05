// Summary class model
import { uuid } from './common'
import { TopicId } from './topic'

export type SummaryId = string
export class Summary {
  readonly id: SummaryId
  readonly title: string
  readonly startTopicId: string
  readonly endTopicId: string

  constructor(title: string, startTopicId: TopicId, endTopicId: TopicId) {
    this.id = uuid()
    this.title = title
    this.startTopicId = startTopicId
    this.endTopicId = endTopicId
  }

  public isEqualTo(SummaryToCompare: Summary) {
    return [this.startTopicId, this.endTopicId].every(
      id => SummaryToCompare.startTopicId === id || SummaryToCompare.endTopicId === id
    )
  }
}
