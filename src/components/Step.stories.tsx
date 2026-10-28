import type { Meta, StoryObj } from '@storybook/react-vite'
import { Step } from './index'

const meta = { title: 'Контент/Step', component: Step, args: { number: '01', title: 'Диагностика', children: 'Разбираем продукт, аудиторию и путь к обращению.' }, parameters: { docs: { description: { component: "Шаг процесса: number, title и содержимое children. HTML-свойства передаются article." } } } } satisfies Meta<typeof Step>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
