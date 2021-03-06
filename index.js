const PERSIST_KEY = 'i18n-render-locale';
const LOCALE_FORMAT = /^\w{2}(-\w{2})?$/;
const detectStorage = typeof localStorage !== 'undefined';
const getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language || navigator.browserLanguage || 'cn';

export default class I18NRender {
  constructor({ source, locale, pageTextLocale, fullLangTag = false }) {
    this.source = typeof source === 'object' ? source : {};
    if (typeof locale !== 'string') {
      let persistLocale = '';
      if (detectStorage) {
        persistLocale = localStorage.getItem(PERSIST_KEY);
      }
      if (persistLocale && LOCALE_FORMAT.test(persistLocale)) {
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
    if (persist && detectStorage) {
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
    const bodyClasses = document.body.classList;
    if (!bodyClasses.contains('i18n-render')) {
      bodyClasses.add('i18n-render');
    }
    const bodyClass = `i18n-render-locale-${this.locale}`;
    // If the page is originally this locale, it will not be rendered for the first time.
    if (typeof this.lastLocaleClass === 'undefined' && this.locale === this.pageTextLocale) {
      return;
    }
    // do not rerender if the locale was not changed actually
    if (this.lastLocaleClass === bodyClass) {
      return;
    }
    bodyClasses.remove(this.lastLocaleClass, 'i18n-render-rendered');
    this.lastLocaleClass = bodyClass;
    bodyClasses.add(bodyClass);
    this.renderText();
    this.renderSource();
    bodyClasses.add('i18n-render-rendered');
  }

  renderText() {
    const elements = document.querySelectorAll('[ir]');
    const len = elements.length;
    if (len === 0) {
      return;
    }
    for (let i = 0; i < len; i++) {
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
  }

  renderSource() {
    const elements = document.querySelectorAll('[ir-src]');
    const len = elements.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        const element = elements[i];
        const text = this.getText({
          key: element.getAttribute('ir-src'),
          locale: this.locale,
        });
        const type = typeof text;
        if (type === 'string') {
          element.src = text;
        }
      }
    }
    const srcsetElements = document.querySelectorAll('[ir-srcset]');
    const len2 = srcsetElements.length;
    if (len2) {
      for (let i = 0; i < len2; i++) {
        const element = srcsetElements[i];
        const text = this.getText({
          key: element.getAttribute('ir-srcset'),
          locale: this.locale,
        });
        const type = typeof text;
        if (type === 'string') {
          element.srcset = text;
        }
      }
    }
  }
}
