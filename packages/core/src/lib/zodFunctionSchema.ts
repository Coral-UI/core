import { z } from 'zod/v4'

export const functionSchema = <T extends z.core.$ZodFunction>(schema: T) =>
  z.custom<Parameters<T['implement']>[0]>((fn) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      schema.implement(fn as any)
      return true
    } catch {
      return false
    }
  })

export const createAsyncFunctionSchema = <T extends z.core.$ZodFunction>(schema: T) =>
  z.custom<Parameters<T['implementAsync']>[0]>((fn) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      schema.implementAsync(fn as any)
      return true
    } catch {
      return false
    }
  })
