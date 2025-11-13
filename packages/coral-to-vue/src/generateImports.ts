import type { CoralImportType } from '@reallygoodwork/coral-core'

/**
 * Generates Vue import statements from Coral import specifications
 * @param imports - Array of Coral import specifications
 * @returns String of import statements
 */
export function generateImports(imports?: CoralImportType[]): string {
  const importStatements: string[] = []

  // Add Vue imports based on what's needed (we'll add them dynamically based on usage)
  // For now, we'll add common ones that might be needed
  // In a full implementation, we'd analyze the spec to determine which Vue APIs are needed

  if (!imports || imports.length === 0) {
    return "import { ref, reactive } from 'vue'"
  }

  for (const importSpec of imports) {
    const defaultImport = importSpec.specifiers.find((s) => s.isDefault)
    const namedImports = importSpec.specifiers.filter((s) => !s.isDefault)

    if (defaultImport && namedImports.length === 0) {
      // Only default import
      const alias = defaultImport.as || defaultImport.name
      importStatements.push(`import ${alias} from '${importSpec.source}'`)
    } else if (defaultImport && namedImports.length > 0) {
      // Both default and named imports
      const defaultAlias = defaultImport.as || defaultImport.name
      const namedList = namedImports
        .map((s) => {
          if (s.as) {
            return `${s.name} as ${s.as}`
          }
          return s.name
        })
        .join(', ')
      importStatements.push(`import ${defaultAlias}, { ${namedList} } from '${importSpec.source}'`)
    } else if (namedImports.length > 0) {
      // Only named imports
      const namedList = namedImports
        .map((s) => {
          if (s.as) {
            return `${s.name} as ${s.as}`
          }
          return s.name
        })
        .join(', ')
      importStatements.push(`import { ${namedList} } from '${importSpec.source}'`)
    }
  }

  return importStatements.join('\n')
}

/**
 * Determines which Vue APIs need to be imported based on component features
 * @param hasState - Whether component has state hooks
 * @param hasComputed - Whether component has computed properties
 * @param hasWatch - Whether component has watch/effect hooks
 * @returns Array of Vue API names to import
 */
export function getRequiredVueImports(hasState: boolean, hasComputed: boolean, hasWatch: boolean): string[] {
  const imports: string[] = []

  if (hasState) {
    imports.push('ref', 'reactive')
  }

  if (hasComputed) {
    imports.push('computed')
  }

  if (hasWatch) {
    imports.push('watch', 'watchEffect')
  }

  // Remove duplicates
  return [...new Set(imports)]
}
