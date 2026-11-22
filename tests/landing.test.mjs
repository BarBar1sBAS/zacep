import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.SITE_URL || 'http://127.0.0.1:5173'

for (const width of [360, 390, 600, 768, 1024, 1440]) test(`Landing and case work at ${width}px`, async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    const errors = [], submissions = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('request', request => { if (request.method() === 'POST') submissions.push(request.url()) })
    await page.goto(`${base}/`)
    await page.evaluate(() => document.fonts.ready)
    await page.keyboard.press('Tab')
    assert.equal(await page.getByRole('link', { name: 'Перейти к содержанию' }).evaluate(el => el === document.activeElement), true)
    await page.keyboard.press('Enter')
    assert.equal(await page.locator('#main').evaluate(el => el === document.activeElement), true)

    assert.equal(await page.locator('#work, .site-work-featured, .site-work-grid, a[href*="case-template"], a[href$="#work"]').count(), 0)
    const services = page.locator('#services')
    const team = page.locator('#team')
    const serviceNames = await services.locator('button').allTextContents()
    assert.match(serviceNames[0], /Исследование и стратегия/i)
    assert.equal(await services.getByRole('heading', { name: 'Начинаем с исследования.' }).isVisible(), true)
    const roleNames = await team.locator('button').allTextContents()
    assert.match(roleNames[0], /Маркетолог/i)
    assert.match(roleNames.at(-1), /Дизайнер/i)
    assert.deepEqual(await services.locator('.site-problems h3').allTextContents(), ['Исследование', 'Смыслы и стратегия', 'Производство контента'])
    assert.match(await page.locator('#process .site-format-grid').locator('article').first().innerText(), /Продакшен/i)
    assert.doesNotMatch(await page.locator('body').innerText(), /таргет|контент[ -]план/i)
    assert.doesNotMatch((await page.locator('meta[name="description"], meta[property="og:description"]').evaluateAll(nodes => nodes.map(node => node.content).join(' '))), /таргет|контент[ -]план/i)
    if (width < 1024) {
      await page.getByRole('button', { name: 'Меню', exact: true }).click()
      await page.getByRole('dialog').waitFor()
      await page.keyboard.press('Escape')
      assert.equal(await page.getByRole('button', { name: 'Меню', exact: true }).evaluate(el => el === document.activeElement), true)
      await page.getByRole('button', { name: 'Меню', exact: true }).click()
      await page.getByRole('dialog').getByRole('link', { name: 'Услуги' }).click()
      await page.getByRole('dialog').waitFor({ state: 'hidden' })
    }
    await services.getByRole('button', { name: 'Продакшен', exact: true }).click()
    assert.equal(await services.getByRole('heading', { name: 'Идея цепляет. Монтаж удерживает.' }).isVisible(), true)
    if (width >= 1024) assert.equal(await services.getByRole('button', { name: 'Продакшен', exact: true }).getAttribute('aria-pressed'), 'true')
    await team.getByRole('button', { name: 'Дизайнер', exact: true }).click()
    assert.match(await services.innerText(), /оператор[а-я]*.*отдельную плату/i)
    assert.match(await services.innerText(), /не нужно координировать фрилансеров.*Маркетолог, сценаристы и монтажёр работают по одной стратегии/i)
    assert.equal(await team.getByRole('heading', { name: 'Собирает визуальный характер бренда.' }).isVisible(), true)
    const approval = page.getByRole('button', { name: 'Как согласовываем материалы?' })
    await approval.click()
    assert.match(await page.locator('#faq').innerText(), /назначаете одного ответственного.*собирает комментарии.*передаёт их нам и утверждает итоговые материалы/i)
    await approval.click()
    const question = page.getByRole('button', { name: 'Можно начать с одной услуги?' })
    await question.click()
    assert.equal(await question.getAttribute('aria-expanded'), 'true')
    await question.click()

    const form = page.getByRole('form', { name: 'Заявка', exact: true })
    await form.getByRole('button', { name: 'Отправить заявку' }).click()
    assert.equal(await form.getByLabel('Имя *', { exact: true }).evaluate(el => el === document.activeElement), true)
    await form.getByLabel('Имя *', { exact: true }).fill('Алексей')
    await form.getByLabel('Телефон или Telegram *', { exact: true }).fill('@alexey')
    await form.getByLabel('Задача *', { exact: true }).fill('Нужна серия роликов')
    await form.getByRole('checkbox').check()
    await form.getByRole('button', { name: 'Отправить заявку' }).click()
    await form.getByRole('alert').filter({ hasText: 'Отправка пока недоступна' }).waitFor()
    assert.equal(await form.getByLabel('Задача *', { exact: true }).inputValue(), 'Нужна серия роликов')
    assert.equal(await form.getByText('Заявка принята').count(), 0)
    assert.deepEqual(submissions, [])
    await page.goto(`${base}/case-template/`)
    assert.equal(await page.getByRole('heading', { level: 1 }).textContent(), 'Серия, котораядержит внимание.')
    await page.getByRole('link', { name: 'На главную', exact: true }).click()
    await page.waitForURL(`${base}/`)

    await mkdir('test-results/landing', { recursive: true })
    for (const path of ['/', '/case-template']) {
      await page.goto(`${base}${path}`)
      await page.evaluate(async () => {
        await document.fonts.ready
        // Load the gallery before checking assets and taking the full page capture.
        for (const img of document.images) { img.loading = 'eager'; await img.decode() }
      })
      assert.equal(await page.locator('h1').count(), 1)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${path}: overflow at ${width}`)
      assert.equal(await page.locator('img').evaluateAll(images => images.some(img => !img.complete || !img.naturalWidth || !img.alt)), false)
      if ([390, 768, 1440].includes(width)) await page.screenshot({ path: `test-results/landing/${path === '/' ? 'home' : 'case'}-${width}.png`, fullPage: true })
    }
    await page.getByRole('link', { name: 'Обсудить задачу', exact: true }).click()
    await page.waitForURL('**/#brief')
    await page.goto(`${base}/missing`)
    assert.match(await page.getByRole('heading', { level: 1 }).textContent(), /Страница не найдена/)
    await page.getByRole('link', { name: 'На главную', exact: true }).click()
    await page.waitForURL(`${base}/`)
    assert.deepEqual(errors, [])
  } finally { await browser.close() }
})
