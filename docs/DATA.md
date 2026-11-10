# Data — Quran text, translation, font

## Sources
1. **Arabic text:** Tanzil Uthmani — https://tanzil.net/download → type Uthmani, output "Text (with aya numbers)" → `quran-uthmani.txt` (format `sura|aya|text`).
   Licence: CC BY 3.0 — may be used in any app if Tanzil.net is credited with a link; **changing the text is not allowed**.
2. **Translation:** https://tanzil.net/trans → pick ONE (English or Urdu), same `sura|aya|text` format.
   ⚠ Tanzil's translations page says translations are **for non-commercial use only** unless permission is obtained from the translator/publisher. Q9 plans ads + subscriptions, so **confirm the translation and its licence with the Technical Lead (Raja Husnain Ali) before building on it.** For the internal first APK use one candidate, but note the issue in README.
3. **Surah metadata:** Tanzil `quran-data.js` (names, Ayah counts, Makki/Madani) — linked from tanzil.net/docs.
4. **Font:** open-licence Quran font (e.g. Amiri Quran, SIL OFL). Check licence, list in README.

## Put raw files here
```
tools/source/quran-uthmani.txt
tools/source/translation.txt
tools/source/quran-data.js
```

## Generate app data
```bash
python tools/convert_quran.py \
  --arabic tools/source/quran-uthmani.txt \
  --translation tools/source/translation.txt \
  --meta tools/source/quran-data.js \
  --out src/features/quran/data
```
Creates `surahs.json`, `surah_001.json … surah_114.json`, and `index.ts` (lazy loaders).

## JSON format
`surahs.json`
```json
[{"number":1,"nameArabic":"…","nameEnglish":"The Opening","nameTransliteration":"Al-Faatiha","ayahCount":7,"type":"Makki","bismillahHeader":false}]
```
`surah_002.json`
```json
{"number":2,"bismillahHeader":true,"ayahs":[{"n":1,"ar":"…","tr":"…"}]}
```
`bismillahHeader` is true for Surahs 2–114 except 9. If the Tanzil file has the Bismillah attached to Ayah 1, the script moves it to the header (letters untouched).

## Validation checklist (must pass)
- [ ] 114 Surah files + `surahs.json` + `index.ts`
- [ ] Total Ayahs = 6236 (script prints it, exits with error otherwise)
- [ ] Every Ayah has non-empty `ar` and `tr`
- [ ] Surah 1, 2, 9, 36, 112, 114 look right on a real device (marks not clipped)
- [ ] Surah 1 and 9 have no Bismillah header
- [ ] Spot-check 5 random Ayahs against tanzil.net
- [ ] Sources + licences listed in README; Tanzil credit + link visible in app (Settings footer)
