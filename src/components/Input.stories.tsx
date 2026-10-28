import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from './index'
const meta = { title: 'Контролы/Input', component: Input, args: { label: 'Имя', placeholder: 'Как к вам обращаться' }, decorators: [(Story) => <div className="story-control"><Story /></div>], parameters: { docs: { description: { component: 'Нативное поле ввода с label, hint и error. Связи aria-describedby создаются автоматически; доступны стандартные HTML-свойства и ref.' } } } } satisfies Meta<typeof Input>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Hover: Story = { parameters: { pseudo: { hover: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true, focus: true } } }
export const Disabled: Story = { args: { disabled: true } }
export const Filled: Story = { args: { defaultValue: 'Мебельная мастерская' } }
export const Error: Story = { args: { error: 'Заполните это поле', hint: 'Обязательное поле' }, play: async ({ canvasElement }) => { const input = within(canvasElement).getByRole('textbox'); await expect(input).toHaveAccessibleDescription('Обязательное поле Заполните это поле'); await expect(input).toHaveAttribute('aria-invalid', 'true') } }
