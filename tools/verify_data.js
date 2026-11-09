// tools/verify_data.js
const fs = require('fs');
const path = require('path');

const surahs = require('../src/data/quran/surahs.json');
console.log(`Checking ${surahs.length} surahs...`);

let totalAyahs = 0;
let errors = 0;

for (let s of surahs) {
  const padded = String(s.number).padStart(3, '0');
  const surahPath = path.resolve(__dirname, `../src/data/quran/surah_${padded}.json`);
  if (!fs.existsSync(surahPath)) {
    console.error(`File missing: surah_${padded}.json`);
    errors++;
    continue;
  }
  const content = JSON.parse(fs.readFileSync(surahPath, 'utf-8'));
  if (content.number !== s.number) {
    console.error(`Number mismatch in surah_${padded}.json`);
    errors++;
  }
  if (content.ayahs.length !== s.ayahCount) {
    console.error(`Ayah count mismatch in surah ${s.number}: expected ${s.ayahCount}, got ${content.ayahs.length}`);
    errors++;
  }
  for (let a of content.ayahs) {
    if (!a.ar || !a.tr) {
      console.error(`Empty text in surah ${s.number} ayah ${a.n}`);
      errors++;
    }
  }
  totalAyahs += content.ayahs.length;
}

console.log(`Verification: Total surahs: ${surahs.length}, Total ayahs: ${totalAyahs}, Errors: ${errors}`);
if (totalAyahs !== 6236 || errors > 0) {
  process.exit(1);
} else {
  console.log('DATA INTEGRITY VERIFIED: 100% PASS');
}

