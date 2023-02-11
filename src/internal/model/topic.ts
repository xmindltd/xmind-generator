import { uuid } from '../common'
import { MarkerId } from '../marker'
import { ImageSource, ImageType } from '../storage'
import { Summary, SummaryId } from './summary'

export type TopicId = string
export type RefString = string

export type TopicImageData = {
  data: ImageSource
  type: ImageType
}

export type TopicAttributes = {
  ref?: RefString
  labels?: string[]
  note?: string
  image?: TopicImageData | null
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
  private _image: TopicImageData | null
  private _note: string | null

  constructor(title: string, attributes?: TopicAttributes, children?: Topic[]) {
    this.id = uuid()
    this.title = title
    this._children = children ?? []
    this._summaries = []
    this.ref = attributes?.ref ?? null
    this._image = attributes?.image ?? null
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

  get image(): Readonly<TopicImageData | null> {
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

  public removeTopic(topicId: TopicId): void {
    this._children = this._children.filter(child => child.id !== topicId)
  }

  public addLabel(label: string): void {
    if (!this._labels.includes(label)) {
      this._labels.push(label)
    }
  }

  public addImage(imageData: ImageSource, imageType: ImageType): void {
    this._image = {
      data: imageData,
      type: imageType
    }
  }

  public removeImage(): void {
    this._image = null
  }

  public addMarker(markerId: MarkerId): void {
    if (this._markers.find(id => id.isSameGroup(markerId))) {
      throw new Error('Marker creation with same group is not allowed')
    }
    this._markers.push(markerId)
  }

  public removeMarker(markerId: MarkerId): void {
    this._markers = this._markers.filter(m => m.id !== markerId.id)
  }

  public addSummary(title: string, startTopicId: TopicId, endTopicId: TopicId): Summary {
    const summaryToAdd = new Summary(title, startTopicId, endTopicId)
    const summaryFound = this._summaries.find(summary => summary.isEqualTo(summaryToAdd))
    if (summaryFound) {
      return summaryFound
    }
    this._summaries.push(summaryToAdd)
    return summaryToAdd
  }

  public removeSummary(identifier: SummaryId | TopicId) {
    this._summaries = this._summaries.filter(
      summary =>
        summary.id !== identifier &&
        summary.endTopicId !== identifier &&
        summary.startTopicId !== identifier
    )
  }
}
