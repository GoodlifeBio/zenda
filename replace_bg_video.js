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

const findStr = '<canvas id="hero-canvas"></canvas>';
const replaceStr = `  <video autoplay loop muted playsinline class="bg-video">
    <source src="https://image2url.com/r2/default/videos/1773898555939-ea81c21e-30d4-480d-bc1f-aff8e0eb6216.mp4" type="video/mp4">
  </video>
  <div class="bg-video-overlay"></div>`;

let count = 0;
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(findStr)) {
    content = content.replace(findStr, replaceStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${path.basename(file)}`);
    count++;
  }
});

console.log(`Finished checking and updating ${count} files.`);
