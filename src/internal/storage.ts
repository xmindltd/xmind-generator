import { NamedResourceData, ResourceData, ResourcePath } from '../storage'

export type SimpleStorage<K extends string, V> = { [key in K]: V }

export type ResourceStorage = SimpleStorage<ResourcePath, ResourceData>

export interface ImageResourceStorageHandler {
  storage: ResourceStorage
  set: (data: NamedResourceData) => Promise<ResourcePath | null>
  get: (resourcePath: ResourcePath) => ResourceData | null
}

export function makeImageResourceStorage(): ImageResourceStorageHandler {
  const resourceStorage: ResourceStorage = {}
  return {
    storage: resourceStorage,
    set: async (resource: NamedResourceData) => {
      const resourcePath = await computeResourcePath(resource)
      resourceStorage[resourcePath] = resource.data
      return resourcePath
    },
    get: (resourcePath: ResourcePath) => {
      return resourceStorage[resourcePath] ?? null
    }
  }
}

export async function computeResourcePath(resource: NamedResourceData) {
  const hash = await generateSHA256Hash(resource.data)
  const extname = fileExtname(resource.name)
  return extname ? `${hash}.${extname}` : hash
}

function fileExtname(filePath: string) {
  return filePath.split('.').pop()
}

async function generateSHA256Hash(data: ResourceData) {
  if (typeof window !== 'undefined' && typeof crypto !== 'undefined') {
    const encoder = new TextEncoder()
    const dataBuffer = typeof data === 'string' ? encoder.encode(data) : data

    return crypto.subtle.digest('SHA-256', dataBuffer).then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
      return hashHex
    })
  } else {
    const crypto = await import('crypto')
    const hash = crypto.createHash('sha256')

    if (data instanceof ArrayBuffer) {
      const textDecoder = new TextDecoder('utf-8')
      const text = textDecoder.decode(data)
      hash.update(text)
    } else {
      hash.update(Buffer.from(data))
    }

    return hash.digest('hex')
  }
}
