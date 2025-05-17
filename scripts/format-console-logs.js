const fs = require('fs');
const path = require('path');
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

console.log('Formatting console.log statements...');

// Regular expression to match console.log statements with object arguments
// This regex is more conservative to avoid breaking code
const consoleLogRegex = /console\.(log|error|warn|info|debug)\s*\(\s*(['"`].*?['"`])\s*,\s*([a-zA-Z0-9_\.]+)\s*\)/g;

// Process each pattern
let processedCount = 0;
let updatedCount = 0;
let errorCount = 0;

patterns.forEach((pattern) => {
  const files = glob.sync(pattern, {
    cwd: process.cwd(),
    ignore: excludePatterns,
  });

  files.forEach((file) => {
    const filePath = path.resolve(process.cwd(), file);

    try {
      // Read the file
      let content = fs.readFileSync(filePath, 'utf8');

      // Skip files with syntax errors (quick check)
      if (content.includes('http:') && !content.includes('http://')) {
        console.log(`Skipping file with potential syntax error: ${file}`);
        errorCount++;
        return;
      }

      // Check if the file has any console.log statements with object arguments
      const hasConsoleLog = consoleLogRegex.test(content);
      consoleLogRegex.lastIndex = 0; // Reset regex index

      if (hasConsoleLog) {
        // Replace console.log statements with formatted versions
        const updatedContent = content.replace(consoleLogRegex, (match, method, message, object) => {
          // Skip if the object is already JSON.stringify
          if (object.includes('JSON.stringify')) {
            return match;
          }

          // Skip if the object is a simple string or number
          if (/^(['"`].*['"`]|\d+)$/.test(object.trim())) {
            return match;
          }

          // Skip complex expressions that might break when formatted
          if (object.includes('(') || object.includes(')') || object.includes('[') || object.includes(']')) {
            return match;
          }

          // Format the console.log statement - only format simple variable references
          return `console.${method}(${message}, ${object})`;
        });

        // Only write the file if changes were made
        if (content !== updatedContent) {
          fs.writeFileSync(filePath, updatedContent, 'utf8');
          console.log(`Updated console.log statements in: ${file}`);
          updatedCount++;
        }
      }

      processedCount++;
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message);
      errorCount++;
    }
  });
});

console.log(
  `Console.log formatting completed. Processed ${processedCount} files. Updated ${updatedCount} files. Skipped ${errorCount} files with errors.`
);
