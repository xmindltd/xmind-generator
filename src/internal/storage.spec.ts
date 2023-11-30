import { describe, it, expect } from 'vitest'
import { makeImageResourceStorage } from './storage'

describe('[internal/storage] makeImageResourceStorage()', () => {
  it('should create a image resource storage', () => {
    const imageStorage = makeImageResourceStorage()
    expect(imageStorage.storage).toBeDefined()
    expect(imageStorage.set).toBeDefined()
    expect(imageStorage.get).toBeDefined()
  })

  it('should set storage value properly', async () => {
    const imageStorage = makeImageResourceStorage()
    expect(await imageStorage.set({ name: 'test', data: Buffer.from('test') })).toBeTypeOf('string')
    expect(await imageStorage.set({ name: 'test', data: new ArrayBuffer(0) })).toBeTypeOf('string')
    expect(await imageStorage.set({ name: 'test.png', data: 'data:image/aabbcc' })).is.equal(
      await imageStorage.set({ name: 'test.png', data: 'data:image/aabbcc' })
    )
    const pathname = await imageStorage.set({ name: 'test.jpeg', data: 'data:image/aabbcc' })
    expect(pathname?.split('.')[1]).toBe('jpeg')
    expect(await imageStorage.set({ name: 'test.jpeg', data: 'data:image/aabbcc' })).not.equal(
      await imageStorage.set({ name: 'test.png', data: 'data:image/aabbcc' })
    )
  })

  it('should get data from storage properly', async () => {
    const imageStorage = makeImageResourceStorage()
    const key = (await imageStorage.set({ name: 'test.png', data: Buffer.from('test') })) ?? ''
    expect(key.substring(key.lastIndexOf('.'))).toEqual('.png')
    expect((imageStorage.get(key) as Buffer).toString()).toBe('test')
    const key2 = (await imageStorage.set({ name: 'test', data: 'data:image/aabbcc' })) ?? ''
    expect(key2.lastIndexOf('.')).toBe(-1)
    expect(imageStorage.get(key2)).toBe('data:image/aabbcc')
  })
})
