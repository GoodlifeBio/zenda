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

let countRulers = 0;
let countBrands = 0;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const outputLines = [];
  
  let ignoreRuler = false;
  let rulerDepth = 0;
  
  let ignoreBrand = false;
  let brandDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // --- 1. HANDLE SCROLL RULER ---
    if (line.includes('<div class="scroll-ruler">')) {
      ignoreRuler = true;
      rulerDepth = 1;
      countRulers++;
      continue;
    }
    if (ignoreRuler) {
      rulerDepth += (line.split('<div').length - 1);
      rulerDepth -= (line.split('</div').length - 1);
      if (rulerDepth <= 0) {
        ignoreRuler = false;
      }
      continue;
    }

    // --- 2. HANDLE BRAND CONTAINER ---
    if (line.includes('<div class="brand-container">')) {
      ignoreBrand = true;
      brandDepth = 1;
      countBrands++;
      continue;
    }
    if (ignoreBrand) {
      brandDepth += (line.split('<div').length - 1);
      brandDepth -= (line.split('</div').length - 1);
      if (brandDepth <= 0) {
        ignoreBrand = false;
      }
      continue;
    }

    // Kept line if not ignoring
    outputLines.push(line);
  }

  if (outputLines.length !== lines.length) {
    fs.writeFileSync(file, outputLines.join('\n'), 'utf8');
    console.log(`Successfully updated layout in ${path.basename(file)}`);
  }
});

console.log(`Finished: Processed removals with safe buffer checks.`);
