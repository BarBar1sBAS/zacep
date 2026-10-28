import type { Meta, StoryObj } from '@storybook/react-vite'
import { WorkCard } from './index'

const meta = { title: 'Контент/WorkCard', component: WorkCard, args: { variant: 'featured', title: 'Серия, которая держит внимание', tag: '01 / ДЕМО-КЕЙС · REELS', image: '/assets/editing-collage.png', imageAlt: 'Монтаж коротких видео', href: '#case' }, parameters: { docs: { description: { component: "Демонстрационная работа: featured/content/launch. imageAlt обязателен; href добавляет ссылку на кейс. Демонстрационные подписи сохраняются." } } } } satisfies Meta<typeof WorkCard>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Content: Story = { args: { variant: 'content', title: 'Контент как узнаваемая система', tag: '02 / ДЕМО-НАПРАВЛЕНИЕ · SMM', image: '/assets/reels-frame.png', imageAlt: 'Кадры контентной серии', href: undefined, children: 'Рубрики, графика и единый ритм публикаций.' } }
export const Launch: Story = { args: { variant: 'launch', title: 'Один запуск. Один ясный маршрут.', tag: '03 / ДЕМО-НАПРАВЛЕНИЕ · КАМПАНИЯ', image: '/assets/hero-collage.png', imageAlt: 'Коллаж кампании', href: undefined, children: 'Связь сообщения, креатива и точки обращения.' } }
