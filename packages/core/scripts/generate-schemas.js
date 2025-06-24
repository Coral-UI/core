#!/usr/bin/env node

const { exportAllSchemas } = require('../dist/node.cjs');
const { join } = require('path');
const { readFileSync } = require('fs');

// Read package.json to get version
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version.replace(/-development$/, ''); // Remove -development suffix

const outputDir = join(__dirname, '../schemas');

console.log('🔄 Generating JSON Schema files...');
console.log(`📦 Package version: ${version}`);

try {
  exportAllSchemas({
    outputDir,
    target: 'draft-2020-12',
    pretty: true,
    version,
    baseUrl: 'https://schemas.coral.design'
  });

  console.log('✅ JSON Schema generation completed successfully!');
  console.log(`📁 Schemas exported to: ${outputDir}`);
} catch (error) {
  console.error('❌ Schema generation failed:', error);
  process.exit(1);
}