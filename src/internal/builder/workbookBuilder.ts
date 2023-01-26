import { RootBuilder, SheetBuilder, WorkbookBuilder } from '../../builder'
import { Workbook } from '../model/workbook'

export function makeWorkbookBuilder(): WorkbookBuilder {
  const childBuilders: Array<SheetBuilder | RootBuilder> = []
  const workbookBuilder = {
    create: (builders: ReadonlyArray<SheetBuilder | RootBuilder>) => {
      childBuilders.push(...builders)
      return workbookBuilder
    },
    build: () => {
      const sheets = childBuilders.map(builder => builder.build())
      return new Workbook(sheets)
    }
  }
  return workbookBuilder
}
