import path from 'path'
import { existsSync } from 'fs'
import { describe, it, expect } from 'vitest'
import { Topic, Root, Relationship, Summary, generateWorkbook, Marker, helper } from '../'

describe('write xmind file', () => {
  it('should write workbook to xmind file', async () => {
    const image = await helper.readImageFile(path.resolve(__dirname, 'xmind.jpeg'))
    const document = generateWorkbook(
      Root('Grill House')
        .image(image.data, image.type)
        .children([
          Topic('Salad')
            .ref('topic:salad')
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
          Relationship('', { from: { topic: 'Salad' }, to: { ref: 'topic:bar' } }),
          Relationship('Special', { from:{ ref: 'topic:fred' }, to: { ref: 'topic:thud' } })
        ])
        .summaries([Summary('Fresh and Delicious', { from: 'topic:salad', to: 'topic:bar' })])
    )
    await helper.saveLocal(document, path.resolve(__dirname))
    expect(existsSync(path.resolve(__dirname, 'Grill House.xmind'))).toBe(true)
  })
})
