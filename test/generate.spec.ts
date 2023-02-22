import path from 'path'
import { existsSync } from 'fs'
import { describe, it, expect } from 'vitest'
import { readImageFile, saveLocal } from '../src/helper'
import { Marker } from '../src/internal/marker'
import { Topic, Root, Relationship, Summary, generateWorkbook } from '../src/index'

describe('write xmind file', () => {
  it('should write workbook to xmind file', async () => {
    const image = await readImageFile(path.resolve(__dirname, 'xmind.jpeg'))
    const workbook = generateWorkbook(
      Root('Grill House')
        .ref('topic:inf')
        .image(image.data, image.type)
        .children([
          Topic('Salad')
            .ref('topic:foo')
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
          Relationship('', { from: { ref: 'topic:foo' }, to: { ref: 'topic:bar' } }),
          Relationship('Special', { from: { ref: 'topic:fred' }, to: { ref: 'topic:thud' } })
        ])
        .summaries([
          Summary('Fresh and Delicious', {
            start: { ref: 'topic:foo' },
            end: { ref: 'topic:bar' }
          })
        ])
    )
    await saveLocal(workbook, path.resolve(__dirname))
    expect(existsSync(path.resolve(__dirname, 'Grill House.xmind'))).toBe(true)
  })
})
