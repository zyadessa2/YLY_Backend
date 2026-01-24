import fs from 'fs';
import path from 'path';

const projectDir = path.resolve('./src'); // مسار المشروع

// هيدور على كل ملفات ts
function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.ts')) {
            fixImports(fullPath);
        }
    });
}

// يضيف .js لكل import محلي
function fixImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const importRegex = /import\s+([\s\S]+?)\s+from\s+['"](.+?)['"]/g;

    content = content.replace(importRegex, (match, vars, modPath) => {
        // نضيف .js لو المسار محلي ويخلص بـ / أو لا يحتوي على امتداد
        if (
            modPath.startsWith('./') ||
            modPath.startsWith('../')
        ) {
            if (!modPath.endsWith('.js') && !modPath.includes('.ts')) {
                modPath += '.js';
            }
        }
        return `import ${vars} from '${modPath}'`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed imports in: ${filePath}`);
}

// شغّل الـ script
walk(projectDir);
console.log('🎉 Finished fixing all local imports!');
