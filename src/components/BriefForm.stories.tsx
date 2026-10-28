import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within, waitFor } from 'storybook/test'
import { BriefForm } from './index'
const filled = { name: 'Алексей', company: 'Мебельная мастерская', contact: '@example', task: 'Нужна серия коротких видео для запуска.', consent: true }
const meta = { title: 'Формы/BriefForm', component: BriefForm, args: { onSubmit: fn(async () => {}) }, parameters: { docs: { description: { component: 'Форма заявки. onSubmit(values) возвращает Promise; отклонение показывает ошибку с повторной отправкой. defaultValues заполняет поля. Данные не отправляются без обработчика потребителя.' } } } } satisfies Meta<typeof BriefForm>
export default meta
type Story = StoryObj<typeof meta>
export const Initial: Story = {}
export const Unavailable: Story = {
  args: { submissionDisabled: true, defaultValues: filled },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' }))
    await expect(c.getByRole('alert')).toHaveTextContent('Отправка пока недоступна')
    await expect(c.getByLabelText('Имя *')).toHaveValue(filled.name)
    await expect(c.queryByRole('heading', { name: 'Заявка принята' })).not.toBeInTheDocument()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}
export const Filled: Story = { args: { defaultValues: filled } }
export const Error: Story = { play: async ({ canvasElement, args }) => { const c = within(canvasElement); await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' })); await expect(c.getByLabelText('Имя *')).toHaveAttribute('aria-invalid', 'true'); await expect(c.getByLabelText('Имя *')).toHaveFocus(); await expect(c.getByText('Укажите телефон или Telegram')).toBeVisible(); await expect(args.onSubmit).not.toHaveBeenCalled(); const input = c.getByLabelText('Имя *'); await expect(input).toHaveAccessibleDescription('Укажите имя') } }
export const Sending: Story = { args: { defaultValues: filled, onSubmit: fn(() => new Promise<void>(() => {})) }, play: async ({ canvasElement, args }) => { const c = within(canvasElement); await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' })); const busy = c.getByRole('button', { name: 'Отправляем…' }); await expect(busy).toBeDisabled(); await userEvent.click(busy); await expect(args.onSubmit).toHaveBeenCalledOnce(); await expect(c.getByLabelText('Имя *')).toBeDisabled() } }
export const Success: Story = { args: { defaultValues: filled }, play: async ({ canvasElement, args }) => { const c = within(canvasElement); await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' })); await expect(c.getByRole('heading', { name: 'Заявка принята' })).toBeVisible(); await expect(args.onSubmit).toHaveBeenCalledWith(filled) } }
export const Failure: Story = { args: { defaultValues: filled, onSubmit: fn(async () => { throw new globalThis.Error('offline') }) }, play: async ({ canvasElement }) => { const c = within(canvasElement); await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' })); await expect(c.getByRole('alert')).toHaveTextContent('Не удалось отправить') } }
export const Retry: Story = { args: { defaultValues: filled, onSubmit: fn(async () => {}) }, play: async ({ canvasElement, args }) => { if (!args.onSubmit) throw new globalThis.Error('Missing submission handler'); args.onSubmit.mockRejectedValueOnce(new globalThis.Error('offline')).mockResolvedValue(undefined); const c = within(canvasElement); await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' })); await userEvent.click(await c.findByRole('button', { name: 'Повторить отправку' })); await waitFor(() => expect(c.getByRole('heading', { name: 'Заявка принята' })).toBeVisible()); await expect(args.onSubmit).toHaveBeenNthCalledWith(2, filled) } }
export const Whitespace: Story = { args: { defaultValues: { ...filled, name: '   ', consent: false } }, play: async ({ canvasElement, args }) => { const c = within(canvasElement); await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' })); await expect(c.getByText('Укажите имя')).toBeVisible(); await expect(c.getByText('Подтвердите согласие')).toBeVisible(); await expect(args.onSubmit).not.toHaveBeenCalled() } }
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } }
export const Tablet: Story = { globals: { viewport: { value: 'tablet', isRotated: false } } }
export const MobileInitial: Story = { ...Initial, globals: { viewport: { value: 'mobile', isRotated: false } } }
export const MobileFilled: Story = { ...Filled, globals: { viewport: { value: 'mobile', isRotated: false } } }
export const MobileError: Story = { ...Error, globals: { viewport: { value: 'mobile', isRotated: false } } }
export const MobileSending: Story = { ...Sending, globals: { viewport: { value: 'mobile', isRotated: false } } }
export const MobileSuccess: Story = { ...Success, globals: { viewport: { value: 'mobile', isRotated: false } } }
export const MobileFailure: Story = { ...Failure, globals: { viewport: { value: 'mobile', isRotated: false } } }
export const TabletInitial: Story = { ...Initial, globals: { viewport: { value: 'tablet', isRotated: false } } }
export const TabletFilled: Story = { ...Filled, globals: { viewport: { value: 'tablet', isRotated: false } } }
export const TabletError: Story = { ...Error, globals: { viewport: { value: 'tablet', isRotated: false } } }
export const TabletSending: Story = { ...Sending, globals: { viewport: { value: 'tablet', isRotated: false } } }
export const TabletSuccess: Story = { ...Success, globals: { viewport: { value: 'tablet', isRotated: false } } }
export const TabletFailure: Story = { ...Failure, globals: { viewport: { value: 'tablet', isRotated: false } } }
export const DesktopInitial: Story = { ...Initial, globals: { viewport: { value: 'desktop', isRotated: false } } }
export const DesktopFilled: Story = { ...Filled, globals: { viewport: { value: 'desktop', isRotated: false } } }
export const DesktopError: Story = { ...Error, globals: { viewport: { value: 'desktop', isRotated: false } } }
export const DesktopSending: Story = { ...Sending, globals: { viewport: { value: 'desktop', isRotated: false } } }
export const DesktopSuccess: Story = { ...Success, globals: { viewport: { value: 'desktop', isRotated: false } } }
export const DesktopFailure: Story = { ...Failure, globals: { viewport: { value: 'desktop', isRotated: false } } }

export const Reset: Story = { ...Success, play: async ({ canvasElement }) => { const c = within(canvasElement); await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' })); await userEvent.click(await c.findByRole('button', { name: 'Заполнить ещё раз' })); await expect(c.getByLabelText('Имя *')).toHaveValue(''); await expect(c.getByRole('checkbox')).not.toBeChecked() } }
export const FillAndRetry: Story = {
  play: async ({ canvasElement, args }) => {
    if (!args.onSubmit) throw new globalThis.Error('Missing submission handler'); args.onSubmit.mockRejectedValueOnce(new globalThis.Error('offline')).mockResolvedValue(undefined)
    const c = within(canvasElement)
    await userEvent.type(c.getByLabelText('Имя *'), filled.name)
    await userEvent.type(c.getByLabelText('Компания или ниша'), filled.company)
    await userEvent.type(c.getByLabelText('Телефон или Telegram *'), filled.contact)
    await userEvent.type(c.getByLabelText('Задача *'), filled.task)
    await userEvent.click(c.getByRole('checkbox'))
    await userEvent.click(c.getByRole('button', { name: 'Отправить заявку' }))
    await expect(await c.findByRole('alert')).toHaveTextContent('Не удалось отправить')
    await userEvent.click(c.getByRole('button', { name: 'Повторить отправку' }))
    await expect(await c.findByRole('heading', { name: 'Заявка принята' })).toBeVisible()
    await expect(args.onSubmit).toHaveBeenNthCalledWith(1, filled)
    await expect(args.onSubmit).toHaveBeenNthCalledWith(2, filled)
  },
}
