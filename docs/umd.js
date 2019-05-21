(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.I18nRender = factory());
}(this, function () { 'use strict';

  const PERSIST_KEY = 'i18n-render-locale';
  const LOCALE_FORMAT = /^\w{2}(-\w{2})?$/;
  const getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language || navigator.browserLanguage || 'cn';

  class I18NRender {
    constructor({ source, locale, pageTextLocale, fullLangTag = false }) {
      this.source = typeof source === 'object' ? source : {};
      if (typeof locale !== 'string') {
        const persistLocale = localStorage.getItem(PERSIST_KEY);
        if (LOCALE_FORMAT.test(persistLocale)) {
          this.locale = persistLocale;
        } else if (fullLangTag) {
          this.locale = getNavigatorLanguage();
        } else {
          const language = getNavigatorLanguage().split('-');
          this.locale = language[0];
        }
      } else {
        this.locale = locale;
      }
      this.pageTextLocale = pageTextLocale;
    }

    getLocale() {
      return this.locale;
    }

    setLocale({ locale, persist = false, rerender = true }) {
      if (!LOCALE_FORMAT.test(locale)) {
        return;
      }
      this.locale = locale;
      if (persist) {
        localStorage.setItem(PERSIST_KEY, locale);
      }
      if (rerender) {
        this.render();
      }
    }

    getText({ key, locale = this.locale, fallback = '' }) {
      const textPair = this.source[key];
      if (typeof textPair !== 'object') {
        return fallback;
      }
      const text = textPair[locale];
      const type = typeof text;
      if (type === 'number' || type === 'string') {
        return text;
      }
      return fallback;
    }

    render() {
      document.body.classList.add('i18n-render', `i18n-render-locale-${this.locale}`);
      if (this.locale === this.pageTextLocale) {
        return;
      }
      const elements = document.querySelectorAll('[ir]');
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const text = this.getText({
          key: element.getAttribute('ir'),
          locale: this.locale,
        });
        const type = typeof text;
        if (type === 'string' || type === 'number') {
          element.textContent = text;
        }
      }
      document.body.classList.add('i18n-render-rendered');
    }
  }

  return I18NRender;

}));
