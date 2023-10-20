import { Sheet } from '../model/sheet'
import type { SheetBuilder, TopicBuilder, RelationshipBuilder } from '../../builder'
import type { Topic } from '../model/topic'
import { type Reference } from './ref'
import { type RelationshipInfo, asBuilder } from './types'

export function makeSheetBuilder(title?: string) {
  let rootTopicBuilder: TopicBuilder
  const relationshipBuilders: RelationshipBuilder[] = []
  return {
    rootTopic(topicBuilder: TopicBuilder) {
      rootTopicBuilder = topicBuilder
      return this
    },
    relationships(relationships: ReadonlyArray<RelationshipBuilder>) {
      relationshipBuilders.push(...relationships)
      return this
    },
    title(sheetTitle: string) {
      title = sheetTitle
      return this
    },
    build() {
      const { topic: rootTopic, reference } =
        asBuilder<{ topic: Topic; reference: Reference<Topic> }>(rootTopicBuilder)?.build() ?? {}
      const sheet = new Sheet(title, rootTopic)
      relationshipBuilders.forEach(builder => {
        const { title, from, to } = asBuilder<RelationshipInfo>(builder).build()
        sheet.addRelationship(title, reference.fetch(from).id, reference.fetch(to).id)
      })
      return sheet
    }
  } as SheetBuilder
}
