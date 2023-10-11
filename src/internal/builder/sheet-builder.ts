import { Sheet } from '../model/sheet'
import { SheetBuilder, TopicBuilder, RelationshipBuilder } from '../../builder'

export function makeSheetBuilder(title?: string): SheetBuilder {
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
      const { topic: rootTopic, reference } = rootTopicBuilder?.build() ?? {}
      const sheet = new Sheet(title, rootTopic)
      relationshipBuilders.forEach(builder => {
        const { title, from, to } = builder.build()
        sheet.addRelationship(title, reference.fetch(from).id, reference.fetch(to).id)
      })
      return sheet
    }
  }
}
