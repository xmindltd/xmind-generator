import { Workbook } from './internal/model/workbook'
import { writeFile } from 'fs'
import { archive } from './internal/archive'
import { readFile } from 'fs/promises'
import { ImageType } from './internal/storage'

export async function saveLocal(workbook: Workbook, pathToDirectory: string) {
  const savePath = suggestFilePath(workbook, pathToDirectory)
  const buffer = await archive(workbook)
  writeFile(savePath, Buffer.from(buffer), err => {
    if (err) throw err
  })
}

export async function readImageFile(filePath: string): Promise<{ data: Buffer; type: ImageType }> {
  const ext = filePath.split('.').pop() as ImageType
  const imageData = await readFile(filePath)
  return { data: imageData, type: ext }
}

function suggestFilePath(workbook: Workbook, pathToDirectory: string): string {
  const name = workbook?.sheets?.[0]?.rootTopic?.title ?? workbook?.sheets?.[0]?.title ?? 'map'
  if (pathToDirectory.endsWith('/')) {
    pathToDirectory = pathToDirectory.slice(0, -1)
  }
  return `${pathToDirectory}/${name}.xmind`
}
