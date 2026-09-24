import fs from 'fs';
import path from 'path';

// Regex matching unicode emojis
const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}\u{2B50}\u{2705}\u{274C}\u{2728}\u{2709}\u{2708}\u{270F}\u{2714}\u{2716}\u{2764}\u{27A1}\u{2934}\u{2935}\u{2B05}\u{2B06}\u{2B07}\u{25B6}\u{25C0}\u{23F0}\u{23F3}]/gu;

function cleanDir(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') cleanDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (emojiRegex.test(content)) {
        console.log(`Cleaning emojis from: ${fullPath}`);
        // Remove emoji characters or replace with empty string/clean space
        const cleaned = content.replace(emojiRegex, '').replace(/[ \t]{2,}/g, ' ');
        fs.writeFileSync(fullPath, cleaned, 'utf8');
      }
    }
  }
}

cleanDir(path.resolve('src'));
console.log('Emoji cleanup completed successfully!');
