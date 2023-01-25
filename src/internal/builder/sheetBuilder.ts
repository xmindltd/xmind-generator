import { Sheet } from '../model/sheet'
import { RelationshipInfo, SheetBuilder, TopicBuilder } from '../../builder'

export function makeSheetBuilder(title?: string): SheetBuilder {
  let rootTopicBuilder: TopicBuilder
  const RelationshipInfos: RelationshipInfo[] = []
  const sheetBuilder = {
    rootTopic: (topicBuilder: TopicBuilder) => {
      rootTopicBuilder = topicBuilder
      return sheetBuilder
    },
    relationships: (relationships: ReadonlyArray<RelationshipInfo>) => {
      RelationshipInfos.push(...relationships)
      return sheetBuilder
    },
    summaries: () => sheetBuilder,
    build: () => {
      const { topic: rootTopic, refs = {} } = rootTopicBuilder?.build() ?? {}
      const fetch = (ref: string) => {
        if (typeof refs[ref] === 'undefined') {
          throw new Error(`Missing Ref "${ref}"`)
        }
        return refs[ref]
      }
      const sheet = new Sheet(title, rootTopic)
      RelationshipInfos.forEach(({ title, startTopicRef, endTopicRef }) => {
        sheet.addRelationship(title, fetch(startTopicRef).id, fetch(endTopicRef).id)
      })
      return sheet
    }
  }
  return sheetBuilder
}
