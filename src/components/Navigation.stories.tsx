import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Header } from './index'
const meta = { title: 'Навигация/Header', component: Header, decorators: [(Story) => <div onClick={event => { if ((event.target as HTMLElement).closest('a')) event.preventDefault() }}><Story /></div>], parameters: { layout: 'fullscreen', docs: { description: { component: 'Адаптивная шапка. На mobile/tablet открывает модальное меню с клавиатурным управлением и возвратом фокуса.' } } } } satisfies Meta<typeof Header>
export default meta
type Story = StoryObj<typeof meta>
export const Desktop: Story = {}
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } }
export const Tablet: Story = { globals: { viewport: { value: 'tablet', isRotated: false } } }
export const MenuInteraction: Story = { globals: { viewport: { value: 'mobile', isRotated: false } }, play: async ({ canvasElement }) => {
  const c = within(canvasElement), trigger = c.getByRole('button', { name: 'Меню' }); await userEvent.click(trigger); const dialog = c.getByRole('dialog'); await expect(dialog).toBeVisible(); await expect(within(dialog).getByRole('button', { name: 'Закрыть' })).toHaveFocus(); await userEvent.keyboard('{Escape}'); await expect(dialog).not.toBeVisible(); await expect(trigger).toHaveFocus(); await userEvent.click(trigger); await userEvent.click(within(dialog).getByRole('link', { name: 'Услуги' })); await expect(dialog).not.toBeVisible(); await expect(trigger).toHaveFocus()
} }
export const OpenMenu: Story = { ...Mobile, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button', { name: 'Меню' })) } }
