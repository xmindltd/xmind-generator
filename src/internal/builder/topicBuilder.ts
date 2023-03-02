import { RefString, Topic, TopicAttributes, TopicImageData } from '../model/topic'
import { SummaryInfo, TopicBuilder } from '../../builder'
import { makeReference, mergeReferences, Reference } from './ref'
import { ImageSource, ImageType } from '../storage'
import { MarkerId } from '../marker'

export function makeTopicBuilder(title: string): TopicBuilder {
  let _ref: RefString | undefined = undefined
  let _image: TopicImageData | undefined = undefined
  let _note: string | undefined = undefined
  let _markers: Array<MarkerId> = []
  let _labels: Array<string> = []

  const childBuilders: Array<TopicBuilder> = []
  const summaryInfos: Array<SummaryInfo> = []

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
    summaries(summaries: ReadonlyArray<SummaryInfo>) {
      summaryInfos.push(...summaries)
      return this
    },
    build() {
      const childTopics: Topic[] = []
      const childReferences: Reference<Topic>[] = []
      const childTitleReferences: Reference<Topic>[] = []
      childBuilders.forEach(builder => {
        const { topic, reference, titleReference } = builder.build()
        childTopics.push(topic)
        childReferences.push(reference)
        childTitleReferences.push(titleReference)
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

      const reference = mergeReferences([
        makeReference<Topic>(attributes?.ref ? { [attributes.ref]: topic } : {}),
        ...childReferences
      ])

      const titleReference = mergeReferences([
        makeReference<Topic>({ [topic.title]: topic }),
        ...childTitleReferences
      ])

      summaryInfos.forEach(({ title, from, to }) => {
        const fromIdentifier = typeof from === 'number' ? from : reference.fetch(from).id
        const toIdentifier = typeof to === 'number' ? to : reference.fetch(to).id
        topic.addSummary(title, fromIdentifier, toIdentifier)
      })

      return { topic, reference, titleReference }
    }
  }
}
