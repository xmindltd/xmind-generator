import { Workbook } from './internal/model/workbook'

export async function saveLocal(workbook: Workbook, pathToDirectory: string) {
  // TODO detect browser or node, save to local xmind file
  const Path = suggestFilePath(workbook, pathToDirectory)
}

function suggestFilePath(workbook: Workbook, pathToDirectory: string): string {
  const name = workbook?.sheets?.[0]?.rootTopic?.title ?? workbook?.sheets?.[0]?.title ?? 'map'
  if (pathToDirectory.endsWith('/')) {
    pathToDirectory = pathToDirectory.slice(0, -1)
  }
  return `${pathToDirectory}/${name}.xmind`
}