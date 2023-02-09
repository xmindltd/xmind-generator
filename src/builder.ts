import { makeSheetBuilder } from './internal/builder/sheetBuilder'
import { makeTopicBuilder } from './internal/builder/topicBuilder'
import { makeWorkbookBuilder } from './internal/builder/workbookBuilder'
import { Topic, TopicAttributes } from './internal/model/topic'
import { Sheet } from './internal/model/sheet'
import { Workbook } from './internal/model/workbook'
import { Reference } from './internal/builder/ref'

export function topic(title: string, attributes?: TopicBuilderAttributes): TopicBuilder {
  return makeTopicBuilder(title, attributes)
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

export function root(title: string, attributes?: TopicBuilderAttributes): RootBuilder {
  const sheetBuilder = makeSheetBuilder()
  const topicBuilder = makeTopicBuilder(title, attributes)
  sheetBuilder.rootTopic(topicBuilder)
  return {
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

export type TopicBuilderAttributes = { ref?: string } & TopicAttributes
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
  children: (topicBuilders: ReadonlyArray<TopicBuilder>) => this
  summaries: (summaries: ReadonlyArray<SummaryInfo>) => this
  build: () => { topic: Topic; reference: Reference<Topic> }
}
export interface SheetBuilder {
  rootTopic: (topicBuilder: TopicBuilder) => this
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => this
  build: () => Sheet
}
export interface RootBuilder extends Pick<SheetBuilder, 'build'> {
  children: (topicBuilders: ReadonlyArray<TopicBuilder>) => this
  summaries: (summaries: ReadonlyArray<SummaryInfo>) => this
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => this
}
export interface WorkbookBuilder {
  create: (builders: ReadonlyArray<SheetBuilder | RootBuilder>) => this
  build: () => Workbook
}
