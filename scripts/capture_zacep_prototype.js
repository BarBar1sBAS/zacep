const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const out = path.resolve('tmp/pdfs/zacep-prototype');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const sizes = [
    ['desktop', 1440, 1000],
    ['laptop', 1024, 900],
    ['tablet', 768, 900],
    ['mobile', 390, 844],
  ];
  for (const [name, width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(out, `home-${name}-full.png`), fullPage: true });
    await page.screenshot({ path: path.join(out, `home-${name}-hero.png`) });
    if (name === 'desktop' || name === 'mobile') {
      for (const selector of ['#services', '#work', '#process', '#brief']) {
        await page.locator(selector).screenshot({ path: path.join(out, `${name}-${selector.slice(1)}.png`) });
      }
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${name}: overflow=${overflow}; errors=${errors.length}`);
    if (errors.length) console.log(errors.join('\n'));
    await page.close();
  }
  const casePage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await casePage.goto('http://127.0.0.1:5173/case-template', { waitUntil: 'networkidle' });
  await casePage.screenshot({ path: path.join(out, 'case-desktop-full.png'), fullPage: true });
  for (const [name, selector] of [['hero', '.case-hero'], ['facts', '.case-facts'], ['gallery', '.case-gallery'], ['result', '.case-result']]) {
    await casePage.locator(selector).screenshot({ path: path.join(out, `case-desktop-${name}.png`) });
  }
  await casePage.setViewportSize({ width: 390, height: 844 });
  await casePage.screenshot({ path: path.join(out, 'case-mobile-full.png'), fullPage: true });
  await browser.close();
})();
