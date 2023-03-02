import { Sheet } from '../model/sheet'
import { RelationshipInfo, SheetBuilder, TopicBuilder } from '../../builder'

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
    build() {
      const { topic: rootTopic, reference, titleReference } = rootTopicBuilder?.build() ?? {}
      const sheet = new Sheet(title, rootTopic)
      relationshipInfos.forEach(({ title, from, to }) => {
        const fromTopicId =
          'ref' in from ? reference.fetch(from.ref).id : titleReference.fetch(from.topic).id
        const toTopicId =
          'ref' in to ? reference.fetch(to.ref).id : titleReference.fetch(to.topic).id
        sheet.addRelationship(title, fromTopicId, toTopicId)
      })
      return sheet
    }
  }
}
