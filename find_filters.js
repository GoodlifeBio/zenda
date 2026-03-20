const fs = require('fs');

const css = fs.readFileSync('src/styles.css', 'utf8');
const lines = css.split('\n');

console.log('Searching for "filter" or "blur" or "bg-video":');
lines.forEach((line, index) => {
  const l = line.toLowerCase();
  if (l.includes('filter') || l.includes('blur') || l.includes('bg-video')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
