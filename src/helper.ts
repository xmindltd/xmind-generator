import { writeFile } from 'fs'
import { readFile } from 'fs/promises'
import { ImageType } from './internal/storage'
import { WorkbookDocument } from './builder'

export async function saveLocal(document: WorkbookDocument, pathToFile: string) {
  const buffer = await document.archive()
  writeFile(pathToFile, Buffer.from(buffer), err => {
    if (err) throw err
  })
}

export async function readImageFile(filePath: string): Promise<{ data: Buffer; type: ImageType }> {
  const ext = filePath.split('.').pop() as ImageType
  const imageData = await readFile(filePath)
  return { data: imageData, type: ext }
}

export function suggestedFilePath(document: WorkbookDocument, pathToDirectory: string): string {
  const workbook = document?.workbook
  const name = workbook?.sheets?.[0]?.rootTopic?.title ?? workbook?.sheets?.[0]?.title ?? 'map'
  if (pathToDirectory.endsWith('/')) {
    pathToDirectory = pathToDirectory.slice(0, -1)
  }
  return `${pathToDirectory}/${name}.xmind`
}
