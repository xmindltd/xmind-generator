import { uuid } from './common'
import { Topic } from './topic'

export class Sheet {
  readonly title: string
  readonly id: string
  private _rootTopic: Topic | null = null

  constructor(title: string) {
    this.id = uuid()
    this.title = title
  }

  get rootTopic(): Topic | null {
    return this._rootTopic
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
}
