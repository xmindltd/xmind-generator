import { makeSheetBuilder } from './internal/builder/sheetBuilder'
import { makeTopicBuilder } from './internal/builder/topicBuilder'
import { makeWorkbookBuilder } from './internal/builder/workbookBuilder'
import { Topic, TopicAttributes } from './internal/model/topic'
import { Sheet } from './internal/model/sheet'
import { Workbook } from './internal/model/workbook'

export function topic(title: string, attributes?: TopicBuilderAttributes): TopicBuilder {
  return makeTopicBuilder(title, attributes)
}
export function relationship(
  title: string,
  attributes: { from: { ref: string }; to: { ref: string } }
): RelationshipInfo {
  return { title, startTopicRef: attributes.from.ref, endTopicRef: attributes.to.ref }
}
export function sheet(title?: string): SheetBuilder {
  return makeSheetBuilder(title)
}
export function root(title: string, attributes?: TopicBuilderAttributes): RootBuilder {
  const sheetBuilder = makeSheetBuilder()
  const topicBuilder = makeTopicBuilder(title, attributes)
  sheetBuilder.rootTopic(topicBuilder)
  return {
    children: (topicBuilders: ReadonlyArray<TopicBuilder>) => {
      topicBuilder.children(topicBuilders)
      return sheetBuilder
    },
    relationships: sheetBuilder.relationships,
    summaries: sheetBuilder.summaries,
    build: sheetBuilder.build
  }
}
export function builder() {
  return makeWorkbookBuilder()
}

export type TopicBuilderAttributes = { ref?: string } & TopicAttributes
export type RelationshipInfo = {
  title: string
  startTopicRef: string
  endTopicRef: string
}

export interface TopicBuilder {
  children: (topicBuilders: ReadonlyArray<TopicBuilder>) => TopicBuilder
  build: () => { topic: Topic; refs: Record<string, Topic> }
}
export interface SheetBuilder {
  rootTopic: (topicBuilder: TopicBuilder) => SheetBuilder
  relationships: (relationships: ReadonlyArray<RelationshipInfo>) => SheetBuilder // TODO: relationship builder
  summaries: () => SheetBuilder // TODO: summary builder
  build: () => Sheet
}
export interface RootBuilder extends Omit<SheetBuilder, 'rootTopic'> {
  children: (topicBuilders: ReadonlyArray<TopicBuilder>) => SheetBuilder
}
export interface WorkbookBuilder {
  create: (builders: ReadonlyArray<SheetBuilder | RootBuilder>) => WorkbookBuilder
  build: () => Workbook
}
