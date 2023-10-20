export type SimpleStorage<K extends string, V> = { [key in K]: V }

export type ResourcePath = string

export type ResourceData = `data:${string}` | ArrayBuffer | Buffer | Uint8Array

export type ResourceStorage = SimpleStorage<ResourcePath, ResourceData>

export interface ImageResourceStorageHandler {
  storage: ResourceStorage
  set: (data: ResourceData) => Promise<ResourcePath | null>
  get: (resourcePath: ResourcePath) => ResourceData | null
}

export function makeImageResourceStorage(): ImageResourceStorageHandler {
  const resourceStorage: ResourceStorage = {}
  return {
    storage: resourceStorage,
    set: async (data: ResourceData) => {
      const resourcePath = await generateSHA1Hash(data)
      resourceStorage[resourcePath] = data
      return resourcePath
    },
    get: (resourcePath: ResourcePath) => {
      return resourceStorage[resourcePath] ?? null
    }
  }
}

async function generateSHA1Hash(data: ResourceData) {
  if (typeof window !== 'undefined' && typeof crypto !== 'undefined') {
    const encoder = new TextEncoder()
    const dataBuffer = typeof data === 'string' ? encoder.encode(data) : data

    return crypto.subtle.digest('SHA-1', dataBuffer).then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
      return hashHex
    })
  } else {
    const crypto = require('crypto')
    const hash = crypto.createHash('sha1')
    if (data instanceof ArrayBuffer) {
      const textDecoder = new TextDecoder('utf-8') // 使用适当的编码
      const text = textDecoder.decode(data)
      hash.update(text)
    } else {
      hash.update(Buffer.from(data))
    }
    return hash.digest('hex')
  }
}
