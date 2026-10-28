import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo } from './Logo'
const meta = { title: 'Логотипы/Logo', component: Logo, args: { surface: 'paper' }, argTypes: { surface: { control: 'select', options: ['paper', 'ink', 'lime'] } }, decorators: [(Story, context) => <div className={`story-surface story-surface--${context.args.surface}`}><Story /></div>], parameters: { docs: { description: { component: 'Векторный логотип из брендбука. surface определяет контрастный цвет на paper/ink/lime. Минимальная ширина 120 px; охранное поле равно высоте буквы А.' } } } } satisfies Meta<typeof Logo>
export default meta
type Story = StoryObj<typeof meta>
export const Paper: Story = {}
export const Ink: Story = { args: { surface: 'ink' } }
export const Lime: Story = { args: { surface: 'lime' } }
