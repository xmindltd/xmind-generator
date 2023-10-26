import { describe, it, expect } from 'vitest'
import {
  Topic,
  Root,
  Sheet,
  Relationship,
  Summary,
  RelationshipBuilder
} from '../../builder'
import { Marker } from '../marker'
import { Sheet as SheetModel } from '../model/sheet'
import { Workbook } from '../model/workbook'
import { makeWorkbookBuilder } from './workbook-builder'
import { asBuilder } from './types'

let workbook: Workbook

describe('[builder] *', () => {
  it('should create a workbook', () => {
    workbook = asBuilder<Workbook>(
      makeWorkbookBuilder([
        Root('Grill House')
          .ref('topic:inf')
          .children([
            Topic('Salad')
              .ref('topic:foo')
              .image({ name: 'test', data: 'data:image/png;base64,...' })
              .note('This is notes')
              .markers([Marker.Arrow.refresh])
              .children([
                Topic('Garden Salad')
                  .ref('topic:baz')
                  .labels(['Lemon Vinaigrette', 'Ginger Dressing']),
                Topic('Tomato Salad').ref('topic:qux')
              ]),
            Topic('Starters')
              .ref('topic:bar')
              .note('With free soft drink')
              .children([
                Topic('Smoked Bacon').ref('topic:fred'),
                Topic('Fried Chicken').ref('topic:thud').labels(['Hot Chilli'])
              ])
          ])
          .relationships([
            Relationship('', { from: 'topic:foo', to: 'topic:bar' }),
            Relationship('Special', {
              from: 'Smoked Bacon',
              to: 'Fried Chicken'
            })
          ])
          .summaries([
            Summary('Fresh and Delicious', {
              from: 'topic:foo',
              to: 'topic:bar'
            })
          ])
      ])
    ).build()

    expect(workbook).instanceOf(Workbook)

    expect(workbook.sheets.length).toBe(1)
    expect(workbook.sheets[0].rootTopic?.ref).toBe('topic:inf')

    expect(workbook.sheets[0].rootTopic?.children.length).toBe(2)
    expect(workbook.sheets[0].rootTopic?.children[0].image).toBeDefined()
    expect(workbook.sheets[0].rootTopic?.children[0].note).toBe('This is notes')
    expect(workbook.sheets[0].rootTopic?.children[0].markers).toEqual([Marker.Arrow.refresh])

    expect(workbook.sheets[0].rootTopic?.children[0].children.length).toBe(2)
    expect(workbook.sheets[0].rootTopic?.children[0].children[0].labels).toEqual([
      'Lemon Vinaigrette',
      'Ginger Dressing'
    ])

    expect(workbook.sheets[0].relationships.length).toBe(2)
    expect(workbook.sheets[0].relationships[0].fromTopicId).toBe(
      workbook.sheets[0].rootTopic?.children[0].id
    )
    expect(workbook.sheets[0].relationships[0].toTopicId).toBe(
      workbook.sheets[0].rootTopic?.children[1].id
    )
    expect(workbook.sheets[0].relationships[1].fromTopicId).toBe(
      workbook.sheets[0].rootTopic?.children[1].children[0].id
    )
    expect(workbook.sheets[0].relationships[1].toTopicId).toBe(
      workbook.sheets[0].rootTopic?.children[1].children[1].id
    )
  })

  it('should throw exception if ref in relationship info is invalid', () => {
    expect(() =>
      asBuilder<SheetModel>(
        Sheet()
          .rootTopic(
            Topic('root').children([
              Topic('Salad').ref('topic:foo'),
              Topic('Starters').ref('topic:bar')
            ])
          )
          .relationships([
            Relationship('', {
              from: 'topic:errorRef',
              to: 'topic:bar'
            }) as RelationshipBuilder
          ])
      ).build()
    ).toThrowError('Missing Ref "topic:errorRef"')
  })

  it('should create a sheet attached to workbook', () => {
    expect(workbook?.sheets[0]).instanceOf(SheetModel)
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
    expect(workbook?.sheets?.[0]?.relationships?.[0].fromTopicId).toBe(childTopics?.[0].id)
    expect(workbook?.sheets?.[0]?.relationships?.[0].toTopicId).toBe(childTopics?.[1].id)
  })

  it('should create a summary for root topic', () => {
    const rootTopic = workbook?.sheets?.[0]?.rootTopic
    expect(rootTopic?.summaries).length(1)
    expect(rootTopic?.summaries?.[0]?.title).toBe('Fresh and Delicious')
    expect(rootTopic?.summaries?.[0]?.from).toBe(rootTopic?.children?.[0]?.id)
    expect(rootTopic?.summaries?.[0]?.to).toBe(rootTopic?.children?.[1]?.id)
  })
})
