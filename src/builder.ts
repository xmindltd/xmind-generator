import { makeSheetBuilder } from './internal/builder/sheetBuilder'
import { makeTopicBuilder } from './internal/builder/topicBuilder'
import { makeWorkbookBuilder } from './internal/builder/workbookBuilder'
import { RefString, Topic } from './internal/model/topic'
import { Sheet } from './internal/model/sheet'
import { Workbook } from './internal/model/workbook'
import { Reference } from './internal/builder/ref'
import { ImageSource, ImageType } from './internal/storage'
import { MarkerId } from './internal/marker'

export function topic(title: string): TopicBuilder {
  return makeTopicBuilder(title)
}

export type TopicSelector = { readonly ref: string } | { readonly title: string }

export function relationship(
  title: string,
  attributes: { from: TopicSelector; to: TopicSelector }
): RelationshipInfo {
  return { title, from: attributes.from, to: attributes.to }
}

export function summary(
  title: string,
  attributes: { from: string | number; to: string | number }
): SummaryInfo {
  return { title, from: attributes.from, to: attributes.to }
}

export function sheet(title?: string): SheetBuilder {
  return makeSheetBuilder(title)
}

export function root(title: string): RootBuilder {
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
    image(data: ImageSource, type: ImageType) {
      topicBuilder.image(data, type)
      return this
    },
    note(newNote: string) {
      topicBuilder.note(newNote)
      return this
    },

    labels(labels: ReadonlyArray<string>) {
      topicBuilder.labels(labels)
      return this
    },
    markers(markers: ReadonlyArray<MarkerId>) {
      topicBuilder.markers(markers)
      return this
    },

    build: sheetBuilder.build
  }
}

export function builder() {
  return makeWorkbookBuilder()
}

export function generateWorkbook(rootBuilder: ReadonlyArray<RootBuilder> | RootBuilder): Workbook {
  return builder()
    .create(Array.isArray(rootBuilder) ? rootBuilder : [rootBuilder])
    .build()
}

export type RelationshipInfo = {
  title: string
  from: TopicSelector
  to: TopicSelector
}
export type SummaryInfo = {
  title: string
  from: string | number
  to: string | number
}

interface BaseTopicBuilder<T> {
  ref: (ref: RefString) => T
  children: (topicBuilders: ReadonlyArray<TopicBuilder>) => T
  image: (data: ImageSource, type: ImageType) => T
  note: (newNote: string) => T
  labels: (labels: ReadonlyArray<string>) => T
  markers: (markers: ReadonlyArray<MarkerId>) => T
  summaries: (summaries: ReadonlyArray<SummaryInfo>) => T
}
export interface TopicBuilder extends BaseTopicBuilder<TopicBuilder> {
  build: () => { topic: Topic; reference: Reference<Topic>; titleReference: Reference<Topic> }
}

export interface RootBuilder extends BaseTopicBuilder<RootBuilder> {
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => this
  build: () => Sheet
}
export interface SheetBuilder {
  rootTopic: (topicBuilder: TopicBuilder) => this
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => this
  build: () => Sheet
}
export interface WorkbookBuilder {
  create: (builders: ReadonlyArray<SheetBuilder | RootBuilder>) => this
  build: () => Workbook
}
