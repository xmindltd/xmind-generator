import jszip from 'jszip'
import { Workbook } from './model/workbook'
import { asJSONObject, serializeWorkbook } from './serializer'
import { makeImageResourceStorage } from './storage'

export async function archive(workbook: Workbook): Promise<ArrayBuffer> {
  const zip = new jszip()

  const { storage, set } = makeImageResourceStorage()
  const serializedWorkbook = serializeWorkbook(workbook, set)
  const content = JSON.stringify(serializedWorkbook)
  zip.file('content.json', content)

  const metadata = asJSONObject({ creator: { name: 'xmind-generator' } })
  zip.file('metadata.json', JSON.stringify(metadata))

  const resources = zip.folder('resources')
  const resourcePaths = []
  for (const [path, data] of Object.entries(storage)) {
    resources?.file(path, data.data)
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
