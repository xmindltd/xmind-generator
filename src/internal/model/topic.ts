import { uuid } from './common'

export type TopicId = string
export type TopicAttributes = { labels?: string[]; notes?: string[] }
export class Topic {
  readonly id: TopicId
  readonly title: string
  readonly attributes: TopicAttributes
  private _children: Topic[]

  constructor(title: string, attributes?: TopicAttributes, children?: Topic[]) {
    this.id = uuid()
    this.title = title
    this.attributes = attributes ?? {}
    this._children = children ?? []
  }

  get children(): ReadonlyArray<Topic> {
    return this._children
  }

  public addTopic(title: string, attributes?: TopicAttributes): Topic {
    const childTopic = new Topic(title, attributes)
    this._children.push(childTopic)
    return childTopic
  }

  public removeTopic(topicId: TopicId) {
    this._children = this._children.filter(child => child.id !== topicId)
  }
}
