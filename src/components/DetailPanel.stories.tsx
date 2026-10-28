import type { Meta, StoryObj } from '@storybook/react-vite'
import { DetailPanel } from './index'
import { services } from './data'
const meta = { title: 'Контент/DetailPanel', component: DetailPanel, args: { item: services[0] }, parameters: { docs: { description: { component: "Панель направления: заголовок, описание, список работ и результат. item имеет тип DetailItem." } } } } satisfies Meta<typeof DetailPanel>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
