import { TopicImageData } from './model/topic'
import { uuid } from './common'
import imageType from 'image-type'

export type SimpleStorage<K extends string, V> = { [key in K]: V }

export type ResourcePath = string

export type ResourceStorage = SimpleStorage<ResourcePath, TopicImageData>

export type ImageType = 'png' | 'svg' | 'jpeg' | 'jpg' | 'gif' | 'webp'

export interface ImageResourceStorageHandler {
  storage: ResourceStorage
  set: (data: TopicImageData) => ResourcePath | null
  get: (resourcePath: ResourcePath) => TopicImageData | null
}

export function makeImageResourceStorage(): ImageResourceStorageHandler {
  const resourceStorage: ResourceStorage = {}
  return {
    storage: resourceStorage,
    set: (data: TopicImageData, type?: ImageType) => {
      const imageType = type ?? imageTypeFromData(data)
      if (!imageType) {
        return null
      }
      const resourcePath = `${uuid()}.${imageType}`
      resourceStorage[resourcePath] = data
      return resourcePath
    },
    get: (resourcePath: ResourcePath) => {
      return resourceStorage[resourcePath] ?? null
    }
  }
}

export async function imageTypeFromData(imageData: TopicImageData): Promise<ImageType | null> {
  let type: string

  if (typeof imageData === 'string') {
    type = imageData.substring('data:image/'.length, imageData.indexOf(';base64'))
  } else {
    let buffer
    if (imageData instanceof Blob) {
      buffer = Buffer.from(await imageData.arrayBuffer())
    } else if (imageData instanceof ArrayBuffer) {
      buffer = Buffer.from(imageData)
    } else {
      buffer = imageData
    }
    type = (await imageType(Buffer.from(buffer)))?.ext ?? 'png'
  }

  if (type === 'png' || type === 'svg' || type === 'jpeg' || type === 'jpg' || type === 'gif' || type === 'webp') {
    return type
  }

  return null
}
