import { TopicImageData } from './model/topic'
import { uuid } from './common'

export type SimpleStorage<K extends string, V> = { [key in K]: V }

export type ResourcePath = string

export type ResourceStorage = SimpleStorage<ResourcePath, TopicImageData>

export type ImageType = 'png' | 'svg' | 'jpeg' | 'jpg' | 'gif' | 'webp'
export type ImageSource = `data:image/${string}` | ArrayBuffer | Buffer | Blob | Uint8Array

export interface ImageResourceStorageHandler {
  storage: ResourceStorage
  set: (data: TopicImageData) => ResourcePath | null
  get: (resourcePath: ResourcePath) => TopicImageData | null
}

export function makeImageResourceStorage(): ImageResourceStorageHandler {
  const resourceStorage: ResourceStorage = {}
  return {
    storage: resourceStorage,
    set: (data: TopicImageData) => {
      const resourcePath = `${uuid()}.${data.type}`
      resourceStorage[resourcePath] = data
      return resourcePath
    },
    get: (resourcePath: ResourcePath) => {
      return resourceStorage[resourcePath] ?? null
    }
  }
}

export function assertImageData(imageData: TopicImageData): boolean {
  // TODO: assert is valid image data
  return true
}

export function imageTypeFromData(imageData: TopicImageData): ImageType | null {
  // TODO: compute image file type from image data
  return assertImageData(imageData) ? 'png' : null
}
