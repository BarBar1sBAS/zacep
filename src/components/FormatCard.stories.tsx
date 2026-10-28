import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormatCard } from './index'

const meta = { title: 'Контент/FormatCard', component: FormatCard, args: { title: 'Ведение', children: 'Стратегия, контент и развитие каналов.' }, parameters: { docs: { description: { component: "Карточка формата работы. Принимает title, children и стандартные свойства article." } } } } satisfies Meta<typeof FormatCard>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
