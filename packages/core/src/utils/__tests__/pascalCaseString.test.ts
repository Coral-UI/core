import { pascalCaseString } from '../pascalCaseString'

describe('pascalCaseString', () => {
  it('should convert kebab-case to PascalCase', () => {
    expect(pascalCaseString('hello-world')).toBe('HelloWorld')
    expect(pascalCaseString('my-component-name')).toBe('MyComponentName')
  })

  it('should convert snake_case to PascalCase', () => {
    expect(pascalCaseString('hello_world')).toBe('HelloWorld')
    expect(pascalCaseString('user_profile_data')).toBe('UserProfileData')
  })

  it('should convert space-separated words to PascalCase', () => {
    expect(pascalCaseString('hello world')).toBe('HelloWorld')
    expect(pascalCaseString('my component name')).toBe('MyComponentName')
  })

  it('should handle mixed separators', () => {
    expect(pascalCaseString('hello-world_test space')).toBe('HelloWorldTestSpace')
    expect(pascalCaseString('user-profile_data name')).toBe('UserProfileDataName')
  })

  it('should handle single words', () => {
    expect(pascalCaseString('hello')).toBe('Hello')
    expect(pascalCaseString('WORLD')).toBe('World')
  })

  it('should handle empty string', () => {
    expect(pascalCaseString('')).toBe('')
  })

  it('should handle numbers', () => {
    expect(pascalCaseString('component-123')).toBe('Component123')
    expect(pascalCaseString('test_42_name')).toBe('Test42Name')
  })

  it('should handle special characters', () => {
    expect(pascalCaseString('my-component!')).toBe('MyComponent!')
    expect(pascalCaseString('test@email')).toBe('Test@email')
  })

  it('should handle multiple consecutive separators', () => {
    expect(pascalCaseString('hello--world')).toBe('HelloWorld')
    expect(pascalCaseString('test___name')).toBe('TestName')
    expect(pascalCaseString('component   name')).toBe('ComponentName')
  })
})