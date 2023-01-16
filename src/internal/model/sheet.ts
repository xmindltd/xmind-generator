import { Topic } from './topic'

export class Sheet {
  private rootTopic: Topic

  constructor(title: string) {
    this.rootTopic = new Topic(title)
  }

  get topic() : Topic {
    return this.rootTopic
  }
}