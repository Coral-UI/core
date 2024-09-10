/**
 * Creates a new object from the given attributes, excluding the 'class' property if present.
 *
 * @param {Record<string, unknown>} attributes - An object containing attribute key-value pairs.
 * @returns {Record<string, unknown>} A new object with all attributes except 'class'.
 */
export const createAttributesObject = (attributes: Record<string, string | number | boolean>) => {
  if (attributes.class) {
    const { class: _, ...rest } = attributes
    return rest
  } else {
    return attributes
  }
}
