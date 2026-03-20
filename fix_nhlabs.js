const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'nhlabs.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove Next.js script tags and preloads
// Match <script src="/_next/..."></script> or <script>...__next_f...</script>
content = content.replace(/<script[^>]*src="\/_next\/[^>]*"[^>]*><\/script>/gi, '');
content = content.replace(/<script[^>]*src="\/_next\/[^>]*" async=""[^>]*><\/script>/gi, '');
content = content.replace(/<script[^>]*id="_R_" [^>]*><\/script>/gi, '');
content = content.replace(/<script[^>]*>self\.__next_f[^<]*<\/script>/gi, '');
content = content.replace(/<script[^>]*>\(self\.__next_f[^<]*<\/script>/gi, '');

// Remove preload font links and stylesheets from Next.js
content = content.replace(/<link rel="preload" href="\/_next\/[^>]*" as="font"[^>]*\/>/gi, '');
content = content.replace(/<link rel="stylesheet" href="\/_next\/[^>]*"[^>]*\/>/gi, '');

// 2. Insert Tailwind CSS CDN and config inside <head>
const tailwindInjection = `
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            bg2: '#121318',
            surface: '#1d1d20',
            'text-dim': '#a1a1aa',
            text: '#ffffff',
            'text-mid': '#e2e8f0'
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="src/styles.css">
`;

// Find </head> and insert before it
if (content.indexOf('</head>') > -1) {
  content = content.replace('</head>', `${tailwindInjection}</head>`);
}

// 3. Fix absolute paths on images and links to relative
content = content.replace(/href="\/"/g, 'href="index.html"');
content = content.replace(/href="\/origin"/g, 'href="origin.html"');
content = content.replace(/href="\/about"/g, 'href="about.html"');
content = content.replace(/href="\/research"/g, 'href="products.html"'); // Assuming research links to products?
content = content.replace(/href="\/contact"/g, 'href="contact.html"');

// Fix image links from absolute to local/relative
content = content.replace(/src="\/assets\//g, 'src="assets/');

// 4. Remove Next.js comment triggers that might cause issues
content = content.replace(/<!--\$-->/g, '');
content = content.replace(/<!--\/\$-->/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('nhlabs.html fixed successfully.');
