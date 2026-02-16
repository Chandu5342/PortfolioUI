import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function removeTypeScript(content) {
  // Remove import type annotations
  content = content.replace(/import\s+type\s+\{[^}]*\}\s+from/g, 'import {');
  content = content.replace(/import\s+type\s+\{[^}]*\}/g, '');
  
  // Remove interface definitions (multiline)
  content = content.replace(/interface\s+\w+\s*\{[\s\S]*?\n\}/g, '');
  
  // Remove type definitions
  content = content.replace(/type\s+\w+\s*=\s*[^;]*;/g, '');
  
  // Remove generic type parameters from React.forwardRef ONLY
  content = content.replace(/React\.forwardRef\s*<[\s\S]*?>/g, 'React.forwardRef');
  
  // Remove : Type annotations in function parameters and declarations (but NOT in JSX)
  // This regex is more careful to avoid JSX tags
  content = content.replace(/(?<=[,\(])\s*\w+\s*:\s*[\w<>|\[\].\s]+(?=[,\)])/g, (match) => {
    // Remove the type annotation but keep the parameter name
    return match.replace(/:\s*[\w<>|\[\].\s]+/g, '');
  });
  
  // Remove type annotations after = in const declarations
  content = content.replace(/const\s+(\w+)\s*:\s*[\w<>|\[\].\s]+\s*=/g, 'const $1 =');
  
  // Remove non-null assertion operator (but be careful with JSX)
  content = content.replace(/([a-zA-Z_][\w$]*)\!/g, '$1');
  
  // Remove readonly keyword
  content = content.replace(/\breadonly\s+/g, '');
  
  return content;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const converted = removeTypeScript(content);
    fs.writeFileSync(filePath, converted, 'utf8');
    console.log(`✓ Converted: ${filePath}`);
  } catch (err) {
    console.error(`✗ Error processing ${filePath}:`, err.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.jsx')) {
      processFile(fullPath);
    }
  });
}

walkDir(path.join(__dirname, 'src'));
console.log('\nConversion complete!');
