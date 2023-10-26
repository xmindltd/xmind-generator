export type ResourcePath = string

export type ResourceData = `data:${string}` | ArrayBuffer | Buffer | Uint8Array

export type NamedResourceData = { data: ResourceData; name: string }
