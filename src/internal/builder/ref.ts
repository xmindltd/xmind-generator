import { Topic, RefString } from '../model/topic'

export type Refs<T> = Record<RefString, T>

export interface Reference<T> {
  refs: Refs<T>
  fetch: (ref: RefString) => T
}

export function makeReference<T>(refs: Refs<T>): Reference<T> {
  return {
    refs,
    fetch(ref: RefString) {
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
