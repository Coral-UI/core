export interface ValidationError {
  type: 'syntax' | 'structure' | 'compatibility'
  message: string
  suggestion?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export const validateReactComponent = (componentCode: string): ValidationResult => {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Basic input validation
  if (componentCode == null || typeof componentCode !== 'string') {
    errors.push({
      type: 'syntax',
      message: 'Component code must be a non-empty string',
      suggestion: 'Provide valid React component source code as a string',
    })
    return { isValid: false, errors, warnings }
  }

  if (componentCode.trim().length === 0) {
    errors.push({
      type: 'syntax',
      message: 'Component code cannot be empty',
      suggestion: 'Provide a valid React component with JSX elements',
    })
    return { isValid: false, errors, warnings }
  }

  // Check for basic React component patterns
  const hasReactImport = /import\s+.*React.*from\s+['"]react['"]/.test(componentCode)
  const hasFunctionComponent = /(?:function\s+\w+|const\s+\w+\s*=.*=>|export\s+default\s+function)/.test(componentCode)
  const hasJSX = /<[A-Za-z]/.test(componentCode)

  if (!hasReactImport) {
    warnings.push({
      type: 'structure',
      message: 'No React import found',
      suggestion: 'Add \'import React from "react"\' or similar import statement',
    })
  }

  if (!hasFunctionComponent) {
    errors.push({
      type: 'structure',
      message: 'No valid React component found',
      suggestion: 'Component should be a function declaration, arrow function, or exported function',
    })
  }

  if (!hasJSX) {
    warnings.push({
      type: 'structure',
      message: 'No JSX elements found',
      suggestion: 'React components typically return JSX elements',
    })
  }

  // Check for common syntax issues
  const unclosedBraces = (componentCode.match(/{/g) || []).length - (componentCode.match(/}/g) || []).length
  if (unclosedBraces !== 0) {
    errors.push({
      type: 'syntax',
      message: `Mismatched braces: ${Math.abs(unclosedBraces)} ${unclosedBraces > 0 ? 'opening' : 'closing'} braces`,
      suggestion: 'Ensure all opening braces have corresponding closing braces',
    })
  }

  const unclosedParens = (componentCode.match(/\(/g) || []).length - (componentCode.match(/\)/g) || []).length
  if (unclosedParens !== 0) {
    errors.push({
      type: 'syntax',
      message: `Mismatched parentheses: ${Math.abs(unclosedParens)} ${unclosedParens > 0 ? 'opening' : 'closing'} parentheses`,
      suggestion: 'Ensure all opening parentheses have corresponding closing parentheses',
    })
  }

  // Check for unsupported features
  const hasClassComponent = /class\s+\w+\s+extends\s+(React\.)?Component/.test(componentCode)
  if (hasClassComponent) {
    warnings.push({
      type: 'compatibility',
      message: 'Class components detected',
      suggestion: 'Consider converting to functional components for better parsing support',
    })
  }

  const hasComplexPatterns = [
    { pattern: /React\.createElement/, name: 'React.createElement' },
    { pattern: /React\.cloneElement/, name: 'React.cloneElement' },
    { pattern: /React\.isValidElement/, name: 'React.isValidElement' },
    { pattern: /ReactDOM\.render/, name: 'ReactDOM.render' },
  ]

  for (const { pattern, name } of hasComplexPatterns) {
    if (pattern.test(componentCode)) {
      warnings.push({
        type: 'compatibility',
        message: `Complex React pattern detected: ${name}`,
        suggestion: 'This pattern may not be fully supported in parsing',
      })
    }
  }

  // Check for potential issues with dynamic imports
  if (/import\s*\(/.test(componentCode)) {
    warnings.push({
      type: 'compatibility',
      message: 'Dynamic imports detected',
      suggestion: 'Dynamic imports may not be fully resolved during parsing',
    })
  }

  // Check for experimental or advanced features
  const advancedFeatures = [
    { pattern: /Suspense/, name: 'React Suspense' },
    { pattern: /lazy\s*\(/, name: 'React.lazy' },
    { pattern: /useTransition/, name: 'useTransition' },
    { pattern: /useDeferredValue/, name: 'useDeferredValue' },
    { pattern: /startTransition/, name: 'startTransition' },
  ]

  for (const { pattern, name } of advancedFeatures) {
    if (pattern.test(componentCode)) {
      warnings.push({
        type: 'compatibility',
        message: `Advanced React feature detected: ${name}`,
        suggestion: 'This feature may require additional parsing support',
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export const createValidationError = (
  type: ValidationError['type'],
  message: string,
  suggestion?: string,
): ValidationError => {
  return { type, message, suggestion }
}

export const formatValidationResults = (result: ValidationResult): string => {
  const lines: string[] = []

  if (result.isValid) {
    lines.push('✅ Component validation passed')
  } else {
    lines.push('❌ Component validation failed')
  }

  if (result.errors.length > 0) {
    lines.push('\nErrors:')
    result.errors.forEach((error, index) => {
      lines.push(`  ${index + 1}. [${error.type.toUpperCase()}] ${error.message}`)
      if (error.suggestion) {
        lines.push(`     💡 ${error.suggestion}`)
      }
    })
  }

  if (result.warnings.length > 0) {
    lines.push('\nWarnings:')
    result.warnings.forEach((warning, index) => {
      lines.push(`  ${index + 1}. [${warning.type.toUpperCase()}] ${warning.message}`)
      if (warning.suggestion) {
        lines.push(`     💡 ${warning.suggestion}`)
      }
    })
  }

  return lines.join('\n')
}
