import { describe, it, expect } from 'vitest'
import { Topic } from './topic'
import { Marker } from '../marker'

describe('[internal/model/topic] constructor()', () => {
  it('should create a topic', () => {
    const topic = new Topic('Smoked Bacon', {
      labels: ['sweat'],
      markers: [Marker.People.darkBlue, Marker.Month.apr],
      note: 'this is a note'
    })
    expect(topic?.title).toBe('Smoked Bacon')
    expect(topic?.labels).contain('sweat')
    expect(topic?.note).toBe('this is a note')
    expect(topic?.markers.length).toBe(2)
    expect(topic?.markers).contain(Marker.People.darkBlue)
  })
})

describe('[internal/model/topic] addTopic()/removeTopic()', () => {
  it('should add a child topic attach to current topic', () => {
    const topic = new Topic('Smoked Bacon')
    const childTopic = topic.addTopic('Fried Chicken', { labels: ['spicy'] })
    expect(childTopic?.title).toBe('Fried Chicken')
    expect(childTopic?.labels).contain('spicy')
    topic.removeTopic(childTopic?.id)
    expect(topic?.children[0]).toBeUndefined()
  })
})

describe('[internal/model/topic] query()', () => {
  it('should return proper topic', () => {
    const parentTopic = new Topic('Smoked Bacon')
    parentTopic.addTopic('Ice cream')
    const childTopic = parentTopic.addTopic('Fried Chicken')
    expect(parentTopic?.query?.(parentTopic.id)).toBe(parentTopic)
    expect(parentTopic?.query?.(childTopic.id)).toBe(childTopic)
  })
  it('should return null', () => {
    const parentTopic = new Topic('Smoked Bacon')
    const childTopic = parentTopic.addTopic('Fried Chicken')
    expect(parentTopic?.query?.(childTopic.id + 'abc')).toBeNull()
  })
})

describe('[internal/model/topic] addMaker()', () => {
  it('should add a marker to topic', () => {
    const topic = new Topic('Smoked Bacon')
    topic.addMarker(Marker.People.blue)
    expect(topic.markers?.[0]).toBe(Marker.People.blue)
  })
  it('should throw a exception if add a marker to topic with same group', () => {
    const topic = new Topic('Smoked Bacon')
    topic.addMarker(Marker.People.blue)
    expect(() => topic.addMarker(Marker.People.gray)).toThrowError(
      'Marker creation with same group is not allowed'
    )
  })
})

describe('[internal/model/topic] removeMarker()', () => {
  it('should remove a marker from topic', () => {
    const topic = new Topic('Smoked Bacon')
    topic.addMarker(Marker.Month.jan)
    topic.removeMarker(Marker.Month.jan)
    expect(topic.markers[0]).toBeUndefined()
  })
})

describe('[internal/model/topic] addSummary()', () => {
  it('should add a summary attach to topic', () => {
    const topic = new Topic('Smoked Bacon')
    const childTopicFoo = topic.addTopic('ice')
    const childTopicBar = topic.addTopic('fire')
    const summary = topic.addSummary('summary', childTopicBar.id, childTopicFoo.id)
    expect(summary.title).toBe('summary')
    expect(topic.summaries?.[0]).toBe(summary)
  })
})

describe('[internal/model/topic] addLabel()', () => {
  it('should add a label attach to topic', () => {
    const topic = new Topic('Smoked Bacon')
    expect(topic.labels.length).toBe(0)
    topic.addLabel('label 1')
    expect(topic.labels[0]).toBe('label 1')
  })
})
