import { Sheet } from "./sheet"

export class Workbook {
  readonly sheets: Sheet[]

  constructor() {
    this.sheets = []
  }

  createRoot(title: string) {
    if (this.sheets.length === 0) {
      this.addSheet(title)
    } else {
      throw new Error('Duplicated root topic creation')
    }
  }

  addSheet(title: string) {
    this.sheets.push(new Sheet(title))
  }
}