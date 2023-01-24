import { SheetBuilder, WorkbookBuilder } from '../../builder'
import { Workbook } from '../model/workbook'

export function makeWorkbookBuilder(): WorkbookBuilder {
  const childBuilders: Array<SheetBuilder> = []
  const workbookBuilder = {
    create: (sheetBuilders: ReadonlyArray<SheetBuilder>) => {
      childBuilders.push(...sheetBuilders)
      return workbookBuilder
    },
    build: () => {
      const sheets = childBuilders.map(builder => builder.build())
      return new Workbook(sheets)
    }
  }
  return workbookBuilder
}
