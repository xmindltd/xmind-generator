import { makeSheetBuilder } from './internal/builder/sheet-builder'
import { makeTopicBuilder } from './internal/builder/topic-builder'
import { makeWorkbookBuilder } from './internal/builder/workbook-builder'
import type { RefString, Topic } from './internal/model/topic'
import type { Sheet } from './internal/model/sheet'
import type { Workbook } from './internal/model/workbook'
import type { Reference } from './internal/builder/ref'
import type { ImageSource, ImageType } from './internal/storage'
import type { MarkerId } from './internal/marker'
import { archive } from './internal/archive'

export function generateTopic(title: string): TopicBuilder {
  return makeTopicBuilder(title)
}

export function generateRelationship(
  title: string,
  attributes: { from: string; to: string }
): RelationshipInfo {
  return { title, from: attributes.from, to: attributes.to }
}

export function generateSummary(
  title: string,
  attributes: { from: string | number; to: string | number }
): SummaryInfo {
  return { title, from: attributes.from, to: attributes.to }
}

export function sheet(title?: string): SheetBuilder {
  return makeSheetBuilder(title)
}

export function generateRoot(title: string): RootBuilder {
  const sheetBuilder = makeSheetBuilder()
  const topicBuilder = makeTopicBuilder(title)
  sheetBuilder.rootTopic(topicBuilder)
  return {
    ref(ref: RefString) {
      topicBuilder.ref(ref)
      return this
    },
    sheetTitle(title: string) {
      sheetBuilder.title(title)
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

export function generateWorkbook(
  rootBuilder: ReadonlyArray<RootBuilder> | RootBuilder
): WorkbookDocument {
  const workbook = builder()
    .create(Array.isArray(rootBuilder) ? rootBuilder : [rootBuilder])
    .build()
  return {
    workbook,
    archive: () => archive(workbook)
  }
}

export type RelationshipInfo = {
  title: string
  from: string
  to: string
}
export type SummaryInfo = {
  title: string
  from: string | number
  to: string | number
}

export type WorkbookDocument = {
  workbook: Workbook
  archive(): Promise<ArrayBuffer>
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
  build: () => { topic: Topic; reference: Reference<Topic> }
}

export interface RootBuilder extends BaseTopicBuilder<RootBuilder> {
  sheetTitle: (title: string) => this
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => this
  build: () => Sheet
}
export interface SheetBuilder {
  rootTopic: (topicBuilder: TopicBuilder) => this
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => this
  title: (sheetTitle: string) => this
  build: () => Sheet
}
export interface WorkbookBuilder {
  create: (builders: ReadonlyArray<SheetBuilder | RootBuilder>) => this
  build: () => Workbook
}
