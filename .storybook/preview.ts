import type { Preview } from '@storybook/react-vite'
import '../src/styles/main.scss'
import '../src/stories/stories.scss'
const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error', config: { rules: [{ id: 'region', enabled: false }] } },
    controls: { expanded: true },
    viewport: { options: {
      mobile: { name: 'Mobile · 390', styles: { width: '390px', height: '844px' } },
      tablet: { name: 'Tablet · 768', styles: { width: '768px', height: '1024px' } },
      desktop: { name: 'Desktop · 1440', styles: { width: '1440px', height: '1000px' } },
    } },
    options: { storySort: { order: ['Основа', 'Иконки', 'Логотипы', 'Контролы', 'Контент', 'Навигация', 'Формы'] } },
  },
}
export default preview
