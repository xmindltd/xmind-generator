import { describe, it, expect } from 'vitest'
import { topic, root, sheet, builder, relationship } from '../../builder'
import { Sheet } from '../model/sheet'
import { Workbook } from '../model/workbook'

let workbook: Workbook

describe('[builder] *', () => {
  it('should cerate a workbook', () => {
    workbook = builder()
      .create([
        root('Grill House', { ref: 'topic:inf' })
          .children([
            topic('Salad', { ref: 'topic:foo' }).children([
              topic('Garden Salad', {
                ref: 'topic:baz',
                labels: ['Lemon Vinaigrette', 'Ginger Dressing']
              }),
              topic('Tomato Salad', { ref: 'topic:qux' })
            ]),
            topic('Starters', { ref: 'topic:bar', notes: ['With free soft drink'] }).children([
              topic('Smoked Bacon', { ref: 'topic:fred' }),
              topic('Fried Chicken', { ref: 'topic:thud', labels: ['Hot Chilli'] })
            ])
          ])
          .relationships([
            relationship('', { from: { ref: 'topic:foo' }, to: { ref: 'topic:bar' } }),
            relationship('Special', { from: { ref: 'topic:fred' }, to: { ref: 'topic:thud' } })
          ])
      ])
      .build()
    expect(workbook).instanceOf(Workbook)
  })
  it('should throw exception if ref in relationship info is invalid', () => {
    expect(() =>
      sheet()
        .rootTopic(
          topic('root').children([
            topic('Salad', { ref: 'topic:foo' }),
            topic('Starters', { ref: 'topic:bar' })
          ])
        )
        .relationships([
          relationship('', { from: { ref: 'topic:errorRef' }, to: { ref: 'topic:bar' } })
        ])
        .build()
    ).toThrowError('Missing Ref "topic:errorRef"')
  })
  it('should create a sheet attached to workbook', () => {
    expect(workbook?.sheets[0]).instanceOf(Sheet)
    expect(workbook?.sheets[0].title).toBe('')
  })
  it('should create a root topic attached to sheet', () => {
    expect(workbook?.sheets?.[0]?.rootTopic?.title).toBe('Grill House')
  })
  it('should create two child topics attached to rootTopic', () => {
    const childTopics = workbook?.sheets?.[0]?.rootTopic?.children
    expect(childTopics?.[0]?.title).toBe('Salad')
    expect(childTopics?.[1]?.title).toBe('Starters')
    expect(childTopics?.[1]?.children?.[0]?.title).toBe('Smoked Bacon')
  })
  it('should create two relationship', () => {
    const childTopics = workbook?.sheets?.[0]?.rootTopic?.children
    expect(workbook?.sheets?.[0]?.relationships).length(2)
    expect(workbook?.sheets?.[0]?.relationships?.[1].title).toBe('Special')
    expect(workbook?.sheets?.[0]?.relationships?.[0].startTopicId).toBe(childTopics?.[0].id)
    expect(workbook?.sheets?.[0]?.relationships?.[0].endTopicId).toBe(childTopics?.[1].id)
  })
})
