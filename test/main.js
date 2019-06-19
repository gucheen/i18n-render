import test from 'ava';
import * as path from 'path';
import withPage from './_withPage';

const url = 'file://' + path.resolve(__dirname, '../index.html');

const TEXT = {
  example1: {
    en: 'I can eat glass and it doesn\'t hurt me.',
    fr: 'Je peux manger du verre, ça ne me fait pas mal.',
    de: 'Ich kann Glas essen, ohne mir zu schaden.',
    'zh-CN': '我能吞下玻璃而不伤身体。',
    'zh-HK': '我能吞下玻璃而不傷身體。',
    jp: '私はガラスを食べられます。それは私を傷つけません。',
  },
  example_image: {
    en: 'https://placehold.co/300x200/000000/ffffff?text=en',
    fr: 'https://placehold.co/300x200/000000/ffffff?text=fr',
    de: 'https://placehold.co/300x200/000000/ffffff?text=de',
    'zh-CN': 'https://placehold.co/300x200/000000/ffffff?text=zh-CN',
    'zh-HK': 'https://placehold.co/300x200/000000/ffffff?text=zh-HK',
    jp: 'https://placehold.co/300x200/000000/ffffff?text=jp',
    zh: 'https://placehold.co/300x200/000000/ffffff?text=zh',
  },
};

test('auto detect browser languages settings "en"', withPage, async (t, page) => {
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });
  const currentLocale = await page.evaluate(() => document.getElementById('current').textContent);
  t.is(currentLocale, 'en');
  const currentText = await page.evaluate(() => document.getElementById('preview').textContent);
  t.is(currentText, TEXT.example1[currentLocale]);
  const currentImage = await page.evaluate(() => document.getElementById('image-preview').src);
  t.is(currentImage, TEXT.example_image[currentLocale]);
});

test('add i18n css classes to html body', withPage, async (t, page) => {
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });
  const bodyClass = await page.evaluate(() => document.body.className);
  t.is(bodyClass, 'i18n-render i18n-render-locale-en i18n-render-rendered');
  const controls = await page.$$('.control');
  await (await controls[1]).click();
  const newBodyClass = await page.evaluate(() => document.body.className);
  t.true(newBodyClass.indexOf('i18n-render-locale-fr') > -1);
  t.true(newBodyClass.indexOf('i18n-render-locale-en') === -1);
});

test('manual change locale and rerender', withPage, async (t, page) => {
  await page.goto(url);
  const controls = Array.from(await page.$$('.control'));
  for (const con of controls) {
    const locale = await page.evaluate(c => c.dataset.locale, con);
    await con.click();
    const currentText = await page.evaluate(() => document.getElementById('preview').textContent);
    t.is(currentText, TEXT.example1[locale]);
    const currentImage = await page.evaluate(() => document.getElementById('image-preview').src);
    t.is(currentImage, TEXT.example_image[locale]);
  }
});

test('persist locale setting', withPage, async (t, page) => {
  const PERSIST_LOCALE = 'zh-CN';
  await page.goto(url);
  let currentLocale = await page.evaluate(() => document.getElementById('current').textContent);
  t.is(currentLocale, 'en');
  let currentText = await page.evaluate(() => document.getElementById('preview').textContent);
  t.is(currentText, TEXT.example1[currentLocale]);
  await page.evaluate((PERSIST_LOCALE) => {
    i18n.setLocale({
      locale: PERSIST_LOCALE,
      persist: true,
    });
  }, PERSIST_LOCALE);
  currentText = await page.evaluate(() => document.getElementById('preview').textContent);
  t.is(currentText, TEXT.example1[PERSIST_LOCALE]);
  await page.reload({
    waitUntil: 'networkidle2',
  });
  currentLocale = await page.evaluate(() => document.getElementById('current').textContent);
  t.is(currentLocale, PERSIST_LOCALE);
  currentText = await page.evaluate(() => document.getElementById('preview').textContent);
  t.is(currentText, TEXT.example1[PERSIST_LOCALE]);
});
