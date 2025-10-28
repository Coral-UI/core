/**
 * Deep clone function for Figma API objects
 * Handles arrays, Uint8Array, and plain objects
 */

export const cloneAPIObject = <T>(val: T): T => {
  const type = typeof val
  if (val === null || val === undefined) {
    return val
  } else if (type === 'number' || type === 'string' || type === 'boolean') {
    return val
  } else if (type === 'object') {
    if (val instanceof Array) {
      return val.map((x) => cloneAPIObject(x)) as T
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val) as T
    } else {
      const o: Record<string, unknown> = {}
      for (const key in val) {
        o[key] = cloneAPIObject((val as Record<string, unknown>)[key])
      }
      return o as T
    }
  }
  throw new Error(`Cannot clone value of type ${type}`)
}
