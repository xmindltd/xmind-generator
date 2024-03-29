import { describe, it, expect } from 'vitest'
import { Workbook } from './workbook'

describe('[internal/model/workbook] constructor', () => {
  it('should have no sheets if workbook created', () => {
    expect(new Workbook().sheets).toHaveLength(0)
  })
})

describe('[internal/model/workbook] createRoot()', () => {
  it('should create a sheet with default name as well as its root topic attached to the workbook', () => {
    const workbook = new Workbook()
    workbook.createRoot('Grill House')
    expect(workbook.sheets).toHaveLength(1)
    expect(workbook.sheets[0].title).toBe('Map 1')
    expect(workbook.sheets[0].rootTopic?.title).toBe('Grill House')
  })
})

describe('[internal/model/workbook] addSheet()', () => {
  it('should create a sheet attached to the workbook', () => {
    const workbook = new Workbook()
    workbook.addSheet('Grill House')
    expect(workbook.sheets).toHaveLength(1)
    expect(workbook.sheets[0].title).toBe('Grill House')
  })
})

describe('[internal/model/workbook] getSheet()', () => {
  it('should get a sheet from workbook properly', () => {
    const workbook = new Workbook()
    const sheet = workbook.addSheet('Grill House')
    expect(workbook.getSheet(sheet.id)).toBe(sheet)
  })
})

describe('[internal/model/workbook] query()', () => {
  it('should return proper topic', () => {
    const workbook = new Workbook()
    const sheet = workbook.addSheet('Grill House')
    const rootTopic = sheet.addRootTopic('Fried Chicken')
    const childTopic = rootTopic.addTopic('Apple juice')
    expect(sheet?.query?.(rootTopic.id)).toBe(rootTopic)
    expect(sheet?.query?.(childTopic.id)).toBe(childTopic)
  })
})
