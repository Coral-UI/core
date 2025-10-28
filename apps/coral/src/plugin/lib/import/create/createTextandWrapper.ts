import { CoralNode } from '@reallygoodwork/coral-core'

import { textAlign } from '../../types'
import { createFrameWithFillingText } from '../frames/createFrameWithFillingText'

export const createTextandWrapper = async (spec: CoralNode, textAlign?: textAlign) => {
  const { frame } = await createFrameWithFillingText(spec, textAlign)
  return { frame }
}
