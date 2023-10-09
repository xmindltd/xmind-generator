import path from 'path'
import { existsSync } from 'fs'
import { describe, it, expect } from 'vitest'
import {
  Topic,
  Root,
  Relationship,
  Summary,
  Workbook,
  Marker,
  helper
} from '../src/exports'

describe('write xmind file', () => {
  it('should write workbook to xmind file', async () => {
    const image = await helper.readImageFile(path.resolve(__dirname, 'xmind.jpeg'))
    const document = Workbook(
      Root('Grill House')
        .image(image.data, image.type)
        .children([
          Topic('Salad')
            .markers([Marker.Arrow.refresh])
            .children([
              Topic('Garden Salad')
                .ref('topic:baz')
                .labels(['Lemon Vinaigrette', 'Ginger Dressing']),
              Topic('Tomato Salad').ref('topic:qux')
            ])
            .summaries([Summary('Get 10% off', { from: 'topic:baz', to: 'topic:qux' })]),
          Topic('Starters')
            .ref('topic:bar')
            .note('With free soft drink')
            .children([
              Topic('Smoked Bacon').ref('topic:fred'),
              Topic('Fried Chicken').ref('topic:thud').labels(['Hot Chilli'])
            ])
        ])
        .relationships([
          Relationship('', { from: 'Salad', to: 'topic:bar' }),
          Relationship('Special', { from: 'topic:fred', to: 'topic:thud' })
        ])
        .summaries([Summary('Fresh and Delicious', { from: 'Salad', to: 'topic:bar' })])
    )
    await helper.saveLocal(document, path.resolve(__dirname, 'Grill House.xmind'))
    expect(existsSync(path.resolve(__dirname, 'Grill House.xmind'))).toBe(true)
  })
})
