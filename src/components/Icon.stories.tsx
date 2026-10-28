import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Icon, iconPaths, type IconName } from './Icon'
const meta = { title: 'Иконки/Icon', component: Icon, args: { name: 'arrow', size: 24, color: 'currentColor' }, argTypes: { name: { control: 'select', options: Object.keys(iconPaths) }, size: { control: 'number' }, color: { control: 'color' } }, parameters: { docs: { description: { component: 'Шесть SVG из продуктового UIkit, viewBox 24×24, stroke 2. Цвет currentColor. Декоративные иконки скрыты от скринридера; самостоятельной иконке задайте label.' } } } } satisfies Meta<typeof Icon>
export default meta
type Story = StoryObj<typeof meta>
export const Gallery: Story = { render: args => <div className="story-grid">{(Object.keys(iconPaths) as IconName[]).map(name => <div className="story-icon" key={name}><Icon {...args} name={name} /><code>{name}</code></div>)}</div>, play: async ({ canvasElement }) => { await expect(canvasElement.querySelectorAll('svg')).toHaveLength(6); for (const name of Object.keys(iconPaths)) await expect(within(canvasElement).getByText(name)).toBeVisible() } }
export const Arrow: Story = {}
export const Plus: Story = { args: { name: 'plus' } }
export const Minus: Story = { args: { name: 'minus' } }
export const Close: Story = { args: { name: 'close' } }
export const Menu: Story = { args: { name: 'menu' } }
export const Check: Story = { args: { name: 'check' } }
export const Accessible: Story = { args: { label: 'Открыть кейс' }, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('img', { name: 'Открыть кейс' })).toBeVisible() } }
