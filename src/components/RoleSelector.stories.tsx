import type { Meta, StoryObj } from '@storybook/react-vite'
import { RoleSelector } from './index'

const meta = { title: 'Контент/RoleSelector', component: RoleSelector, args: { defaultSelected: 0 }, parameters: { docs: { description: { component: "Выбор проектной роли. items заменяет набор ролей; defaultSelected определяет начальный выбор." } } } } satisfies Meta<typeof RoleSelector>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
