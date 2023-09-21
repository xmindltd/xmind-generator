import { Sheet } from '../model/sheet'
import { type RelationshipInfo, SheetBuilder, TopicBuilder } from '../../builder'

export function makeSheetBuilder(title?: string): SheetBuilder {
  let rootTopicBuilder: TopicBuilder
  const relationshipInfos: RelationshipInfo[] = []
  return {
    rootTopic(topicBuilder: TopicBuilder) {
      rootTopicBuilder = topicBuilder
      return this
    },
    relationships(relationships: ReadonlyArray<RelationshipInfo>) {
      relationshipInfos.push(...relationships)
      return this
    },
    title(sheetTitle: string) {
      title = sheetTitle
      return this
    },
    build() {
      const { topic: rootTopic, reference } = rootTopicBuilder?.build() ?? {}
      const sheet = new Sheet(title, rootTopic)
      relationshipInfos.forEach(({ title, from, to }) =>
        sheet.addRelationship(title, reference.fetch(from).id, reference.fetch(to).id)
      )
      return sheet
    }
  }
}
