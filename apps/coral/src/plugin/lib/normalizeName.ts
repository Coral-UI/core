export function normalizeName(name: string): string {
  // Remove all spaces and special characters and convert to camelCase
  return name
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (firstChar) => firstChar.toLowerCase())
}
