const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const hooks = ['useState', 'useEffect', 'useRef', 'usePathname', 'useRouter', 'useSession', 'useReducedMotion', 'useTheme'];

walk('src').forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasHook = hooks.some(h => content.includes(h));
  const hasDirective = content.startsWith('"use client"') || content.startsWith("'use client'");
  if (hasHook && !hasDirective) {
    console.log(f);
  }
});
