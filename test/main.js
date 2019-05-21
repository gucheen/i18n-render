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
};

test('auto detect browser languages settings "en"', withPage, async (t, page) => {
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });
  await page.waitFor(1000);
  const currentLocale = await page.evaluate(() => document.getElementById('current').textContent);
  t.is(currentLocale, 'en');
  const currentText = await page.evaluate(() => document.getElementById('preview').textContent);
  t.is(currentText, TEXT.example1[currentLocale]);
});

test('manual change locale and rerender', withPage, async (t, page) => {
  await page.goto(url);
  const controls = Array.from(await page.$$('.control'));
  for (const con of controls) {
    const locale = await page.evaluate(c => c.dataset.locale, con);
    await con.click();
    const currentText = await page.evaluate(() => document.getElementById('preview').textContent);
    t.is(currentText, TEXT.example1[locale]);
  }
});
