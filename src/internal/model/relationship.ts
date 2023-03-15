import { uuid } from '../common'
import { TopicId } from './topic'

export type RelationshipId = string
export class Relationship {
  readonly id: RelationshipId
  readonly title: string
  readonly fromTopicId: TopicId
  readonly toTopicId: TopicId

  constructor(title: string, from: TopicId, to: TopicId) {
    this.id = uuid()
    this.title = title
    this.fromTopicId = from
    this.toTopicId = to
  }
}
