// src/theme/colors.ts

export type ColorTokens = {
  primary: string;
  primaryDeep: string;
  primarySoft: string;
  onPrimary: string;
  onPrimaryMuted: string;
  background: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  danger: string;
};

export const lightColors: ColorTokens = {
  primary: '#0D6646',
  primaryDeep: '#084830',
  primarySoft: '#E6F3EC',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255,255,255,0.85)',
  background: '#F8FAF9',
  card: '#FFFFFF',
  text: '#091A13', // Ultra-high contrast deep black-emerald for razor-sharp readability
  textMuted: '#2C3E36', // Rich dark slate, never washed-out or faint
  border: '#D0DDD5',
  danger: '#B3261E',
};

export const darkColors: ColorTokens = {
  primary: '#3DB88A',
  primaryDeep: '#0F3D2C',
  primarySoft: '#173A2D',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255,255,255,0.72)',
  background: '#0A1612',
  card: '#11241C',
  text: '#E8F2ED',
  textMuted: '#8FA79B',
  border: '#1F3A2E',
  danger: '#F2B8B5',
};

