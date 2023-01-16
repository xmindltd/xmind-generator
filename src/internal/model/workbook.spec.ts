import { describe, it, expect } from 'vitest'
import { Workbook } from './workbook'

describe('[internal/model/workbook] constructor', () => {
  it('should have no sheets if workbook created', () => {
    expect(new Workbook().sheets).toHaveLength(0)
  })
})


describe('[internal/model/workbook] addRoot()', () => {
  it('should create a sheet attached to the workbook', () => {
    const workbook = new Workbook()
    workbook.createRoot('Grill House')
    expect(workbook.sheets).toHaveLength(1)
    expect(workbook.sheets[0].title).toBe('Grill House')
    expect(workbook.sheets[0].topic.title).toBe('Grill House')
  })

  it('should throw exception if workbook already have sheets', () => {
    const workbook = new Workbook()
    workbook.createRoot('Grill House')

    expect(() => workbook.createRoot('Another Grill House')).toThrowError('Duplicated root topic creation')
  })
})