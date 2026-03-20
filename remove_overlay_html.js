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
const target = '<div class="bg-video-overlay"></div>';

let count = 0;
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(target)) {
    content = content.replace(target, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Removed overlay in ${path.basename(file)}`);
    count++;
  }
});

console.log(`Finished: Removed overly in ${count} files.`);
