import { uuid } from './common'
import { TopicId } from './topic'

export type RelationshipId = string
export class Relationship {
  readonly id: RelationshipId
  readonly title: string
  readonly fromTopicId: string
  readonly toTopicId: string

  constructor(title: string, fromTopicId: TopicId, toTopicId: TopicId) {
    this.id = uuid()
    this.title = title
    this.fromTopicId = fromTopicId
    this.toTopicId = toTopicId
  }
}
