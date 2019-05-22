export interface I18nTranslationGroup {
  [locale: string]: string;
}

export interface I18nSource {
  [key: string]: I18nTranslationGroup;
}

declare class I18nRender {
  locale: string;

  constructor(options: { source: I18nSource; locale?: string; pageTextSource?: string; fullLangTag?: boolean })

  getLocale(): string;

  setLocale(params: { locale: string; persist?: boolean; rerender?: boolean }): void;

  getText(params: { key: string; locale?: string; fallback?: string }): string;

  render(): void;
}

export default I18nRender;
