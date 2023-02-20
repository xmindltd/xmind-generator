import { makeSheetBuilder } from './internal/builder/sheetBuilder'
import { makeTopicBuilder } from './internal/builder/topicBuilder'
import { makeWorkbookBuilder } from './internal/builder/workbookBuilder'
import { RefString, Topic, TopicAttributes, TopicImageData } from './internal/model/topic'
import { Sheet } from './internal/model/sheet'
import { Workbook } from './internal/model/workbook'
import { Reference } from './internal/builder/ref'
import { ImageSource, ImageType } from './internal/storage'
import { MarkerId } from './internal/marker'

export function topic(title: string): TopicBuilder {
  return makeTopicBuilder(title)
}
export function relationship(
  title: string,
  attributes: { from: { ref: string }; to: { ref: string } }
): RelationshipInfo {
  return { title, fromRef: attributes.from.ref, toRef: attributes.to.ref }
}

export function summary(
  title: string,
  attributes: { start: { ref: string }; end: { ref: string } }
): SummaryInfo {
  return { title, startRef: attributes.start.ref, endRef: attributes.end.ref }
}

export function sheet(title?: string): SheetBuilder {
  return makeSheetBuilder(title)
}

export function root(title: string): RootBuilder {
  let _ref: RefString | undefined = undefined
  const sheetBuilder = makeSheetBuilder()
  const topicBuilder = makeTopicBuilder(title)
  sheetBuilder.rootTopic(topicBuilder)
  return {
    ref(ref: RefString) {
      topicBuilder.ref(ref)
      return this
    },
    children(topicBuilders: ReadonlyArray<TopicBuilder>) {
      topicBuilder.children(topicBuilders)
      return this
    },
    summaries(summaries: ReadonlyArray<SummaryInfo>) {
      topicBuilder.summaries(summaries)
      return this
    },
    relationships(relationships: ReadonlyArray<RelationshipInfo>) {
      sheetBuilder.relationships(relationships)
      return this
    },
    build: sheetBuilder.build
  }
}

export function builder() {
  return makeWorkbookBuilder()
}

export type TopicBuilderAttributes = TopicAttributes
export type RelationshipInfo = {
  title: string
  fromRef: string
  toRef: string
}
export type SummaryInfo = {
  title: string
  startRef: string
  endRef: string
}

export interface TopicBuilder {
  ref: (ref: RefString) => this
  children: (topicBuilders: ReadonlyArray<TopicBuilder>) => this
  image: (data: ImageSource, type: ImageType) => this
  note: (newNote: string) => this
  labels: (labels: ReadonlyArray<string>) => this
  markers: (markers: ReadonlyArray<MarkerId>) => this
  summaries: (summaries: ReadonlyArray<SummaryInfo>) => this
  build: () => { topic: Topic; reference: Reference<Topic> }
}
export interface SheetBuilder {
  rootTopic: (topicBuilder: TopicBuilder) => this
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => this
  build: () => Sheet
}
export interface RootBuilder extends Pick<SheetBuilder, 'build'> {
  ref: (ref: RefString) => this
  children: (topicBuilders: ReadonlyArray<TopicBuilder>) => this
  summaries: (summaries: ReadonlyArray<SummaryInfo>) => this
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => this
}
export interface WorkbookBuilder {
  create: (builders: ReadonlyArray<SheetBuilder | RootBuilder>) => this
  build: () => Workbook
}
