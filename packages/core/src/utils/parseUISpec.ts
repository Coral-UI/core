import { CoralRootNode, zCoralRootSchema } from '../structures/coral'

/**
 * Parses and validates a UI specification object.
 *
 * @async
 * @param {Record<string, unknown>} html - The UI specification object to parse.
 * @returns {Promise<BaseNode>} A promise that resolves to the parsed and validated BaseNode.
 * @throws {Error} If the input fails validation against the zUISpecSchema.
 */
export async function parseUISpec(html: Record<string, unknown>): Promise<CoralRootNode> {
  const result = await zCoralRootSchema.safeParseAsync(html)

  if (!result.success) {
    throw new Error(result.error.message)
  } else {
    return result.data
  }
}
