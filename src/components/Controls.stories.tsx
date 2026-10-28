import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button, Input, Textarea, Checkbox, SelectionRow } from './index'
const meta = { title: 'Контролы/Button', component: Button, args: { children: 'Обсудить задачу', onClick: fn() }, parameters: { docs: { description: { component: 'Нативная кнопка. variant: primary, secondary, link. busy блокирует повторное действие. Стандартные HTML-свойства передаются кнопке.' } } } } satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>
export const Primary: Story = { play: async ({ canvasElement, args }) => { await userEvent.click(within(canvasElement).getByRole('button')); await expect(args.onClick).toHaveBeenCalledOnce() } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Link: Story = { args: { variant: 'link' } }
export const Disabled: Story = { args: { disabled: true }, play: async ({ canvasElement, args }) => { const b = within(canvasElement).getByRole('button'); await userEvent.click(b); await expect(b).toBeDisabled(); await expect(args.onClick).not.toHaveBeenCalled() } }
export const Busy: Story = { args: { busy: true, children: 'Отправляем…' }, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('button')).toBeDisabled() } }
export const Hover: Story = { parameters: { pseudo: { hover: true } } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { play: async ({ canvasElement }) => { const b = within(canvasElement).getByRole('button'); b.focus(); await expect(b).toHaveFocus() } }
export const FieldsAndChoice: Story = {
  render: () => <div className="story-stack story-control"><Input label="Имя" hint="Как к вам обращаться" /><Textarea label="Задача" /><Checkbox label="Согласен на обработку персональных данных" /><SelectionRow selected>Выбранная услуга</SelectionRow></div>,
  play: async ({ canvasElement }) => { const c = within(canvasElement); await userEvent.type(c.getByLabelText('Имя'), 'Анна'); await expect(c.getByLabelText('Имя')).toHaveValue('Анна'); await userEvent.type(c.getByLabelText('Задача'), 'Снять ролики'); await expect(c.getByLabelText('Задача')).toHaveValue('Снять ролики'); const check = c.getByRole('checkbox'); await userEvent.click(check); await expect(check).toBeChecked(); await userEvent.keyboard(' '); await expect(check).not.toBeChecked(); await expect(c.getByRole('button')).toHaveAttribute('aria-pressed', 'true') },
}
export const SecondaryHover: Story = { args: { variant: 'secondary' }, parameters: { pseudo: { hover: true } } }
export const SecondaryPressed: Story = { args: { variant: 'secondary' }, parameters: { pseudo: { active: true } } }
export const SecondaryFocus: Story = { args: { variant: 'secondary' }, parameters: { pseudo: { focusVisible: true, focus: true } } }
export const SecondaryDisabled: Story = { args: { variant: 'secondary', disabled: true } }
export const SecondaryBusy: Story = { args: { variant: 'secondary', busy: true, children: 'Отправляем…' } }
export const LinkHover: Story = { args: { variant: 'link' }, parameters: { pseudo: { hover: true } } }
export const LinkPressed: Story = { args: { variant: 'link' }, parameters: { pseudo: { active: true } } }
export const LinkFocus: Story = { args: { variant: 'link' }, parameters: { pseudo: { focusVisible: true, focus: true } } }
export const LinkDisabled: Story = { args: { variant: 'link', disabled: true } }
export const LinkBusy: Story = { args: { variant: 'link', busy: true, children: 'Отправляем…' } }
