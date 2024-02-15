const fs = require('fs');

// Read concatenated JavaScript and CSS files
const jsContent = fs.readFileSync('dist/all-scripts.js', 'utf8');
const cssContent = fs.readFileSync('dist/all-styles.css', 'utf8');

// HTML template for the script file
const scriptHtmlContent = `
  <script defer type="module">${jsContent}</script>
`;

// HTML template for the style file
const styleHtmlContent = `
  <style>${cssContent}</style>
`;

const htmlContent = `
  <style>${cssContent}</style>
  <script defer type="module">${jsContent}</script>
`;

// Write script HTML file
fs.writeFileSync('dist/script.html', scriptHtmlContent);

// Write all HTML file
fs.writeFileSync('dist/all.html', htmlContent);

// Write style HTML file
fs.writeFileSync('dist/style.html', styleHtmlContent);
