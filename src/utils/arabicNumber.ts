// src/utils/arabicNumber.ts

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => ARABIC_DIGITS[parseInt(digit, 10)]);
}

