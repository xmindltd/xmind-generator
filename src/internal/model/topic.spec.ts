import { describe, it, expect } from 'vitest'
import { Topic } from './topic'

describe('[internal/model/topic] constructor()', () => {
  it('should create a topic', () => {
    const topic = new Topic('Smoked Bacon', { labels: ['sweat'] })
    expect(topic?.title).toBe('Smoked Bacon')
    expect(topic?.attributes.labels).contain('sweat')
  })
})

describe('[internal/model/topic] addTopic()/removeTopic()', () => {
  it('should add a child topic attach to current topic', () => {
    const topic = new Topic('Smoked Bacon')
    const childTopic = topic.addTopic('Fried Chicken', { labels: ['spicy'] })
    expect(childTopic?.title).toBe('Fried Chicken')
    expect(childTopic?.attributes?.labels).contain('spicy')
    topic.removeTopic(childTopic?.id)
    expect(topic?.children[0]).toBeUndefined()
  })
})

describe('[internal/model/topic] query()', () => {
  it('should return proper topic', () => {
    const parentTopic = new Topic('Smoked Bacon')
    const childTopic = parentTopic.addTopic('Fried Chicken')
    expect(parentTopic?.query?.(parentTopic.id)).toBe(parentTopic)
    expect(parentTopic?.query?.(childTopic.id)).toBe(childTopic)
  })
  it('should return null', () => {
    const topic = new Topic('Smoked Bacon')
    expect(topic?.query?.('test')).toBeNull()
  })
})
