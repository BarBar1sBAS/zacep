import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Accordion, ServiceSelector, RoleSelector, FAQ, Step, FormatCard, WorkCard } from './index'
import { services, roles, faq, steps, formats } from './data'
const meta = { title: 'Контент/Выбор услуг', component: ServiceSelector, parameters: { layout: 'fullscreen', docs: { description: { component: 'Выбор услуги: список и панель на desktop, аккордеоны на mobile/tablet. Данные можно заменить через items.' } } }, decorators: [(Story) => <div className="ui-container"><Story /></div>] } satisfies Meta<typeof ServiceSelector>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { play: async ({ canvasElement }) => { const c = within(canvasElement); const buttons = c.getAllByRole('button', { name: services[1].name }); await userEvent.click(buttons.find(b => b.offsetParent !== null)!); await expect(c.getByRole('heading', { name: services[1].title.replaceAll('\n', ' ') })).toBeVisible() } }
export const Roles: Story = { render: () => <RoleSelector />, play: async ({ canvasElement }) => { const c = within(canvasElement); const b = c.getAllByRole('button', { name: roles[1].name }).find(b => b.offsetParent !== null)!; await userEvent.click(b); await expect(c.getByRole('heading', { name: roles[1].title.replaceAll('\n', ' ') })).toBeVisible() } }
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } }
export const Tablet: Story = { globals: { viewport: { value: 'tablet', isRotated: false } } }
export const AccordionToggle: Story = {
  render: () => <Accordion title="Как начать?">Расскажите о задаче.</Accordion>,
  play: async ({ canvasElement }) => { const c = within(canvasElement), b = c.getByRole('button', { name: 'Как начать?' }); await expect(b).toHaveAttribute('aria-expanded', 'false'); await userEvent.click(b); await expect(c.getByText('Расскажите о задаче.')).toBeVisible(); await expect(b).toHaveAttribute('aria-expanded', 'true'); await userEvent.keyboard('{Enter}'); await expect(b).toHaveAttribute('aria-expanded', 'false') },
}
export const FAQList: Story = { render: () => <FAQ items={faq} /> }
export const Process: Story = { render: () => <div className="story-grid">{steps.map(([title, body], i) => <Step key={title} number={String(i + 1).padStart(2, '0')} title={title}>{body}</Step>)}</div> }
export const Formats: Story = { render: () => <div className="story-grid">{formats.map(([title, body]) => <FormatCard key={title} title={title}>{body}</FormatCard>)}</div> }
export const Works: Story = { render: () => <div className="story-grid"><WorkCard variant="featured" title="Серия, которая держит внимание" image="/assets/editing-collage.png" imageAlt="Монтаж коротких видео" tag="01 / ДЕМО-КЕЙС · REELS" href="https://example.com/case" /><WorkCard variant="content" title="Контент как узнаваемая система" image="/assets/reels-frame.png" imageAlt="Кадры контентной серии" tag="02 / ДЕМО-НАПРАВЛЕНИЕ · SMM">Рубрики, графика и единый ритм публикаций.</WorkCard><WorkCard variant="launch" title="Один запуск. Один ясный маршрут." image="/assets/hero-collage.png" imageAlt="Коллаж кампании" tag="03 / ДЕМО-НАПРАВЛЕНИЕ · КАМПАНИЯ">Связь сообщения, креатива и точки обращения.</WorkCard></div> }
export const Service1: Story = { args: { defaultSelected: 0 } }
export const Service2: Story = { args: { defaultSelected: 1 } }
export const Service3: Story = { args: { defaultSelected: 2 } }
export const Service4: Story = { args: { defaultSelected: 3 } }
export const Service5: Story = { args: { defaultSelected: 4 } }
export const Role1: Story = { render: () => <RoleSelector defaultSelected={0} /> }
export const Role2: Story = { render: () => <RoleSelector defaultSelected={1} /> }
export const Role3: Story = { render: () => <RoleSelector defaultSelected={2} /> }
export const Role4: Story = { render: () => <RoleSelector defaultSelected={3} /> }
export const Role5: Story = { render: () => <RoleSelector defaultSelected={4} /> }
export const Role6: Story = { render: () => <RoleSelector defaultSelected={5} /> }
