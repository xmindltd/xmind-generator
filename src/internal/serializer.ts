import jszip from 'jszip'
import type { Relationship } from './model/relationship'
import type { Sheet } from './model/sheet'
import type { Summary } from './model/summary'
import type { Topic } from './model/topic'
import type { Workbook } from './model/workbook'
import { ResourceData, makeImageResourceStorage } from './storage'

type JSONValue = string | number | boolean | JSONObject | Array<JSONValue>

type JSONObject = { [x: string]: JSONValue }

export function asJSONObject(whatever: unknown): JSONObject {
  if (typeof whatever === 'object' && whatever !== null && !Array.isArray(whatever)) {
    return whatever as JSONObject
  }
  throw new Error(`Not a JSON object: ${JSON.stringify(whatever)}`)
}

export function asJSONArray(whatever: unknown): Array<JSONValue> {
  if (Array.isArray(whatever)) {
    return whatever as Array<JSONValue>
  }
  throw new Error(`Not a JSON array: ${JSON.stringify(whatever)}`)
}

const resourceIdPrefix = 'xap:resources/'

export async function serializeWorkbook(
  workbook: Workbook,
  imageResourceSetter: (imageData: ResourceData) => Promise<string | null>
): Promise<ReadonlyArray<JSONObject>> {
  return await Promise.all(
    workbook.sheets.map(async sheet => serializeSheet(sheet, imageResourceSetter))
  )
}

export async function serializeSheet(
  sheet: Sheet,
  imageResourceSetter: (imageData: ResourceData) => Promise<string | null>
): Promise<Readonly<JSONObject>> {
  const obj: JSONObject = {
    id: sheet.id,
    class: 'sheet',
    title: sheet.title ?? ''
  }
  if (sheet.rootTopic) {
    obj.rootTopic = await serializeTopic(sheet.rootTopic, imageResourceSetter)
  }
  if (sheet.relationships.length > 0) {
    obj.relationships = sheet.relationships.map(relationship => serializeRelationship(relationship))
  }
  return obj
}

export async function serializeTopic(
  topic: Topic | Readonly<Topic>,
  imageResourceSetter: (imageData: ResourceData) => Promise<string | null>
): Promise<Readonly<JSONObject>> {
  const obj: JSONObject = {
    id: topic.id,
    class: 'topic',
    title: topic.title ?? ''
  }
  const { note, labels, image, markers, summaries } = topic

  if (note) {
    obj.notes = {
      plain: { content: note + '\n' }
    }
  }

  if (labels.length > 0) {
    obj.labels = [...labels]
  }

  if (topic.children.length > 0) {
    obj.children = {
      attached: await Promise.all(
        topic.children.map(async child => serializeTopic(child, imageResourceSetter))
      )
    }
  }

  if (image) {
    const resourcePath = await imageResourceSetter(image)
    if (resourcePath) {
      obj.image = {
        src: resourceIdPrefix + resourcePath
      }
    }
  }

  if (markers.length > 0) {
    obj.markers = markers.map(marker => ({ markerId: marker.id }))
  }

  if (summaries.length > 0) {
    const summaryTopics: Array<JSONObject> = []
    for (const summary of summaries) {
      const serializedSummary = serializeSummaryInfo(topic, summary)
      if (serializedSummary) {
        obj.summaries = [
          ...asJSONArray(obj.summaries ?? []),
          asJSONObject({ ...serializedSummary, topicId: summary.summaryTopic.id })
        ]
        summaryTopics.push(await serializeTopic(summary.summaryTopic, imageResourceSetter))
      }
    }

    if (summaryTopics.length > 0) {
      obj.children = {
        ...asJSONObject(obj.children ?? {}),
        summary: summaryTopics
      }
    }
  }

  return obj
}

export function serializeRelationship(relationship: Relationship): Readonly<JSONObject> {
  return {
    id: relationship.id,
    class: 'relationship',
    end1Id: relationship.fromTopicId,
    end2Id: relationship.toTopicId,
    title: relationship.title ?? ''
  }
}

export function serializeSummaryInfo(
  topic: Readonly<Topic>,
  summary: Summary
): Readonly<JSONObject> | null {
  const { id, from, to } = summary
  const rangeStart =
    typeof from === 'number' ? from : topic.children.findIndex(child => child.query(from))
  const rangeEnd = typeof to === 'number' ? to : topic.children.findIndex(child => child.query(to))
  if (rangeStart < 0 || rangeEnd < 0) {
    return null
  }
  const range = [rangeStart, rangeEnd].sort()
  return {
    id,
    class: 'summary',
    range: `(${range.join(',')})`
  }
}

export async function archive(workbook: Workbook): Promise<ArrayBuffer> {
  const zip = new jszip()

  const { storage, set } = makeImageResourceStorage()
  const serializedWorkbook = await serializeWorkbook(workbook, set)
  const content = JSON.stringify(serializedWorkbook)
  zip.file('content.json', content)

  const metadata = asJSONObject({ creator: { name: 'xmind-generator' }, dataStructureVersion: '2' })
  zip.file('metadata.json', JSON.stringify(metadata))

  const resources = zip.folder('resources')
  const resourcePaths = []
  for (const [path, data] of Object.entries(storage)) {
    resources?.file(path, data)
    resourcePaths.push(`resources/${path}`)
  }

  zip.file(
    'manifest.json',
    JSON.stringify({
      'file-entries': {
        'content.json': {},
        'metadata.json': {},
        ...Object.fromEntries(new Map(resourcePaths.map(path => [path, {}])))
      }
    })
  )

  return await zip.generateAsync({ type: 'arraybuffer', compression: 'STORE' })
}
