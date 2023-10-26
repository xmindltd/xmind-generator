import JSZip from 'jszip'
import { describe, it, expect, beforeEach } from 'vitest'
import { Root, RootTopicBuilder } from '../builder'
import { Sheet } from './model/sheet'
import { Topic } from './model/topic'
import { Marker } from './marker'
import { Workbook } from './model/workbook'
import { makeWorkbookBuilder } from './builder/workbook-builder'
import {
  archive,
  serializeSheet,
  serializeTopic,
  serializeWorkbook,
  asJSONObject
} from './serializer'
import { makeImageResourceStorage } from './storage'
import { asBuilder } from './builder/types'

describe('[serializer] serializeWorkbook', () => {
  it('should serialize a workbook', async () => {
    const workbook = asBuilder<Workbook>(
      makeWorkbookBuilder([Root('Grill House') as RootTopicBuilder])
    ).build()
    const serializedWorkbook = await serializeWorkbook(workbook, makeImageResourceStorage().set)
    expect(serializedWorkbook).toBeDefined()
    expect(serializedWorkbook.length).toBeGreaterThan(0)
    expect((serializedWorkbook[0]?.rootTopic as any)?.title).toBe('Grill House')
    expect(JSON.stringify(serializedWorkbook)).toBeTypeOf('string')
  })
})

describe('[serializer] serializeSheet', () => {
  it('should serialize a sheet', async () => {
    const sheet = new Sheet('sheet')
    const serializedSheet = await serializeSheet(sheet, makeImageResourceStorage().set)
    expect(serializedSheet).toBeDefined()
    expect(serializedSheet.title).toBe('sheet')
  })
})

describe('[serializer] serializeTopic', () => {
  it('should serialize a topic', async () => {
    const topic = new Topic('topic', { labels: ['this is a label'], markers: [Marker.Smiley.cry] })
    const serializedTopic = await serializeTopic(topic, makeImageResourceStorage().set)
    expect(serializedTopic).toBeDefined()
    expect(serializedTopic?.labels).includes('this is a label')
    expect(serializedTopic?.markers?.[0]?.markerId).toBe(Marker.Smiley.cry.id)
  })
})

describe('[serializer] serializeTopic > serializeSummary', () => {
  it('should serialize a topic summary correctly', async () => {
    const topic = new Topic('root')
    const childTopic1 = topic.addTopic('child1')
    const childTopic2 = topic.addTopic('child2')
    topic.addSummary('summary', childTopic1.id, childTopic2.id, new Topic('summary'))
    const serializedTopic = await serializeTopic(topic, makeImageResourceStorage().set)
    expect(serializedTopic).toBeDefined()
    expect(serializedTopic?.summaries?.[0]?.range).toBe('(0,1)')
    expect((serializedTopic?.children as any).summary[0].title).toBe('summary')
  })
})

describe('[archive] archive workbook', () => {
  let unarchived: JSZip

  beforeEach(async () => {
    const workbook = new Workbook()
    workbook.createRoot('Grill House')
    workbook
      .getSheet(workbook.sheets[0].id)
      ?.rootTopic?.addImage({ name: 'test', data: new ArrayBuffer(0) })

    const archived = await archive(workbook)

    const jzip = new JSZip()
    unarchived = await jzip.loadAsync(archived)
  })

  it('should archive content.json, metadata.json and manifest.json', async () => {
    expect(unarchived.file('content.json')).not.toBeNull()
    expect(unarchived.file('metadata.json')).not.toBeNull()
    expect(unarchived.file('manifest.json')).not.toBeNull()
  })

  it('should contain creator in metadata.json', async () => {
    const metadata = await unarchived.file('metadata.json')?.async('text')
    const metadataJson = metadata && asJSONObject(JSON.parse(metadata))
    expect(metadataJson).toHaveProperty('creator')
    expect(Object.keys(metadataJson?.['creator'])).toEqual(['name'])
  })

  it('should contain file-entries in manifest.json', async () => {
    const manifest = await unarchived.file('manifest.json')?.async('text')
    const manifestJson = manifest && asJSONObject(JSON.parse(manifest))
    const fileEntries = manifestJson?.['file-entries']
    expect(Object.keys(fileEntries)).contain('content.json')
    expect(Object.keys(fileEntries)).contain('metadata.json')
  })

  it('should contain resources path in manifest.json', async () => {
    const manifest = await unarchived.file('manifest.json')?.async('text')
    const manifestJson = manifest && asJSONObject(JSON.parse(manifest))
    const fileEntries = manifestJson?.['file-entries']

    delete fileEntries['content.json']
    delete fileEntries['metadata.json']

    expect(Object.keys(fileEntries).length).toBe(1)
    expect(Object.keys(fileEntries)[0]).toMatch(/resources/)
  })
})
