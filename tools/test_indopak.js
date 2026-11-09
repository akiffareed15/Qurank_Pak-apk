const fs = require('fs');
const path = require('path');

const indopakFile = path.resolve(__dirname, '../Quran/digital-khatt-indopak-ayah-by-ayah-script.json');
const translationFile = path.resolve(__dirname, 'source/translation.txt');
const metaFile = path.resolve(__dirname, 'source/quran-data.js');

const indopakData = JSON.parse(fs.readFileSync(indopakFile, 'utf-8'));

// Read meta
const ROW_REGEX = /\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*['"](.+?)['"]\s*,\s*['"](.+?)['"]\s*,\s*['"](.+?)['"]\s*,\s*['"](\w+)['"]\s*\]/g;
const metaText = fs.readFileSync(metaFile, 'utf-8');
const suras = [];
let match;
while ((match = ROW_REGEX.exec(metaText)) !== null) {
  suras.push({
    number: suras.length + 1,
    ayas: parseInt(match[2], 10),
    name_ar: match[5],
    name_tr: match[6],
    name_en: match[7],
  });
}

let totalAyahs = 0;
let errors = [];

for (let s of suras) {
  const i = s.number;
  const count = s.ayas;
  if (i === 1) {
    totalAyahs += 7;
    continue;
  }
  for (let a = 1; a <= count; a++) {
    const k = `${i}:${a}`;
    const v = indopakData[k];
    if (!v) {
      errors.push(`Missing: ${k}`);
    } else if (!v.text || !v.text.trim()) {
      errors.push(`Empty text: ${k}`);
    } else {
      totalAyahs++;
    }
  }
}

console.log('Total surahs:', suras.length);
console.log('Total ayahs checked:', totalAyahs);
console.log('Errors:', errors.length);
if (errors.length > 0) {
  console.log('First 5 errors:', errors.slice(0, 5));
}

