import { Topic } from '../model/topic'
import { SummaryInfo, TopicBuilder, TopicBuilderAttributes } from '../../builder'
import { makeReference, mergeReferences, Reference } from './ref'

export function makeTopicBuilder(title: string, attributes?: TopicBuilderAttributes): TopicBuilder {
  const childBuilders: Array<TopicBuilder> = []
  const summaryInfos: Array<SummaryInfo> = []
  return {
    children(builders: ReadonlyArray<TopicBuilder>) {
      childBuilders.push(...builders)
      return this
    },
    summaries(summaries: ReadonlyArray<SummaryInfo>) {
      summaryInfos.push(...summaries)
      return this
    },
    build() {
      const childTopics: Topic[] = []
      const childReferences: Reference<Topic>[] = []
      childBuilders.forEach(builder => {
        const { topic, reference } = builder.build()
        childTopics.push(topic)
        childReferences.push(reference)
      })

      const topic = new Topic(title, attributes, childTopics)
      const reference = mergeReferences([
        makeReference<Topic>(attributes?.ref ? { [attributes.ref]: topic } : {}),
        ...childReferences
      ])
      summaryInfos.forEach(({ title, startRef, endRef }) => {
        topic.addSummary(title, reference.fetch(startRef).id, reference.fetch(endRef).id)
      })

      return { topic, reference }
    }
  }
}
