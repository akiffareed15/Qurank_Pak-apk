# PRD — Quran Reading App (MVP)

## Concept
A clean, fast, offline Quran reader: open any Surah, read Arabic with one translation, continue exactly where you left off. Respectful, distraction-free, no clutter.

**Users:** Muslims who read daily on their phone, including people with limited or no internet.

## Product feel (mandatory)
- Beautiful, calm Home screen; very little text; no extra buttons.
- Simple emerald-green + white look, light and dark.
- Light animations throughout (see docs/DESIGN.md → Animations).
- Reader screen is clean: Arabic + translation only, one small bookmark icon per Ayah.

## MVP features (all must be done)

### 1. Splash + Home
- Simple branded splash (placeholder name/icon), then Home.
- Home has 3 entries: **Surah List**, **Continue Reading**, **Bookmarks** (+ Settings icon).
- *Done when:* all buttons navigate correctly; Continue shows "Start reading" if nothing read yet.

### 2. Surah list
- All 114 Surahs: number, Arabic name, English name, Ayah count, Makki/Madani.
- *Done when:* 114 rows scroll smoothly; tap opens the reader.

### 3. Search
- Search field on the Surah list: filter by English name, Arabic name, or number.
- *Done when:* "2", "baqara", "الفاتحة" all filter correctly.

### 4. Reading screen
- Surah header; Bismillah header (not for Surah 1 and 9); each Ayah: Arabic + Ayah number + translation below.
- Toggle to show/hide translation.
- Bookmark icon on every Ayah.
- *Done when:* all 114 Surahs open with correct text, no clipped marks.

### 5. Continue reading
- Save last Surah + Ayah while scrolling; Home button reopens exactly there.
- *Done when:* survives closing and reopening the app.

### 6. Bookmarks
- Bookmark/unbookmark any Ayah; one list (Surah name, Ayah no., short preview); tap to open at that Ayah; remove.
- *Done when:* survives app restart.

### 7. Settings
- Arabic font size, translation font size (sliders with live preview), theme Light / Dark / System.
- *Done when:* changes apply instantly and are saved.

### 8. Offline
- All text bundled in the APK. No network calls.
- *Done when:* works fully in airplane mode.

### 9. Animations (mandatory)
- Every item in the DESIGN.md animation table is implemented.
- *Done when:* app feels smooth (no jank) on a real device, and reduce-motion is respected.

## Out of scope (do NOT build)
Juz navigation, audio, more translations, translation search, daily notification, prayer times, Qibla, tasbeeh, duas, notes, sharing, paywall, analytics.

## Definition of Done
- APK installs and runs without crashes on a real device.
- All 114 Surahs open with correct Arabic text and translation.
- Continue reading, bookmarks, settings survive close/reopen.
- Works fully in airplane mode.
- Tested on 1 real device + 1 emulator, portrait, dark mode.
- README complete (build, done, pending, sources).
