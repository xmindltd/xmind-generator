import { describe, it, expect } from 'vitest'
import { root, builder } from '../builder'
import { Sheet } from './model/sheet'
import { Topic } from './model/topic'
import { Marker } from './marker'
import { serializeSheet, serializeTopic, serializeWorkbook } from './serializer'
import { makeImageResourceStorage } from './storage'

describe('[serializer] serializeWorkbook', () => {
  it('should serialize a workbook', () => {
    const workbook = builder()
      .create([root('Grill House')])
      .build()
    const serializedWorkbook = serializeWorkbook(workbook, makeImageResourceStorage().set)
    expect(serializedWorkbook).toBeDefined()
    expect(serializedWorkbook.length).toBeGreaterThan(0)
    expect((serializedWorkbook[0]?.rootTopic as any)?.title).toBe('Grill House')
    expect(JSON.stringify(serializedWorkbook)).toBeTypeOf('string')
  })
})

describe('[serializer] serializeSheet', () => {
  it('should serialize a sheet', () => {
    const sheet = new Sheet('sheet')
    const serializedSheet = serializeSheet(sheet, makeImageResourceStorage().set)
    expect(serializedSheet).toBeDefined()
    expect(serializedSheet.title).toBe('sheet')
  })
})

describe('[serializer] serializeTopic', () => {
  it('should serialize a topic', () => {
    const topic = new Topic('topic', { labels: ['this is a label'], markers: [Marker.Smiley.cry] })
    const serializedTopic = serializeTopic(topic, makeImageResourceStorage().set)
    expect(serializedTopic).toBeDefined()
    expect(serializedTopic?.labels).includes('this is a label')
    expect(serializedTopic?.markers?.[0]?.markerId).toBe(Marker.Smiley.cry.id)
  })
})

describe('[serializer] serializeTopic > serializeSummary', () => {
  it('should serialize a topic summary correctly', () => {
    const topic = new Topic('root')
    const childTopic1 = topic.addTopic('child1')
    const childTopic2 = topic.addTopic('child2')
    topic.addSummary('summary', childTopic1.id, childTopic2.id)
    const serializedTopic = serializeTopic(topic, makeImageResourceStorage().set)
    expect(serializedTopic).toBeDefined()
    expect(serializedTopic?.summaries?.[0]?.range).toBe('(0,1)')
    expect((serializedTopic?.children as any).summary[0].title).toBe('summary')
  })
})
