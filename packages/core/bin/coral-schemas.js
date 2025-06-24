#!/usr/bin/env node

const { exportAllSchemas } = require('../dist/node.cjs');
const { program } = require('commander');
const { join } = require('path');
const { readFileSync } = require('fs');

// Read package.json to get version
const packageJsonPath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const packageVersion = packageJson.version.replace(/-development$/, '');

program
  .name('coral-schemas')
  .description('Generate JSON Schema files from Coral Zod schemas')
  .version(packageVersion);

program
  .option('-o, --output <dir>', 'Output directory for schemas', './schemas')
  .option('-t, --target <target>', 'JSON Schema draft version', 'draft-2020-12')
  .option('-v, --version <version>', 'Schema version', packageVersion)
  .option('-b, --base-url <url>', 'Base URL for schema IDs', 'https://schemas.coral.design')
  .option('--no-pretty', 'Disable pretty printing')
  .action((options) => {
    console.log('🔄 Generating JSON Schema files...');
    console.log(`📦 Schema version: ${options.version}`);
    console.log(`📁 Output directory: ${options.output}`);

    try {
      exportAllSchemas({
        outputDir: options.output,
        target: options.target,
        pretty: options.pretty,
        version: options.version,
        baseUrl: options.baseUrl
      });

      console.log('✅ JSON Schema generation completed successfully!');
    } catch (error) {
      console.error('❌ Schema generation failed:', error);
      process.exit(1);
    }
  });

program.parse();