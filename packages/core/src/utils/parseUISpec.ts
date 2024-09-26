import { BaseNode, zUISpecSchema } from '@config/UISpec'

/**
 * Parses and validates a UI specification object.
 *
 * @async
 * @param {Record<string, unknown>} html - The UI specification object to parse.
 * @returns {Promise<BaseNode>} A promise that resolves to the parsed and validated BaseNode.
 * @throws {Error} If the input fails validation against the zUISpecSchema.
 */
export async function parseUISpec(html: Record<string, unknown>): Promise<BaseNode> {
  const result = await zUISpecSchema.safeParseAsync(html)

  if (!result.success) {
    throw new Error(result.error.message)
  } else {
    return result.data
  }
}
