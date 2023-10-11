import { writeFile } from 'fs'
import { readFile } from 'fs/promises'
import type { WorkbookDocument } from './builder'

export async function saveLocal(document: WorkbookDocument, pathToFile: string) {
  const buffer = await document.archive()
  writeFile(pathToFile, Buffer.from(buffer), err => {
    if (err) throw err
  })
}

export async function readImageFile(filePath: string): Promise<Buffer> {
  return await readFile(filePath)
}
