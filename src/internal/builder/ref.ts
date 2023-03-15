import { RefString, TopicId } from '../model/topic'

export type Refs<T> = Record<RefString | TopicId, T>

export interface Reference<T> {
  refs: Refs<T>
  fetch: (ref: RefString | TopicId) => T
}

export function makeReference<T>(refs: Refs<T>): Reference<T> {
  return {
    refs,
    fetch(ref: RefString | TopicId) {
      if (typeof this.refs[ref] === 'undefined') {
        throw new Error(`Missing Ref "${ref}"`)
      }
      return this.refs[ref]
    }
  }
}

export function mergeReferences<T>(references: ReadonlyArray<Reference<T>>): Reference<T> {
  const refs: Refs<T> = references.reduce((acc, cur) => ({ ...acc, ...cur.refs }), {})
  return makeReference<T>(refs)
}
