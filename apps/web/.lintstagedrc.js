const path = require('path');

module.exports = {
  // JavaScript and TypeScript files
  '*.{js,jsx,ts,tsx}': (filenames) => [
    // Run Next.js linter with --fix on each file
    ...filenames.map((filename) => `next lint --fix --file ${filename}`),
    // Format with Prettier
    `prettier --write ${filenames.join(' ')}`,
  ],
  
  // JSON, CSS, and Markdown files
  '*.{json,css,md}': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
  ],
  
  // Package.json specifically
  'package.json': () => [
    'npm run type-check', // Ensure no TypeScript errors
  ],
};