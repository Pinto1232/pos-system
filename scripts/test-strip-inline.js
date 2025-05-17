console.log('Testing strip-comments on a single file...');

const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

// Path to the test file
const testFilePath = path.join(__dirname, 'test-strip-comments.js');
const outputFilePath = path.join(__dirname, 'test-strip-comments-output.js');

try {
  // Read the test file
  console.log(`Reading file: ${testFilePath}`);
  const content = fs.readFileSync(testFilePath, 'utf8');

  console.log('\nOriginal content:');
  console.log('----------------');
  console.log(content);

  // Count inline comments before stripping
  const inlineCommentMatches = (content.match(/\/\/.*$/gm) || []).length;
  console.log(`\nFound ${inlineCommentMatches} inline comments`);

  // Strip comments with enhanced options
  const strippedContent = strip(content, {
    preserveNewlines: true,
    keepProtected: false,
    line: true,
    block: true,
  });

  // Count inline comments after stripping
  const remainingInlineComments = (strippedContent.match(/\/\/.*$/gm) || [])
    .length;
  const removedComments = inlineCommentMatches - remainingInlineComments;

  console.log('\nStripped content:');
  console.log('----------------');
  console.log(strippedContent);

  console.log(`\nRemoved ${removedComments} inline comments`);

  // Write the output to a new file for comparison
  fs.writeFileSync(outputFilePath, strippedContent, 'utf8');
  console.log(`\nOutput written to: ${outputFilePath}`);
} catch (error) {
  console.error('Error:', error.message);
}
