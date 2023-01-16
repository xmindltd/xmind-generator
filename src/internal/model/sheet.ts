import { Topic } from './topic'

export class Sheet {
  private rootTopic: Topic
  readonly title: string

  constructor(title: string) {
    this.title = title
    this.rootTopic = new Topic(title)
  }

  get topic() : Topic {
    return this.rootTopic
  }
}