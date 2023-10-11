import { type RefString, Topic, type TopicAttributes, type TopicImageData } from '../model/topic'
import type { SummaryBuilder, SummaryInfo, TopicBuilder } from '../../builder'
import { makeReference, mergeReferences, type Reference } from './ref'
import type { ImageSource, ImageType } from '../storage'
import type { MarkerId } from '../marker'

export function makeTopicBuilder(title: string): Omit<TopicBuilder, 'build'> {
  let _ref: RefString | undefined = undefined
  let _image: TopicImageData | undefined = undefined
  let _note: string | undefined = undefined
  let _markers: Array<MarkerId> = []
  let _labels: Array<string> = []

  const childBuilders: Array<TopicBuilder> = []
  const summaryBuilders: Array<SummaryBuilder> = []

  return {
    ref(ref: RefString) {
      _ref = ref
      return this
    },
    children(builders: ReadonlyArray<TopicBuilder>) {
      childBuilders.push(...builders)
      return this
    },
    image(data: ImageSource, type: ImageType) {
      _image = { data, type }
      return this
    },
    note(newNote: string) {
      _note = newNote
      return this
    },
    labels(labels: ReadonlyArray<string>) {
      _labels.push(...labels)
      return this
    },
    markers(markers: ReadonlyArray<MarkerId>) {
      _markers.push(...markers)
      return this
    },
    summaries(summaries: ReadonlyArray<SummaryBuilder>) {
      summaryBuilders.push(...summaries)
      return this
    },
    build() {
      const childTopics: Topic[] = []
      const childReferences: Reference<Topic>[] = []
      const summaryReferences: Reference<Topic>[] = []
      childBuilders.forEach(builder => {
        const { topic, reference } = builder.build()
        childTopics.push(topic)
        childReferences.push(reference)
      })

      const attributes: TopicAttributes = {
        ref: _ref,
        note: _note,
        markers: _markers,
        labels: _labels
      }

      const topic = new Topic(title, attributes, childTopics)

      if (_image) {
        topic.addImage(_image.data, _image.type)
      }

      let reference = mergeReferences([
        makeReference<Topic>(attributes?.ref ? { [attributes.ref]: topic } : {}),
        makeReference<Topic>({ [topic.title]: topic }),
        ...childReferences,
        ...summaryReferences
      ])

      summaryBuilders.forEach(summaryBuilder => {
        const { info, topic: summaryTopic, reference: summaryReference } = summaryBuilder.build()
        reference = mergeReferences([summaryReference, reference])
        const fromIdentifier =
          typeof info.from === 'number' ? info.from : reference.fetch(info.from).id
        const toIdentifier = typeof info.to === 'number' ? info.to : reference.fetch(info.to).id
        topic.addSummary(info.title, fromIdentifier, toIdentifier, summaryTopic)
      })

      return { topic, reference }
    }
  } as TopicBuilder
}
