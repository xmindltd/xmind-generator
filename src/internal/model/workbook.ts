import { Sheet, SheetId } from './sheet'
import { Topic } from './topic'

export class Workbook {
  private _sheets: Sheet[]

  constructor(sheets?: Sheet[]) {
    this._sheets = sheets ?? []
  }

  get sheets(): ReadonlyArray<Sheet> {
    return this._sheets
  }

  public createRoot(title: string): Topic {
    const sheetName = `Map ${this.sheets.length + 1}`
    return this.addSheet(sheetName).addRootTopic(title)
  }

  public addSheet(title: string): Sheet {
    const sheet = new Sheet(title)
    this._sheets.push(sheet)
    return sheet
  }

  public getSheet(sheetId: SheetId): Sheet | null {
    return this.sheets.find(sheet => sheet.id === sheetId) ?? null
  }

  public removeSheet(sheetId: SheetId): void {
    this._sheets = this._sheets.filter(sheet => sheet.id !== sheetId)
  }
}
