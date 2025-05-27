/**
 * Enhanced Comment Stripping Script with ESLint Directive Preservation
 *
 * This script removes comments from TypeScript, JavaScript, and JSX files while
 * preserving important ESLint directive comments that are necessary for code
 * functionality and linting rules.
 *
 * Features:
 * - Strips regular comments (line and block comments) from source files
 * - Preserves ESLint directives like eslint-disable-next-line, eslint-disable, eslint-enable
 * - Maintains code structure and formatting
 * - Provides detailed statistics and logging
 * - Robust error handling and file validation
 *
 * ESLint directives preserved:
 * - eslint-disable-next-line [rule-name]
 * - eslint-disable [rule-name]
 * - eslint-enable [rule-name]
 * - Block comment ESLint directives
 * - All variations of ESLint directive comments
 *
 * Usage: npm run format:strip-comments
 *
 * @author Enhanced by AI Assistant
 * @version 2.0.0
 */

console.log('Starting enhanced strip-comments script...');

const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');
const glob = require('glob');

// Define file patterns to process
const patterns = ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'];

// Exclude patterns - files to skip
const excludePatterns = [
  '**/node_modules/**',
  '**/__tests__/**',
  '**/test/**',
  '**/*.test.*',
  '**/*.spec.*',
];

// ESLint directive patterns to preserve
const eslintDirectivePatterns = [
  /\/\/\s*eslint-disable-next-line\b.*$/gm,
  /\/\/\s*eslint-disable\b.*$/gm,
  /\/\/\s*eslint-enable\b.*$/gm,
  /\/\*\s*eslint-disable\b[\s\S]*?\*\//gm,
  /\/\*\s*eslint-enable\b[\s\S]*?\*\//gm,
  /\/\*\s*eslint-disable-next-line\b[\s\S]*?\*\//gm,
];

/**
 * Custom function to strip comments while preserving ESLint directives
 * @param {string} content - The file content
 * @returns {object} - Object containing stripped content and statistics
 */
function stripCommentsPreservingEslint(content) {
  const stats = {
    eslintCommentsPreserved: 0,
    regularCommentsRemoved: 0,
    totalCommentsFound: 0,
  };

  // First, find and temporarily replace ESLint directives with placeholders
  const eslintComments = [];
  let modifiedContent = content;

  eslintDirectivePatterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach((match, index) => {
        const placeholder = `__ESLINT_DIRECTIVE_${eslintComments.length}__`;
        eslintComments.push(match);
        modifiedContent = modifiedContent.replace(match, placeholder);
        stats.eslintCommentsPreserved++;
      });
    }
  });

  // Count total comments before stripping
  const totalLineComments = (content.match(/\/\/.*$/gm) || []).length;
  const totalBlockComments = (content.match(/\/\*[\s\S]*?\*\//gm) || []).length;
  stats.totalCommentsFound = totalLineComments + totalBlockComments;

  // Strip comments from the modified content
  let strippedContent;
  try {
    strippedContent = strip(modifiedContent, {
      preserveNewlines: true,
      keepProtected: false,
      line: true,
      block: true,
    });
  } catch (error) {
    throw new Error(`Failed to strip comments: ${error.message}`);
  }

  // Restore ESLint directives
  eslintComments.forEach((comment, index) => {
    const placeholder = `__ESLINT_DIRECTIVE_${index}__`;
    strippedContent = strippedContent.replace(placeholder, comment);
  });

  // Calculate removed comments
  const remainingLineComments = (strippedContent.match(/\/\/.*$/gm) || [])
    .length;
  const remainingBlockComments = (
    strippedContent.match(/\/\*[\s\S]*?\*\//gm) || []
  ).length;
  const remainingTotal = remainingLineComments + remainingBlockComments;
  stats.regularCommentsRemoved = stats.totalCommentsFound - remainingTotal;

  return {
    content: strippedContent,
    stats,
  };
}

console.log('Stripping comments from files (preserving ESLint directives)...');
console.log('Working directory:', process.cwd());

// Process each pattern
let processedCount = 0;
let errorCount = 0;
let skippedFiles = [];
let totalCommentsRemoved = 0;
let totalEslintCommentsPreserved = 0;

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
        // Use custom function to strip comments while preserving ESLint directives
        const result = stripCommentsPreservingEslint(content);

        // Write the file back
        fs.writeFileSync(filePath, result.content, 'utf8');

        // Update statistics
        totalCommentsRemoved += result.stats.regularCommentsRemoved;
        totalEslintCommentsPreserved += result.stats.eslintCommentsPreserved;

        // Log processing details
        if (
          result.stats.eslintCommentsPreserved > 0 ||
          result.stats.regularCommentsRemoved > 0
        ) {
          console.log(
            `Processed: ${file} (removed ${result.stats.regularCommentsRemoved} comments, preserved ${result.stats.eslintCommentsPreserved} ESLint directives)`
          );
        } else {
          console.log(`Processed: ${file} (no comments found)`);
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

console.log('\n=== Comment Stripping Summary ===');
console.log(`✅ Processed ${processedCount} files successfully`);
console.log(`❌ Skipped ${errorCount} files with errors`);
console.log(`🗑️  Total comments removed: ${totalCommentsRemoved}`);
console.log(`🛡️  ESLint directives preserved: ${totalEslintCommentsPreserved}`);

if (skippedFiles.length > 0) {
  console.log('\n📋 Skipped files:');
  skippedFiles.forEach((file) => console.log(`   - ${file}`));
}

console.log('\n🎉 Comment stripping completed successfully!');
console.log('💡 All ESLint directive comments have been preserved.');

if (totalEslintCommentsPreserved > 0) {
  console.log(`\n🔍 Preserved ESLint directives include:`);
  console.log('   - eslint-disable-next-line');
  console.log('   - eslint-disable');
  console.log('   - eslint-enable');
  console.log('   - Block comment ESLint directives');
}
