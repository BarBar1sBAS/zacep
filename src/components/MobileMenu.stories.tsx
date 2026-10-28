import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MobileMenu, Button } from './index'
const meta = { title: 'Навигация/MobileMenu', component: MobileMenu, args: { open: false, onClose: () => {} }, render: args => {
  const [open, setOpen] = useState(false)
  return <><Button onClick={() => setOpen(true)} icon="menu">Меню</Button><MobileMenu {...args} open={open} onClose={() => setOpen(false)} /></>
}, parameters: { docs: { description: { component: 'Модальное меню на нативном dialog: фон недоступен для взаимодействия, Escape закрывает меню, браузер возвращает фокус. Открытие управляется через open/onClose; items задаёт ссылки.' } } } } satisfies Meta<typeof MobileMenu>
export default meta
type Story = StoryObj<typeof meta>
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } }
export const Tablet: Story = { globals: { viewport: { value: 'tablet', isRotated: false } } }
