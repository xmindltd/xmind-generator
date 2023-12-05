import type { RelationshipBuilder } from '../../builder'

export function makeRelationshipBuilder(
  title: string,
  attributes: { from: string; to: string }
): RelationshipBuilder {
  return {
    build() {
      return { title, from: attributes.from, to: attributes.to }
    }
  }
}
