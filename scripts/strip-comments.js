console.log('Starting strip-comments script...');

const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');
const glob = require('glob');

// Define file patterns to process
const patterns = [
  // Add or remove patterns as needed
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.js',
  'src/**/*.jsx',
];

// Exclude patterns - files to skip
const excludePatterns = ['**/node_modules/**', '**/__tests__/**', '**/test/**', '**/*.test.*', '**/*.spec.*'];

console.log('Stripping comments from files...');
console.log('Working directory:', process.cwd());

// Process each pattern
let processedCount = 0;
let errorCount = 0;
let skippedFiles = [];

patterns.forEach((pattern) => {
  const files = glob.sync(pattern, {
    cwd: process.cwd(),
    ignore: excludePatterns,
  });

  console.log(`Found ${files.length} files matching pattern: ${pattern}`);

  files.forEach((file) => {
    const filePath = path.resolve(process.cwd(), file);

    try {
      // Read the file
      const content = fs.readFileSync(filePath, 'utf8');

      // Skip files with syntax errors (quick check)
      if (content.includes('http:') && !content.includes('http://')) {
        console.log(`Skipping file with potential syntax error: ${file}`);
        skippedFiles.push(file);
        errorCount++;
        return;
      }

      // Additional syntax error checks
      if (
        content.includes('const') &&
        content.includes('=') &&
        content.includes(';') &&
        content.includes('await') &&
        content.includes('(') &&
        !content.match(/\)\s*;/g)
      ) {
        console.log(`Skipping file with potential missing parenthesis: ${file}`);
        skippedFiles.push(file);
        errorCount++;
        return;
      }

      try {
        // Strip comments
        const strippedContent = strip(content, {
          preserveNewlines: true,
          // Set to true if you want to keep JSDoc comments
          keepProtected: false,
        });

        // Write the file back
        fs.writeFileSync(filePath, strippedContent, 'utf8');
        console.log(`Processed: ${file}`);
        processedCount++;
      } catch (stripError) {
        console.error(`Error stripping comments from ${file}:`, stripError.message);
        errorCount++;
      }
    } catch (readError) {
      console.error(`Error reading file ${file}:`, readError.message);
      errorCount++;
    }
  });
});

console.log(`Comment stripping completed. Processed ${processedCount} files. Skipped ${errorCount} files with errors.`);

if (skippedFiles.length > 0) {
  console.log('Skipped files:');
  skippedFiles.forEach((file) => console.log(`- ${file}`));
}
