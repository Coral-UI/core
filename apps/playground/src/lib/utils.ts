import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Filters out undefined values from an object, preserving only defined properties.
 * Useful with exactOptionalPropertyTypes: true to avoid passing undefined to optional props.
 *
 * This function performs runtime filtering and uses a type assertion that's safe
 * because we know undefined values have been removed.
 *
 * @example
 * ```tsx
 * <Component {...omitUndefined({ prop1: value1, prop2: undefined })} />
 * // Results in: <Component prop1={value1} />
 * ```
 */
type OmitUndefined<T extends Record<string, unknown>> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K]
}

export function omitUndefined<T extends Record<string, unknown>>(obj: T): OmitUndefined<T> {
  const result = {} as OmitUndefined<T>
  for (const key in obj) {
    const value = obj[key]
    if (value !== undefined) {
      // Safe assertion: we've checked value !== undefined
      ;(result as Record<string, unknown>)[key] = value
    }
  }
  return result
}
