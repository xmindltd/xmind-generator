import { uuid } from '../common'
import type { MarkerId } from '../marker'
import type { ResourceData } from '../storage'
import { Summary } from './summary'

export type TopicId = string
export type RefString = string

export type TopicAttributes = {
  ref?: RefString
  labels?: string[]
  note?: string
  markers?: MarkerId[]
}

export class Topic {
  readonly id: TopicId
  readonly ref: RefString | null
  readonly title: string
  private _children: Topic[]
  private _summaries: Summary[]
  private _markers: MarkerId[]
  private _labels: string[]
  private _image: ResourceData | null
  private _note: string | null

  constructor(title: string, attributes?: TopicAttributes, children?: Topic[]) {
    this.id = uuid()
    this.title = title
    this._children = children ?? []
    this._summaries = []
    this._image = null
    this.ref = attributes?.ref ?? null
    this._labels = attributes?.labels ?? []
    this._markers = attributes?.markers ?? []
    this._note = attributes?.note ?? null
  }

  get children(): ReadonlyArray<Topic> {
    return this._children
  }

  get summaries(): ReadonlyArray<Summary> {
    return this._summaries
  }

  get labels(): ReadonlyArray<string> {
    return this._labels
  }

  get note(): Readonly<string | null> {
    return this._note
  }

  set note(newNote: string | null) {
    if (newNote) {
      this._note = newNote.trim()
    }
  }

  get markers(): ReadonlyArray<MarkerId> {
    return this._markers
  }

  get image(): ResourceData | null {
    return this._image
  }

  public query(identifier: TopicId | RefString): Topic | null {
    if (identifier === this.id || identifier === this.ref) {
      return this
    } else {
      return this._children.find(child => child.query(identifier) !== null) ?? null
    }
  }

  public addTopic(title: string, attributes?: TopicAttributes): Topic {
    const childTopic = new Topic(title, attributes)
    this._children.push(childTopic)
    return childTopic
  }

  public addLabel(label: string): void {
    if (!this._labels.includes(label)) {
      this._labels.push(label)
    }
  }

  public addImage(imageData: ResourceData): void {
    this._image = imageData
  }

  public addMarker(markerId: MarkerId): void {
    if (this._markers.find(id => id.isSameGroup(markerId))) {
      throw new Error('Marker creation with same group is not allowed')
    }
    this._markers.push(markerId)
  }

  public addSummary(
    title: string,
    from: TopicId | number,
    to: TopicId | number,
    summaryTopic: Topic
  ): Summary | null {
    const summaryToAdd = new Summary(title, from, to, summaryTopic)
    if (this._summaries.find(summary => summary.isConflictWith(summaryToAdd))) {
      return null
    }
    this._summaries.push(summaryToAdd)
    return summaryToAdd
  }
}
