import { describe, it, expect } from 'vitest'
import { makeImageResourceStorage, ResourceStorage } from './storage'

describe('[internal/storage] makeImageResourceStorage()', () => {
  it('should create a image resource storage', () => {
    const imageStorage = makeImageResourceStorage()
    expect(imageStorage.storage).toBeDefined()
    expect(imageStorage.set).toBeDefined()
    expect(imageStorage.get).toBeDefined()
  })

  it('should set storage value properly', () => {
    const imageStorage = makeImageResourceStorage()
    expect(imageStorage.set(Buffer.from('test'))).toBeTypeOf('string')
    expect(imageStorage.set('data:image/aabbcc')).toBeTypeOf('string')
  })

  it('should get data from storage properly', () => {
    const imageStorage = makeImageResourceStorage()
    const key = imageStorage.set(Buffer.from('test')) ?? ''
    expect((imageStorage.get(key) as Buffer).toString()).toBe('test')
    const key2 = imageStorage.set('data:image/aabbcc') ?? ''
    expect(imageStorage.get(key2)).toBe('data:image/aabbcc')
  })
})
