import { uuid } from '../common'
import { Topic, TopicId } from './topic'
import { Relationship } from './relationship'

export type SheetId = string
export class Sheet {
  readonly title: string
  readonly id: SheetId
  private _rootTopic: Topic | null
  private _relationships: Relationship[]

  constructor(title?: string, rootTopic?: Topic) {
    this.id = uuid()
    this.title = title ?? ''
    this._rootTopic = rootTopic ?? null
    this._relationships = []
  }

  get rootTopic(): Readonly<Topic | null> {
    return this._rootTopic
  }

  get relationships(): ReadonlyArray<Relationship> {
    return this._relationships
  }

  query(topicId: TopicId): Topic | null {
    return this._rootTopic?.query(topicId) ?? null
  }

  public addRootTopic(title: string): Topic {
    if (this._rootTopic) {
      throw new Error('Duplicated root topic creation')
    }
    this._rootTopic = new Topic(title)
    return this._rootTopic
  }

  public removeRootTopic(): void {
    this._rootTopic = null
  }

  public addRelationship(title: string, from: TopicId, to: TopicId): Relationship {
    const relationship = new Relationship(title, from, to)
    this._relationships.push(relationship)
    return relationship
  }
}
