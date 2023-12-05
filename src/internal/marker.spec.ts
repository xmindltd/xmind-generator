import { describe, it, expect } from 'vitest'
import { Marker } from '../marker'
import { isSameGroupWith } from './marker'

describe('[marker] check same group between two markerIds', () => {
  it('should be same group', () => {
    expect(isSameGroupWith(Marker.Smiley.cry, Marker.Smiley.embarrass)).toBe(true)
    expect(isSameGroupWith(Marker.Priority.p3, Marker.Priority.p5)).toBe(true)
  })
  it('should be different group', () => {
    expect(isSameGroupWith(Marker.Task.oct, Marker.Smiley.embarrass)).toBe(false)
    expect(isSameGroupWith(Marker.Month.apr, Marker.Priority.p3)).toBe(false)
  })
})
