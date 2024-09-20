import { Result } from '@/lib/reactToSpec/parseReactComponentToSpec'

export const findImportSource = (componentName: string, result: Result): string | undefined => {
  const importInfo = result.imports.find((imp) => imp.specifiers.some((spec) => spec.name === componentName))
  return importInfo ? importInfo.source : undefined
}
