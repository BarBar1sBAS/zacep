import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { SelectionRow } from './index'
const meta = { title: 'Контролы/SelectionRow', component: SelectionRow, args: { children: 'SMM под ключ' }, decorators: [(Story) => <div className="story-control"><Story /></div>], parameters: { docs: { description: { component: 'Кнопка выбора с aria-pressed. selected обозначает выбор, стандартный onClick сообщает о действии.' } } } } satisfies Meta<typeof SelectionRow>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Hover: Story = { parameters: { pseudo: { hover: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true, focus: true } } }
export const Disabled: Story = { args: { disabled: true } }
export const Selected: Story = { args: { selected: true } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
