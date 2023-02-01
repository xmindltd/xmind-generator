import { describe, it, expect } from 'vitest'
import { Marker } from './marker'

describe('[marker] fetch marker', () => {
  it('should fetch the correct marker id', () => {
    expect(Marker.Arrow.left.id).toBe('arrow-left')
    expect(Marker.Week.sat.id).toBe('week-sat')
    expect(Marker.Flag.gray.id).toBe('flag-gray')
    expect(Marker.People.green.id).toBe('people-green')
    expect(Marker.Smiley.boring.id).toBe('smiley-boring')
  })
})

describe('[marker] check same group between two markerIds', () => {
  it('should be same group', () => {
    expect(Marker.Smiley.cry.isSameGroup(Marker.Smiley.embarrass)).toBe(true)
    expect(Marker.Priority.p3.isSameGroup(Marker.Priority.p5)).toBe(true)
  })
  it('should be different group', () => {
    expect(Marker.Task.oct.isSameGroup(Marker.Smiley.embarrass)).toBe(false)
    expect(Marker.Month.apr.isSameGroup(Marker.Priority.p3)).toBe(false)
  })
})
