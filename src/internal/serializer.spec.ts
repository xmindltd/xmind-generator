import { describe, it, expect } from 'vitest'
import { topic, root, builder, relationship } from '../builder'
import { Sheet } from './model/sheet'
import { Topic } from './model/topic'
import { Workbook } from './model/workbook'
import { serializeSheet, serializeTopic, serializeWorkbook } from './serializer'

describe('[serializer] serializeWorkbook', () => {
  it('should serialize a workbook', () => {
    const workbook = builder()
      .create([root('Grill House', { ref: 'topic:inf' })])
      .build()
    const serializedWorkbook = serializeWorkbook(workbook)
    expect(serializedWorkbook).toBeDefined()
    expect(serializedWorkbook.length).toBeGreaterThan(0)
    expect((serializedWorkbook[0]?.rootTopic as any)?.title).toBe('Grill House')
    expect(JSON.stringify(serializedWorkbook)).toBeTypeOf('string')
  })
})

describe('[serializer] serializeSheet', () => {
  it('should serialize a sheet', () => {
    const sheet = new Sheet('sheet')
    const serializedSheet = serializeSheet(sheet) as any
    expect(serializedSheet).toBeDefined()
    expect(serializedSheet.title).toBe('sheet')
  })
})

describe('[serializer] serializeTopic', () => {
  it('should serialize a topic', () => {
    const topic = new Topic('topic', { labels: ['this is a label'] })
    const serializedTopic = serializeTopic(topic) as any
    expect(serializedTopic).toBeDefined()
    expect(serializedTopic?.labels).includes('this is a label')
  })
})
