export type DesignTokenType = 'color' | 'dimension' | 'string' | 'number'

export interface DesignToken {
  id: string
  libraryId: string
  name: string
  $type?: DesignTokenType
  $description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDesignTokenInput {
  libraryId: string
  name: string
  $type?: DesignTokenType
  $description?: string
}

export interface UpdateDesignTokenInput {
  name?: string
  $type?: DesignTokenType
  $description?: string
}

export interface Theme {
  id: string
  libraryId: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateThemeInput {
  libraryId: string
  name: string
  description?: string
}

export interface UpdateThemeInput {
  name?: string
  description?: string
}

export interface ThemeOption {
  id: string
  themeId: string
  name: string
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateThemeOptionInput {
  themeId: string
  name: string
  isDefault?: boolean
}

export interface UpdateThemeOptionInput {
  name?: string
  isDefault?: boolean
}

export interface TokenValue {
  id: string
  tokenId: string
  themeOptionId: string
  $value: string | number
  createdAt: string
  updatedAt: string
}

export interface CreateTokenValueInput {
  tokenId: string
  themeOptionId: string
  $value: string | number
}

export interface UpdateTokenValueInput {
  $value?: string | number
}
