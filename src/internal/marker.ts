import { MarkerId } from '../marker'

export function isSameGroupWith(x: MarkerId, y: MarkerId) {
  return x.id.split('-')[0] === y.id.split('-')[0]
}