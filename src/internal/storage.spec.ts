import { describe, it, expect } from 'vitest'
import { makeImageResourceStorage, ResourceStorage } from './storage'

describe('[internal/storage] makeImageResourceStorage()', () => {
  it('should create a image resource storage', () => {
    const imageStorage = makeImageResourceStorage()
    expect(imageStorage.storage).toBeDefined()
    expect(imageStorage.set).toBeDefined()
    expect(imageStorage.get).toBeDefined()
  })

  it('should set storage value properly', async () => {
    const imageStorage = makeImageResourceStorage()
    expect(await imageStorage.set(Buffer.from('test'))).toBeTypeOf('string')
    expect(await imageStorage.set('data:image/aabbcc')).is.equal(
      await imageStorage.set('data:image/aabbcc')
    )
    expect(await imageStorage.set(new ArrayBuffer(0))).toBeTypeOf('string')
  })

  it('should get data from storage properly', async () => {
    const imageStorage = makeImageResourceStorage()
    const key = (await imageStorage.set(Buffer.from('test'))) ?? ''
    expect((imageStorage.get(key) as Buffer).toString()).toBe('test')
    const key2 = (await imageStorage.set('data:image/aabbcc')) ?? ''
    expect(imageStorage.get(key2)).toBe('data:image/aabbcc')
  })
})
