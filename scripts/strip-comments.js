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
  'scripts/test-strip-comments.js', // Include our test file
];

// Exclude patterns - files to skip
const excludePatterns = [
  '**/node_modules/**',
  '**/__tests__/**',
  '**/test/**',
  '**/*.test.*',
  '**/*.spec.*',
];

console.log('Stripping comments from files...');
console.log('Working directory:', process.cwd());

// Process each pattern
let processedCount = 0;
let errorCount = 0;
let skippedFiles = [];
let inlineCommentsRemoved = 0;

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
        console.log(
          `Skipping file with potential missing parenthesis: ${file}`
        );
        skippedFiles.push(file);
        errorCount++;
        return;
      }

      try {
        // Count inline comments before stripping
        const inlineCommentMatches = (content.match(/\/\/.*$/gm) || []).length;

        // Strip comments with enhanced options to ensure all comments are removed
        const strippedContent = strip(content, {
          // Preserve newlines to maintain code structure
          preserveNewlines: true,
          // Set to false to remove all comments including JSDoc
          keepProtected: false,
          // Ensure both line and block comments are removed
          line: true,
          block: true,
        });

        // Count inline comments after stripping
        const remainingInlineComments = (
          strippedContent.match(/\/\/.*$/gm) || []
        ).length;
        const removedInThisFile =
          inlineCommentMatches - remainingInlineComments;
        inlineCommentsRemoved += removedInThisFile;

        // Write the file back
        fs.writeFileSync(filePath, strippedContent, 'utf8');

        if (removedInThisFile > 0) {
          console.log(
            `Processed: ${file} (removed ${removedInThisFile} inline comments)`
          );
        } else {
          console.log(`Processed: ${file}`);
        }

        processedCount++;
      } catch (stripError) {
        console.error(
          `Error stripping comments from ${file}:`,
          stripError.message
        );
        errorCount++;
      }
    } catch (readError) {
      console.error(`Error reading file ${file}:`, readError.message);
      errorCount++;
    }
  });
});

console.log(
  `Comment stripping completed. Processed ${processedCount} files. Skipped ${errorCount} files with errors.`
);
console.log(`Total inline comments removed: ${inlineCommentsRemoved}`);

if (skippedFiles.length > 0) {
  console.log('Skipped files:');
  skippedFiles.forEach((file) => console.log(`- ${file}`));
}
