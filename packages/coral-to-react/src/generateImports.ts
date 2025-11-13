import type { CoralImportType } from '@reallygoodwork/coral-core'

/**
 * Generates React import statements from Coral import specifications
 * @param imports - Array of Coral import specifications
 * @returns String of import statements
 */
export function generateImports(imports?: CoralImportType[]): string {
  if (!imports || imports.length === 0) {
    return "import React from 'react'"
  }

  const importStatements: string[] = ["import React from 'react'"]

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
