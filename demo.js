const TEXT = {
  example1: {
    en: 'I can eat glass and it doesn\'t hurt me.',
    fr: 'Je peux manger du verre, ça ne me fait pas mal.',
    de: 'Ich kann Glas essen, ohne mir zu schaden.',
    'zh-CN': '我能吞下玻璃而不伤身体。',
    'zh-HK': '我能吞下玻璃而不傷身體。',
    jp: '私はガラスを食べられます。それは私を傷つけません。',
    zh: '我能吞下玻璃而不伤身体。',
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

const current = document.getElementsByClassName('current')[0];

const i18n = new I18nRender({
  source: TEXT,
});
document.addEventListener('DOMContentLoaded', () => {
  i18n.render();
  current.textContent = i18n.getLocale();
});

const controls = document.getElementsByClassName('control');
for (const con of controls) {
  con.addEventListener('click', (event) => {
    const locale = event.target.dataset.locale;
    i18n.setLocale({ locale });
    current.textContent = i18n.getLocale();
  });
}
