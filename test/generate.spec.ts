import path from 'path'
import { existsSync } from 'fs'
import { describe, it, expect } from 'vitest'
import { readImageFile, saveLocal } from '../src/helper'
import { Marker } from '../src/internal/marker'
import { topic, root, builder, relationship, summary } from '../src/builder'

describe('write xmind file', () => {
  it('should write workbook to xmind file', async () => {
    const workbook = builder()
      .create([
        root('Grill House', { ref: 'topic:inf' })
          .children([
            topic('Salad', { ref: 'topic:foo', markers: [Marker.Arrow.refresh] }).children([
              topic('Garden Salad', {
                ref: 'topic:baz',
                labels: ['Lemon Vinaigrette', 'Ginger Dressing']
              }),
              topic('Tomato Salad', { ref: 'topic:qux' })
            ]),
            topic('Starters', { ref: 'topic:bar', note: 'With free soft drink' }).children([
              topic('Smoked Bacon', { ref: 'topic:fred' }),
              topic('Fried Chicken', { ref: 'topic:thud', labels: ['Hot Chilli'] })
            ])
          ])
          .relationships([
            relationship('', { from: { ref: 'topic:foo' }, to: { ref: 'topic:bar' } }),
            relationship('Special', { from: { ref: 'topic:fred' }, to: { ref: 'topic:thud' } })
          ])
          .summaries([
            summary('Fresh and Delicious', {
              start: { ref: 'topic:foo' },
              end: { ref: 'topic:bar' }
            })
          ])
      ])
      .build()
    const image = await readImageFile(path.resolve(__dirname, 'xmind.jpeg'))
    workbook.sheets[0].rootTopic?.addImage(image.data, image.type)
    await saveLocal(workbook, path.resolve(__dirname))
    expect(existsSync(path.resolve(__dirname, 'Grill House.xmind'))).toBe(true)
  })
})
