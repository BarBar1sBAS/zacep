import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Checkbox } from './index'
const meta = { title: 'Контролы/Checkbox', component: Checkbox, args: { label: 'Согласен на обработку персональных данных' }, decorators: [(Story) => <div className="story-control"><Story /></div>], parameters: { docs: { description: { component: 'Нативный checkbox с фирменной SVG-галочкой. Поддерживает checked/defaultChecked, disabled и error.' } } } } satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Hover: Story = { parameters: { pseudo: { hover: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true, focus: true } } }
export const Disabled: Story = { args: { disabled: true } }
export const Selected: Story = { args: { defaultChecked: true } }
export const Error: Story = { args: { error: 'Подтвердите согласие' } }
export const DisabledSelected: Story = { args: { disabled: true, defaultChecked: true } }
