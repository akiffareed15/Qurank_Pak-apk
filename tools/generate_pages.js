// tools/generate_pages.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const metaContent = fs.readFileSync(path.join(__dirname, 'source/quran-data.js'), 'utf-8');
const sandbox = {};
vm.runInNewContext(metaContent, sandbox);

const rawPages = sandbox.QuranData.Page;
const rawJuz = sandbox.QuranData.Juz;
const surahs = require('../src/data/quran/surahs.json');

function getJuz(s, a) {
  let j = 1;
  for (let i = 1; i <= 30; i++) {
    const [js, ja] = rawJuz[i];
    if (s > js || (s === js && a >= ja)) {
      j = i;
    } else {
      break;
    }
  }
  return j;
}

const pagesList = [];
const ayahToPage = {};
const surahPages = {};

for (let p = 1; p <= 604; p++) {
  const [s1, a1] = rawPages[p];
  const [nextS, nextA] = rawPages[p + 1];

  const pageSurahs = new Set();
  const ayahs = [];

  let currS = s1;
  let currA = a1;

  while (currS < nextS || (currS === nextS && currA < nextA)) {
    pageSurahs.add(currS);
    const key = `${currS}:${currA}`;
    ayahToPage[key] = p;

    if (!surahPages[currS]) {
      surahPages[currS] = { startPage: p, endPage: p };
    } else {
      surahPages[currS].endPage = p;
    }

    ayahs.push({ surah: currS, ayah: currA });

    const sMeta = surahs[currS - 1];
    if (currA < sMeta.ayahCount) {
      currA++;
    } else {
      currS++;
      currA = 1;
    }
  }

  pagesList.push({
    page: p,
    juz: getJuz(s1, a1),
    start: { surah: s1, ayah: a1 },
    surahs: Array.from(pageSurahs),
    ayahs,
  });
}

const output = {
  pages: pagesList,
  ayahToPage,
  surahPages,
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/quran/pages.json'),
  JSON.stringify(output, null, 2),
  'utf-8'
);

console.log('SUCCESS: Generated pages.json with 604 pages.');
console.log('Surah 1 pages:', surahPages[1]);
console.log('Surah 2 pages:', surahPages[2]);
console.log('Surah 114 pages:', surahPages[114]);

