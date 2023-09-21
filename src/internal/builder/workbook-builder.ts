import type { RootBuilder, SheetBuilder, WorkbookBuilder } from '../../builder'
import { Workbook } from '../model/workbook'

export function makeWorkbookBuilder(): WorkbookBuilder {
  const childBuilders: Array<SheetBuilder | RootBuilder> = []
  return {
    create(builders: ReadonlyArray<SheetBuilder | RootBuilder>) {
      childBuilders.push(...builders)
      return this
    },
    build() {
      const sheets = childBuilders.map(builder => builder.build())
      return new Workbook(sheets)
    }
  }
}
