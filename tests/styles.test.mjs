import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as sass from 'sass'

const options = { loadPaths: ['src', 'node_modules'], silenceDeprecations: ['legacy-js-api'] }
const compile = (source) => sass.compileString(source, options).css

test('public API is CSS-free, including repeated imports', () => {
  assert.equal(compile('@use "styles" as a; @use "styles" as b;'), '')
})

test('public mixins and functions compose without emitting foundations', () => {
  const css = compile(`@use "styles" as ui;
    .sample { color: ui.color(text-primary); gap: ui.space(24);
      @include ui.typography(h2); @include ui.container; @include ui.grid;
      @include ui.stack(12); @include ui.section-space; @include ui.control-base;
      @include ui.control-states; @include ui.transition(opacity, transform);
      @include ui.from(tablet) { display: block; }
      @include ui.reduced-motion { animation: none; }
    } .hidden { @include ui.visually-hidden; }
  `)
  assert.match(css, /var\(--ui-text-primary\)/)
  assert.match(css, /min-width: 600px/)
  assert.match(css, /prefers-reduced-motion: reduce/)
  assert.doesNotMatch(css, /:root|@font-face|\.ui-button/)
})

test('invalid token names fail with actionable errors', () => {
  for (const [expression, group] of [
    ['ui.color(missing)', 'color'], ['ui.space(13)', 'space'],
    ['ui.token(size, missing)', 'size'], ['ui.token(missing, x)', 'group'],
    ['ui.breakpoint(phone)', 'breakpoint'],
  ]) {
    assert.throws(() => compile(`@use "styles" as ui; .x { x: ${expression}; }`), new RegExp(`Unknown ${group} token`))
  }
  assert.throws(() => compile('@use "styles" as ui; .x { @include ui.typography(missing); }'), /Unknown typography token/)
})

test('main emits foundations once and includes all native state contracts', () => {
  const css = compile('@use "styles/main"; @use "styles" as ui;')
  assert.equal((css.match(/--ui-color-paper:/g) || []).length, 1)
  assert.match(css, /--ui-surface-canvas: var\(--ui-color-paper\)/)
  for (const selector of ['.ui-button--primary', '.ui-button--secondary', '.ui-button--link', '.ui-input', '.ui-textarea', '.ui-checkbox__control']) assert.ok(css.includes(selector))
  for (const state of [':focus-visible', ':disabled', 'aria-invalid', 'aria-busy']) assert.ok(css.includes(state))
  assert.match(css, /--ui-type-h1-line: 80px/)
  assert.match(css, /min-width: 1024px/)
})
