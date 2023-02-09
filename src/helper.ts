import { Workbook } from './internal/model/workbook'
import { writeFile } from 'fs'
import { archive } from './internal/archive'

export async function saveLocal(workbook: Workbook, pathToDirectory: string) {
  const savePath = suggestFilePath(workbook, pathToDirectory)
  const buffer = await archive(workbook)
  writeFile(savePath, Buffer.from(buffer), err => {
    if (err) throw err
  })
}

function suggestFilePath(workbook: Workbook, pathToDirectory: string): string {
  const name = workbook?.sheets?.[0]?.rootTopic?.title ?? workbook?.sheets?.[0]?.title ?? 'map'
  if (pathToDirectory.endsWith('/')) {
    pathToDirectory = pathToDirectory.slice(0, -1)
  }
  return `${pathToDirectory}/${name}.xmind`
}
