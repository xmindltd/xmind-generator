import { uuid } from './common'

export type RelationshipId = string
export class Relationship {
  readonly id: RelationshipId
  readonly title: string
  readonly startTopicId: string
  readonly endTopicId: string

  constructor(title: string, startTopicId: string, endTopicId: string) {
    this.id = uuid()
    this.title = title
    this.startTopicId = startTopicId
    this.endTopicId = endTopicId
  }
}
