import puppeteer from 'puppeteer';
import pti from 'puppeteer-to-istanbul';

export default async function withPage(t, run) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await Promise.all([
    page.coverage.startJSCoverage({}),
  ]);
  try {
    await run(t, page);
  } finally {
    const [jsCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
    ]);

    pti.write(jsCoverage);

    await page.close();
    await browser.close();
  }
}
