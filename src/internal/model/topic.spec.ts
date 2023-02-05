import { describe, it, expect } from 'vitest'
import { Topic } from './topic'
import { Marker } from '../marker'

describe('[internal/model/topic] constructor()', () => {
  it('should create a topic', () => {
    const topic = new Topic('Smoked Bacon', { labels: ['sweat'] })
    expect(topic?.title).toBe('Smoked Bacon')
    expect(topic?.labels).contain('sweat')
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
      `Markers in same group is not allowed: ${Marker.People.gray.id}`
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
