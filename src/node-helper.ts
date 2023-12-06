import type { WorkbookBuilder } from './builder'
import type { NamedResourceData } from './storage'

export async function writeLocalFile(workbook: WorkbookBuilder, pathToFile: string) {
  const { writeFile } = await import('fs/promises')
  const buffer = await workbook.archive()
  await writeFile(pathToFile, Buffer.from(buffer))
}

export async function readImageFile(filePath: string): Promise<NamedResourceData> {
  const { readFile } = await import('fs/promises')
  const filerBuffer = await readFile(filePath)
  const path = await import('path')
  return { data: filerBuffer, name: path.basename(filePath) }
}
