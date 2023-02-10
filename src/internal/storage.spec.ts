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
    expect(imageStorage.set({ data: Buffer.from('test'), type: 'jpg' })).toBeTypeOf('string')
    expect(imageStorage.set({ data: 'data:image/aabbcc', type: 'png' })).toBeTypeOf('string')
  })

  it('should get data from storage properly', () => {
    const imageStorage = makeImageResourceStorage()
    const key = imageStorage.set({ data: Buffer.from('test'), type: 'png' }) ?? ''
    expect((imageStorage.get(key)?.data as Buffer).toString()).toBe('test')
    const key2 = imageStorage.set({ data: 'data:image/aabbcc', type: 'png' }) ?? ''
    expect(imageStorage.get(key2)?.data).toBe('data:image/aabbcc')
  })
})
