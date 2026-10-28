const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const sites = [
  ['setters', 'https://www.setters.agency/we-are'],
  ['redkeds', 'https://redkeds.com/'],
  ['shift-motion', 'https://shiftmotion.ru/'],
  ['headline', 'https://www.headlineideas.com/'],
  ['our-own-brand', 'https://ourownbrand.co/'],
  ['dog-house-riot', 'https://www.doghouseriot.com/'],
  ['obys', 'https://obys.agency/'],
  ['bold-creative', 'https://weareboldcreative.com/'],
];

(async () => {
  const out = path.resolve('tmp/pdfs/reference-shots');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    locale: 'ru-RU',
    colorScheme: 'light',
  });

  for (const [slug, url] of sites) {
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 55000 });
      await page.waitForTimeout(4500);
      await page.keyboard.press('Escape').catch(() => {});
      await page.screenshot({ path: path.join(out, `${slug}-hero.png`) });
      const height = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
      await page.evaluate((h) => window.scrollTo(0, Math.min(h * 0.48, h - window.innerHeight)), height);
      await page.waitForTimeout(1600);
      await page.screenshot({ path: path.join(out, `${slug}-detail.png`) });
      console.log(`captured ${slug} (${height}px)`);
    } catch (error) {
      console.error(`failed ${slug}: ${error.message}`);
    } finally {
      await page.close();
    }
  }
  await browser.close();
})();
