const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules') && !file.includes('.cursor') && !file.includes('.vscode')) {
        results = results.concat(walk(file));
      }
    } else { 
      if (file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const htmlFiles = walk(__dirname);

let countButtons = 0;
let countLogos = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Remove theme toggle button
  // Matches <button class="theme-toggle" ...> ... </button>
  const toggleRegex = /<button[^>]*class="[^"]*theme-toggle[^"]*"[^>]*>([\s\S]*?)<\/button>/gi;
  if (toggleRegex.test(content)) {
    content = content.replace(toggleRegex, '');
    countButtons++;
  }

  // 2. Remove logo image
  // Matches <img src="..." class="logo-img"> or variations
  const logoRegex = /<img[^>]*class="[^"]*logo-img[^"]*"[^>]*>/gi;
  if (logoRegex.test(content)) {
    content = content.replace(logoRegex, '');
    countLogos++;
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated elements in ${path.basename(file)}`);
  }
});

console.log(`Finished: Removed buttons on ${countButtons} files, logo images on ${countLogos} files.`);
