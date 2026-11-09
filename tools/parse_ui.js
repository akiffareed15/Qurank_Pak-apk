const fs = require('fs');
const xml = fs.readFileSync('C:\\Users\\A K I F\\.gemini\\antigravity\\brain\\071a567f-a1a1-4dda-a8b6-bdd970e1a3c5\\uidump.xml', 'utf8');
const regex = /text="([^"]+)"[^>]*bounds="([^"]+)"/g;
let m;
while ((m = regex.exec(xml)) !== null) {
  if (m[1].trim()) {
    console.log(`${m[1]} -> ${m[2]}`);
  }
}

