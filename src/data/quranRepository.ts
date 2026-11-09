// src/data/quranRepository.ts

import type {
  Surah,
  SurahContent,
  PageMeta,
  PageContent,
  PageItem,
} from '../types/quran';
import surahsData from './quran/surahs.json';
import pagesData from './quran/pages.json';
import { surahLoaders } from './quran/index';

const surahs: Surah[] = surahsData as Surah[];
const pagesMeta: PageMeta[] = pagesData.pages as PageMeta[];
const ayahToPageMap: Record<string, number> = pagesData.ayahToPage as Record<string, number>;
const surahPagesMap: Record<string, { startPage: number; endPage: number }> =
  pagesData.surahPages as Record<string, { startPage: number; endPage: number }>;

// Memory cache for parsed page content
const pageContentCache: Map<number, PageContent> = new Map();

export const quranRepository = {
  getSurahs(): Surah[] {
    return surahs;
  },

  getSurahMeta(surahNumber: number): Surah | undefined {
    return surahs.find((s) => s.number === surahNumber);
  },

  getSurah(surahNumber: number): SurahContent {
    const loader = surahLoaders[surahNumber];
    if (!loader) {
      throw new Error(`Surah ${surahNumber} not found`);
    }
    return loader();
  },

  getPageMeta(pageNumber: number): PageMeta | undefined {
    if (pageNumber < 1 || pageNumber > 604) return undefined;
    return pagesMeta[pageNumber - 1];
  },

  getPageForAyah(surah: number, ayah: number): number {
    const key = `${surah}:${ayah}`;
    return ayahToPageMap[key] || 1;
  },

  getSurahPages(surah: number): { startPage: number; endPage: number } {
    return surahPagesMap[String(surah)] || { startPage: 1, endPage: 1 };
  },

  getPageContent(pageNumber: number): PageContent {
    if (pageContentCache.has(pageNumber)) {
      return pageContentCache.get(pageNumber)!;
    }

    const meta = this.getPageMeta(pageNumber);
    if (!meta) {
      throw new Error(`Page ${pageNumber} out of range (1-604)`);
    }

    const pageSurahs = meta.surahs
      .map((sNum) => this.getSurahMeta(sNum))
      .filter((s): s is Surah => Boolean(s));

    const primarySurah = pageSurahs[0] || surahs[0];
    const items: PageItem[] = [];

    // Group ayahs by surah to insert banners and bismillah appropriately
    let currentSurahNumber: number | null = null;
    let currentSurahContent: SurahContent | null = null;

    for (const ref of meta.ayahs) {
      if (currentSurahNumber !== ref.surah) {
        currentSurahNumber = ref.surah;
        currentSurahContent = this.getSurah(ref.surah);
        const sMeta = this.getSurahMeta(ref.surah);

        // If this surah starts on this page (i.e. ref.ayah === 1)
        if (ref.ayah === 1 && sMeta) {
          items.push({
            type: 'surah_banner',
            surah: sMeta,
            key: `p${pageNumber}-banner-${sMeta.number}`,
          });

          if (sMeta.bismillahHeader) {
            items.push({
              type: 'bismillah',
              surahNumber: sMeta.number,
              key: `p${pageNumber}-bismillah-${sMeta.number}`,
            });
          }
        }
      }

      if (currentSurahContent) {
        const ayahObj = currentSurahContent.ayahs.find((a) => a.n === ref.ayah);
        if (ayahObj) {
          items.push({
            type: 'ayah',
            surahNumber: ref.surah,
            ayah: ayahObj,
            key: `p${pageNumber}-s${ref.surah}-a${ref.ayah}`,
          });
        }
      }
    }

    const content: PageContent = {
      pageNumber,
      juzNumber: meta.juz,
      primarySurah,
      surahs: pageSurahs,
      items,
    };

    pageContentCache.set(pageNumber, content);
    return content;
  },
};
