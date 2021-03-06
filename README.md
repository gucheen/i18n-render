# i18n-render
[![Build Status](https://travis-ci.com/gucheen/i18n-render.svg?branch=master)](https://travis-ci.com/gucheen/i18n-render)
[![npm version](http://img.shields.io/npm/v/i18n-render.svg?style=flat)](https://npmjs.org/package/i18n-render "View this project on npm")

tiny i18n solution for tiny projects.

## Design

The i18n-render's structure is `key -> translation dictionary`. While the translation dict is `locale -> text`.

In short, i18n-render take a `key` to get the translation dictionary, then get translated text with `locale`.

i18n-render will find all related HTML attributes(`ir`, `ir-src`, `ir-srcset`), get `key` from attributes' values.

## Source Configuration

```js
const source = {
  example1: {
    en: 'I can eat glass and it doesn\'t hurt me.',
    fr: 'Je peux manger du verre, ça ne me fait pas mal.',
    de: 'Ich kann Glas essen, ohne mir zu schaden.',
    'zh-CN': '我能吞下玻璃而不伤身体。',
    'zh-HK': '我能吞下玻璃而不傷身體。',
    jp: '私はガラスを食べられます。それは私を傷つけません。',
  },
  example_image: {
    en: 'https://source-image.path/en.jpg',
    fr: 'https://source-image.path/fr.jpg',
    de: 'https://source-image.path/de.jpg',
    'zh-CN': 'https://source-image.path/zh-CN.jpg',
    'zh-HK': 'https://source-image.path/zh-HK.jpg',
    jp: 'https://source-image.path/jp.jpg',
  },
};

// or
const source = {
  example1: {
    'en-US': 'I can eat glass and it doesn\'t hurt me.',
    'fr-FR': 'Je peux manger du verre, ça ne me fait pas mal.',
    'de-DE': 'Ich kann Glas essen, ohne mir zu schaden.',
    'zh-CN': '我能吞下玻璃而不伤身体。',
    'zh-HK': '我能吞下玻璃而不傷身體。',
    'jp-JP': '私はガラスを食べられます。それは私を傷つけません。',
  },
};
```

## Usage
```html
<body>
  <p ir="example1">这是一段默认的中文</p>
  <img src="https://default-image.path" alt="" ir-src="example_image">
  <img src="" alt="" ir-srcset="example_image_srcset">
</body>
```
```js
// import I18nRender from 'i18n-render';

const i18n = new I18nRender({
  source,
  pageTextLocale: 'zh',
});
document.addEventListener('DOMContentLoaded', () => {
  i18n.render();
});
```

### CSS Classes

CSS classes `i18n-render`, `i18n-render-locale-[currentLocale]`, `i18n-render-rendered` will be added to html `body`.

Make it easy to define different CSS in different i18n state.

`i18n-render-rendered` will only be added after the actual text replacement has occurred.


## API

### class I18nRender constructor

| parameter | value | description |
| --- | --- | --- |
| source | `Object<string, string>` | Translation dictionaries for various languages|
| locale | `string` | Set locale directly instead of auto detect|
| pageTextLocale | `string` | If your page already has text in a certain language, setting this parameter can prevent the re-rendering of this language, and you do not need to provide the translation of this language.
| fullLangTag | `boolean` | I18n-render uses a short locale tag by default, such as `en`, `fr`, `de`, `jp`. However, languages can distinguish regions, such as `zh-CN` and `zh-HK`, which need two different translation versions. In this case, `fullLangTag: true` can be set, and the configuration items of the language will become complete modes, such as `en-US` and `zh-CN`

### getLocale() => string

Get the current locale of i18n-render.

### setLocale()
Change to another locale manualy.

- **locale** `string` the target locale
- **persist** `boolean?,false` store locale to localStorage, next time i18n-render will init with this locale
- **rerender** `boolean?,true` re-render page text after change locale

### getText() => string
Get the i18n text of the target text with `key`

- **key** `string` the key of text in the translation dictionary
- **locale** `string?` the locale want to use, **default to the current locale of i18n-render**
- **fallback** `string?` this fallback text will be used if the target statement does not have a translation dictionary configured or if there is no corresponding language setting.

### render()
Render all i18n-render elements in page.

## Browser support
The latest version of Chrome, Firefox, Edge, and Safari.

## MIT License

Copyright (c) 2019 Cheng Gu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
