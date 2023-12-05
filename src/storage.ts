export type ResourcePath = string

export type ResourceData = `data:${string}` | ArrayBuffer | Buffer | Uint8Array

export type NamedResourceData = {
  data: ResourceData
  // Should be a valid file name to prevent possible unexpected behavior
  name: string
}
