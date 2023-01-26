import jszip from 'jszip'
import { Workbook } from './model/workbook'
import { serializeWorkbook } from './serializer'
import { makeImageResourceStorage } from './storage'

export async function archive(workbook: Workbook) {
  const zip = new jszip()
  const { storage, set } = makeImageResourceStorage()
  const serializedWorkbook = serializeWorkbook(workbook, set)
  const content = JSON.stringify(serializedWorkbook)
  zip.file('content.json', content)
  const resources = zip.folder('resources')
  for (const [path, data] of Object.entries(storage)) {
    resources?.file(path, data)
  }
  return await zip.generateAsync({ type: 'base64' })
}

export async function saveLocal(data: string, pathToDirectory: string) {
  // TODO detect browser or node, save to local xmind file
}

function suggestFilePath(workbook: Workbook, pathToDirectory: string): string {
  const name = workbook?.sheets?.[0]?.rootTopic?.title ?? workbook?.sheets?.[0]?.title ?? 'map'
  if (pathToDirectory.endsWith('/')) {
    pathToDirectory = pathToDirectory.slice(0, -1)
  }
  return `${pathToDirectory}/${name}.xmind`
}
