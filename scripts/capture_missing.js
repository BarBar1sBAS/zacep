const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const sites = [
  ['setters', 'https://web.archive.org/web/20250209134226/https://www.setters.agency/we-are'],
  ['brutalist-studio', 'https://themainwebsite.com/projects/project-04'],
];

(async () => {
  const out = path.resolve('tmp/pdfs/reference-shots');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, locale: 'ru-RU' });
  for (const [slug, url] of sites) {
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(6000);
      await page.screenshot({ path: path.join(out, `${slug}-hero.png`) });
      const height = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
      await page.evaluate((h) => window.scrollTo(0, Math.min(h * 0.45, h - window.innerHeight)), height);
      await page.waitForTimeout(2000);
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
