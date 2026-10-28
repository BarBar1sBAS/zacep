import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

// Run against npm run storybook (or a served static build via STORYBOOK_URL).
const base = process.env.STORYBOOK_URL || 'http://127.0.0.1:6006'
const index = await (await fetch(`${base}/index.json`)).json()
const stories = [
  ['colors', 'основа-токены--colors'], ['type', 'основа-токены--typography'],
  ['icons', 'иконки-icon--gallery'], ['logo', 'логотипы-logo--ink'],
  ['controls', 'контролы-button--fields-and-choice'], ['services', 'контент-выбор-услуг--default'],
  ['roles', 'контент-roleselector--default'], ['accordion', 'контент-accordion--service-1-open'],
  ['work', 'контент-workcard--default'], ['form', 'формы-briefform--initial'],
  ['form-error', 'формы-briefform--error'], ['form-sending', 'формы-briefform--sending'],
  ['form-success', 'формы-briefform--success'], ['form-failure', 'формы-briefform--failure'],
  ['header', 'навигация-header--desktop'],
]
async function openStory(page, id) {
  assert.ok(index.entries[id], `Missing story: ${id}`)
  await page.goto(`${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`)
  await page.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.currentRender?.phase === 'finished')
  await page.evaluate(() => document.fonts.ready)
  await page.locator('#storybook-root > :visible').first().waitFor()
}
for (const width of [390, 768, 1440]) test(`UI kit fits ${width}px and supports reduced motion`, async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await mkdir('test-results/storybook', { recursive: true })
    for (const [name, id] of stories) {
      await openStory(page, id)
      if (name === 'form-success') assert.equal(await page.getByRole('heading', { name: 'Заявка принята' }).isVisible(), true, 'Success story must keep the success state visible')
      assert.equal(await page.locator('#storybook-root img').evaluateAll(images => images.some(img => !img.complete || img.naturalWidth === 0)), false, `${id}: broken image`)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${id}: horizontal overflow at ${width}`)
      await page.screenshot({ path: `test-results/storybook/${name}-${width}.png`, fullPage: true })
    }
    if (width < 1024) {
      await page.getByRole('button', { name: 'Меню' }).click()
      const dialog = page.getByRole('dialog')
      await dialog.waitFor()
      assert.equal(await page.getByRole('button', { name: 'Закрыть' }).evaluate(node => node === document.activeElement), true)
      // Native dialog keeps background controls inert; browser chrome remains reachable.
      await page.keyboard.press('Shift+Tab')
      assert.equal(await dialog.evaluate(node => document.activeElement === document.body || node.contains(document.activeElement)), true)
      await page.keyboard.press('Tab')
      assert.equal(await page.getByRole('button', { name: 'Закрыть' }).evaluate(node => node === document.activeElement), true)
      await page.screenshot({ path: `test-results/storybook/menu-${width}.png`, fullPage: true })
      await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'hidden' })
      assert.equal(await page.getByRole('button', { name: 'Меню' }).evaluate(node => node === document.activeElement), true)
    }
    await openStory(page, 'контролы-button--primary')
    const button = page.getByRole('button')
    const duration = await button.evaluate(node => getComputedStyle(node).transitionDuration)
    assert.ok(duration.split(',').every(value => parseFloat(value) === 0), `reduced motion: ${duration}`)
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
