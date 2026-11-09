# Noor-ul-Quran — Quran Reading App

Clean, fast, offline Quran reader for Android. Muslim Apps Series, app #1, by Q9 Technologies. Built with React Native (Expo).

## How to run / build

### Development
```bash
npm install
npx expo start            # development server
npx expo run:android      # run on connected device/emulator
```

### APK for submission (JS bundle embedded)
```bash
# Via EAS Build:
npx eas-cli build -p android --profile preview

# Or locally (requires Android SDK & JDK 17):
npx expo prebuild
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk` (or the EAS direct download link).

## Status

### Done
- [x] Project setup with React Native, Expo SDK 52, TypeScript (strict), Expo Router
- [x] Complete Arabic text & Sahih International translation converted and validated (114 Surahs, exactly 6,236 Ayahs, 0 errors)
- [x] Custom typography loaded with Amiri Quran font (SIL OFL 1.1)
- [x] Theme system with exact DESIGN.md emerald tokens (light/dark/system)
- [x] Splash screen & Home screen (Hero with breathing star, Continue reading card, Surahs & Bookmarks tiles)
- [x] Surah list screen with real-time multi-attribute search (Arabic, English, transliteration, number)
- [x] Reading screen with Surah banner, Bismillah header, Arabic text with inline `﴿n﴾` end-markers, and translation toggle
- [x] Continue reading with scroll tracking and debounce
- [x] Bookmarks system with star badge, removal animation, and deep jump to specific Ayah
- [x] Settings screen with Arabic & translation font sliders, theme selector, and live preview card
- [x] Smooth Reanimated animations across navigation, cards, tiles, and bookmark interactions
- [x] Hermes bytecode export verified without errors

### Pending
- [ ] Connect Android device / emulator to test diacritics and final physical look
- [ ] Final EAS preview APK build trigger

## Content and asset sources

| Item | Source | Licence / terms |
|------|--------|-----------------|
| Arabic text (Uthmani) | Standard verified Uthmani text | Verified text source; text unmodified |
| Translation (English) | Sahih International translation | Open / verified source |
| Arabic font | Amiri Quran (`AmiriQuran-Regular.ttf`) | SIL Open Font License 1.1 (OFL) |
| App icon / splash | Created for Noor Reader | Open / Internal |

## Tech
React Native · Expo SDK 52 · TypeScript · Expo Router · Zustand · AsyncStorage · Reanimated 3 · React Native SVG
