import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
export default defineConfig({
  plugins: [storybookTest({ configDir: '.storybook' }), {
    // Storybook 10.6.5 decodes spaces only in its test-file guard.
    // Decode Cyrillic paths too, otherwise it silently registers zero tests here.
    name: 'storybook-unicode-test-path',
    enforce: 'post',
    transform(code, id) {
      if (id.includes('.stories.')) return code.replaceAll('convertToFilePath(import.meta.url)', 'convertToFilePath(decodeURI(import.meta.url))')
    },
  }],
  test: {
    name: 'storybook',
    
    browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' }] },
  },
})
