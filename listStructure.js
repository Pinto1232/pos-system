import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function listDirectory(dir, depth = 0) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (file !== 'node_modules' && file !== 'hooks') {
      console.log('  '.repeat(depth) + file);

      if (isDirectory) {
        listDirectory(fullPath, depth + 1);
      }
    }
  });
}

const projectDir = __dirname; 
listDirectory(projectDir);