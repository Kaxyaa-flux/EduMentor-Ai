const fs = require("fs");
const path = require("path");

const replacements = [
  // Exact Tailwind class matches
  { regex: /bg-\[#0A0F1E\]/g, replace: "bg-background" },
  { regex: /bg-\[#111827\]/g, replace: "bg-card" },
  { regex: /bg-\[#1F2937\]/g, replace: "bg-accent" },
  { regex: /bg-\[#10B981\]/g, replace: "bg-primary" },
  { regex: /bg-\[#6366F1\]/g, replace: "bg-secondary" },
  { regex: /bg-\[#EF4444\]/g, replace: "bg-destructive" },
  { regex: /bg-\[#F59E0B\]/g, replace: "bg-warning" },
  { regex: /bg-\[#F9FAFB\]/g, replace: "bg-foreground" },

  // Text colors
  { regex: /text-\[#10B981\]/g, replace: "text-primary" },
  { regex: /text-\[#6366F1\]/g, replace: "text-secondary" },
  { regex: /text-\[#EF4444\]/g, replace: "text-destructive" },
  { regex: /text-\[#F59E0B\]/g, replace: "text-warning" },
  { regex: /text-\[#0A0F1E\]/g, replace: "text-primary-foreground" },
  { regex: /text-white/g, replace: "text-foreground" },
  { regex: /text-slate-400/g, replace: "text-muted-foreground" },
  { regex: /text-slate-500/g, replace: "text-muted-foreground" },
  { regex: /text-slate-100/g, replace: "text-foreground" },
  { regex: /text-slate-300/g, replace: "text-muted-foreground" },
  { regex: /text-\[#F9FAFB\]/g, replace: "text-foreground" },
  { regex: /text-\[#111827\]/g, replace: "text-foreground" }, // this depends on context, but let's assume it's for contrast

  // Borders
  { regex: /border-\[#1F2937\]/g, replace: "border-border" },
  { regex: /border-\[#111827\]/g, replace: "border-border" },
  { regex: /border-\[#10B981\]/g, replace: "border-primary" },
  { regex: /border-\[#6366F1\]/g, replace: "border-secondary" },
  { regex: /border-\[#EF4444\]/g, replace: "border-destructive" },

  // Rings and Outlines
  { regex: /ring-\[#10B981\]/g, replace: "ring-primary" },
  { regex: /ring-\[#6366F1\]/g, replace: "ring-secondary" },
  { regex: /ring-\[#1F2937\]/g, replace: "ring-border" },
  
  // Shadows
  { regex: /shadow-\[#10B981\]/g, replace: "shadow-primary" },
  { regex: /shadow-\[#6366F1\]/g, replace: "shadow-secondary" },
  
  // SVG Stroke/Fill
  { regex: /fill-\[#10B981\]/g, replace: "fill-primary" },
  { regex: /stroke-\[#10B981\]/g, replace: "stroke-primary" },
  { regex: /fill-\[#6366F1\]/g, replace: "fill-secondary" },
  { regex: /stroke-\[#6366F1\]/g, replace: "stroke-secondary" },
  { regex: /stroke-\[#1F2937\]/g, replace: "stroke-border" },
  
  // Raw Hex values in strings (like in Canvas or framer-motion variants)
  // Be careful with these - they need to be replaced with CSS variable references for standard web or specific rgb for canvas
  { regex: /"#10B981"/g, replace: '"var(--primary)"' },
  { regex: /'#10B981'/g, replace: "'var(--primary)'" },
  { regex: /"#6366F1"/g, replace: '"var(--secondary)"' },
  { regex: /'#6366F1'/g, replace: "'var(--secondary)'" },
  { regex: /"#0A0F1E"/g, replace: '"var(--background)"' },
  { regex: /'#0A0F1E'/g, replace: "'var(--background)'" },
  { regex: /"#111827"/g, replace: '"var(--card)"' },
  { regex: /'#111827'/g, replace: "'var(--card)'" },
  { regex: /"#1F2937"/g, replace: '"var(--border)"' },
  { regex: /'#1F2937'/g, replace: "'var(--border)'" },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      results.push(file);
    }
  });
  return results;
}

const files = walk("c:\\Users\\KANAK\\Documents\\GitHub\\EduMentor-Ai\\edumentor-ai\\src");
let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  let originalContent = content;
  
  // Skip global css
  if (file.includes("globals.css")) continue;

  for (const mapping of replacements) {
    content = content.replace(mapping.regex, mapping.replace);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, "utf8");
    console.log("Updated", file);
    updatedCount++;
  }
}

console.log(`Refactoring complete. Updated ${updatedCount} files.`);
