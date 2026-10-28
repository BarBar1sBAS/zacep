import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Textarea } from './index'
const meta = { title: 'Контролы/Textarea', component: Textarea, args: { label: 'Задача', placeholder: 'Что хотите изменить?' }, decorators: [(Story) => <div className="story-control"><Story /></div>], parameters: { docs: { description: { component: 'Многострочное нативное поле. label, hint и error связаны с контролом; высоту можно изменять.' } } } } satisfies Meta<typeof Textarea>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Hover: Story = { parameters: { pseudo: { hover: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true, focus: true } } }
export const Disabled: Story = { args: { disabled: true } }
export const Filled: Story = { args: { defaultValue: 'Мебельная мастерская' } }
export const Error: Story = { args: { error: 'Заполните это поле', hint: 'Обязательное поле' }, play: async ({ canvasElement }) => { const input = within(canvasElement).getByRole('textbox'); await expect(input).toHaveAccessibleDescription('Обязательное поле Заполните это поле'); await expect(input).toHaveAttribute('aria-invalid', 'true') } }
