import { Topic } from '../model/topic'
import { TopicBuilder, TopicBuilderAttributes } from '../../builder'

export function makeTopicBuilder(title: string, attributes?: TopicBuilderAttributes): TopicBuilder {
  const childBuilders: Array<TopicBuilder> = []
  const topicBuilder = {
    children: (builders: ReadonlyArray<TopicBuilder>) => {
      childBuilders.push(...builders)
      return topicBuilder
    },
    build: () => {
      const childTopics: Topic[] = []
      let childRefs: Record<string, Topic> = {}
      childBuilders.forEach(builder => {
        const { topic, refs } = builder.build()
        childTopics.push(topic)
        childRefs = { ...childRefs, ...refs }
      })
      const topic = new Topic(title, attributes, childTopics)
      const refs: Record<string, Topic> = attributes?.ref
        ? { [attributes.ref]: topic, ...childRefs }
        : childRefs
      return { topic, refs }
    }
  }
  return topicBuilder
}
