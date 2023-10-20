import { type RootTopicBuilder, type SheetBuilder, type WorkbookBuilder } from '../../builder'
import { type Sheet } from '../model/sheet'
import { Workbook } from '../model/workbook'
import { asBuilder } from './types'

export function makeWorkbookBuilder(builders: ReadonlyArray<SheetBuilder | RootTopicBuilder>) {
  return {
    build() {
      const sheets = builders.map(builder => asBuilder<Sheet>(builder).build())
      return new Workbook(sheets)
    }
  } as unknown as WorkbookBuilder
}
