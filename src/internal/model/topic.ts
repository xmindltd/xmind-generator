import { uuid } from './common'

export type TopicId = string
export class Topic {
  readonly id: TopicId
  readonly title: string

  constructor(title: string) {
    this.id = uuid()
    this.title = title
  }
}
