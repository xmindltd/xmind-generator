import { writeFile } from 'fs'
import { readFile } from 'fs/promises'
import type { WorkbookBuilder } from './builder'
import type { NamedResourceData } from './storage'

export async function writeLocalFile(workbook: WorkbookBuilder, pathToFile: string) {
  const buffer = await workbook.archive()
  writeFile(pathToFile, Buffer.from(buffer), err => {
    if (err) throw err
  })
}

export async function readImageFile(filePath: string): Promise<NamedResourceData> {
  const filerBuffer = await readFile(filePath)
  return { data: filerBuffer, name: filePath }
}
