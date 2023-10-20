export function asBuilder<T>(whatever: unknown): Builder<T> {
  return whatever as unknown as Builder<T>
}
export interface Builder<T> {
  build: () => T
}

export type RelationshipInfo = {
  title: string
  from: string
  to: string
}
export type SummaryInfo = {
  title: string
  from: string | number
  to: string | number
}
