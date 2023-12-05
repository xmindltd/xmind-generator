import { makeSheetBuilder } from './internal/builder/sheet-builder'
import { makeTopicBuilder } from './internal/builder/topic-builder'
import { makeWorkbookBuilder } from './internal/builder/workbook-builder'
import type { RefString, Topic as TopicModel } from './internal/model/topic'
import type { Sheet as SheetModel } from './internal/model/sheet'
import type { Workbook as WorkbookModel } from './internal/model/workbook'
import type { MarkerId } from './marker'
import { archive } from './internal/serializer'
import { makeRelationshipBuilder } from './internal/builder/relationship-builder'
import { asBuilder } from './internal/builder/types'
import type { NamedResourceData } from './storage'

export function Topic(title: string): TopicBuilder {
  return makeTopicBuilder(title)
}

export function Relationship(
  title: string,
  attributes: { from: string; to: string }
): RelationshipBuilder {
  return makeRelationshipBuilder(title, attributes)
}

export function Sheet(title?: string): SheetBuilder {
  return makeSheetBuilder(title)
}

export function Summary(
  title: string,
  attributes: { from: string | number; to: string | number }
): SummaryBuilder {
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
    image(data: NamedResourceData) {
      topicBuilder.image(data)
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
        ...asBuilder<TopicModel>(topicBuilder).build()
      }
    }
  } as SummaryBuilder
}

export function RootTopic(title: string): RootTopicBuilder {
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
    image(data: NamedResourceData) {
      topicBuilder.image(data)
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

    build: asBuilder<SheetModel>(sheetBuilder).build
  } as RootTopicBuilder
}

export function Workbook(rootBuilder: ReadonlyArray<RootTopicBuilder> | RootTopicBuilder) {
  const workbook = asBuilder<WorkbookModel>(
    makeWorkbookBuilder(Array.isArray(rootBuilder) ? rootBuilder : [rootBuilder])
  ).build()
  return {
    archive: () => archive(workbook)
  }
}

export type WorkbookBuilder = {
  archive(): Promise<ArrayBuffer>
}

interface BaseTopicBuilder {
  ref: (ref: RefString) => this
  children: (topicBuilders: ReadonlyArray<TopicBuilder>) => this
  image: (data: NamedResourceData) => this
  note: (newNote: string) => this
  labels: (labels: ReadonlyArray<string>) => this
  markers: (markers: ReadonlyArray<MarkerId>) => this
}
export interface TopicBuilder extends BaseTopicBuilder {
  summaries: (summaries: ReadonlyArray<SummaryBuilder>) => this
}

export interface RootTopicBuilder extends BaseTopicBuilder {
  sheetTitle: (title: string) => this
  relationships: (relationships: ReadonlyArray<RelationshipBuilder>) => this
  summaries: (summaries: ReadonlyArray<SummaryBuilder>) => this
}

export interface SummaryBuilder extends BaseTopicBuilder {}
export interface SheetBuilder {
  rootTopic: (topicBuilder: TopicBuilder) => this
  relationships: (relationships: ReadonlyArray<RelationshipBuilder>) => this
  title: (sheetTitle: string) => this
}

export interface RelationshipBuilder {}
