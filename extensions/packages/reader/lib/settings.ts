export interface ReaderSettings {
  fontFamily: 'serif' | 'sans' | 'mono';
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
}

export const READER_STORAGE_KEY = 'reader_settings';

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontFamily: 'serif',
  fontSize: 18,
  theme: 'sepia',
};
