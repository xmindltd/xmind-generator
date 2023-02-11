import { describe, it, expect, beforeEach } from 'vitest'
import { Workbook } from './model/workbook'
import { archive } from './archive'
import JSZip from 'jszip'
import { asJSONObject } from './serializer'

describe('[archive] archive workbook', () => {
  let unarchived: JSZip

  beforeEach(async () => {
    const workbook = new Workbook()
    workbook.createRoot('Grill House')
    workbook.getSheet(workbook.sheets[0].id)?.rootTopic?.addImage(new ArrayBuffer(0), 'png')

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
