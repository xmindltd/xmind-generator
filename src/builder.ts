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
import { makeRelationshipBuilder } from './internal/builder/relationship-builder'

export function generateTopic(title: string): Omit<TopicBuilder, 'build'> {
  return makeTopicBuilder(title)
}

export function generateRelationship(
  title: string,
  attributes: { from: string; to: string }
): Omit<RelationshipBuilder, 'build'> {
  return makeRelationshipBuilder(title, attributes)
}

export function generateSheet(title?: string): SheetBuilder {
  return makeSheetBuilder(title)
}

export function generateSummary(
  title: string,
  attributes: { from: string | number; to: string | number }
): Omit<SummaryBuilder, 'build'> {
  const topicBuilder = makeTopicBuilder(title)
  return {
    ref(ref: RefString) {
      topicBuilder.ref(ref)
      return this
    },
    children(topicBuilders: ReadonlyArray<TopicBuilder>) {
      topicBuilder.children(topicBuilders)
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
    build: () => {
      return {
        info: { title, from: attributes.from, to: attributes.to },
        ...(topicBuilder as TopicBuilder).build()
      }
    }
  } as SummaryBuilder
}

export function generateRoot(title: string): Omit<RootBuilder, 'build'> {
  const sheetBuilder = makeSheetBuilder()
  const topicBuilder = makeTopicBuilder(title)
  sheetBuilder.rootTopic(topicBuilder as TopicBuilder)
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
    summaries(summaries: ReadonlyArray<SummaryBuilder>) {
      topicBuilder.summaries(summaries)
      return this
    },
    relationships(relationships: ReadonlyArray<RelationshipBuilder>) {
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
  } as RootBuilder
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
}
export interface TopicBuilder extends BaseTopicBuilder<TopicBuilder> {
  summaries: (summaries: ReadonlyArray<SummaryBuilder | Omit<SummaryBuilder, 'build'>>) => this
  build: () => { topic: Topic; reference: Reference<Topic> }
}

export interface RootBuilder extends BaseTopicBuilder<RootBuilder> {
  sheetTitle: (title: string) => this
  relationships: (
    relationships: ReadonlyArray<RelationshipBuilder | Omit<RelationshipBuilder, 'build'>>
  ) => this
  summaries: (summaries: ReadonlyArray<SummaryBuilder | Omit<SummaryBuilder, 'build'>>) => this
  build: () => Sheet
}

export interface SummaryBuilder extends BaseTopicBuilder<SummaryBuilder> {
  build: () => { info: SummaryInfo; topic: Topic; reference: Reference<Topic> }
}
export interface SheetBuilder {
  rootTopic: (topicBuilder: TopicBuilder) => this
  relationships: (relationships: ReadonlyArray<RelationshipBuilder>) => this
  title: (sheetTitle: string) => this
  build: () => Sheet
}

export interface RelationshipBuilder {
  build: () => RelationshipInfo
}
export interface WorkbookBuilder {
  create: (builders: ReadonlyArray<SheetBuilder | RootBuilder>) => this
  build: () => Workbook
}
