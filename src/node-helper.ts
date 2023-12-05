import type { WorkbookBuilder } from './builder'
import type { NamedResourceData } from './storage'

export async function writeLocalFile(workbook: WorkbookBuilder, pathToFile: string) {
  const { writeFile } = await import('fs')
  const buffer = await workbook.archive()
  writeFile(pathToFile, Buffer.from(buffer), err => {
    if (err) throw err
  })
}

export async function readImageFile(filePath: string): Promise<NamedResourceData> {
  const { readFile } = await import('fs/promises')
  const filerBuffer = await readFile(filePath)
  const path = await import('path')
  return { data: filerBuffer, name: path.basename(filePath) }
}
