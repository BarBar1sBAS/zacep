import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, DetailPanel, FAQ, services, roles, faq } from './index'
const meta = { title: 'Контент/Accordion', component: Accordion, args: { title: 'Можно начать с одной услуги?', children: 'Да. Начинаем с задачи.' }, parameters: { docs: { description: { component: 'Раскрывающийся блок с нативной кнопкой, aria-expanded и aria-controls. defaultOpen задаёт начальное состояние; open/onOpenChange позволяют управлять им снаружи.' } } } } satisfies Meta<typeof Accordion>
export default meta
type Story = StoryObj<typeof meta>
export const Closed: Story = {}
export const Open: Story = { args: { defaultOpen: true } }
export const FAQList: Story = { render: () => <FAQ /> }
export const Service1Closed: Story = { args: { title: services[0].name, defaultOpen: false, children: <DetailPanel item={services[0]} /> } }
export const Service1Open: Story = { args: { title: services[0].name, defaultOpen: true, children: <DetailPanel item={services[0]} /> } }
export const Service2Closed: Story = { args: { title: services[1].name, defaultOpen: false, children: <DetailPanel item={services[1]} /> } }
export const Service2Open: Story = { args: { title: services[1].name, defaultOpen: true, children: <DetailPanel item={services[1]} /> } }
export const Service3Closed: Story = { args: { title: services[2].name, defaultOpen: false, children: <DetailPanel item={services[2]} /> } }
export const Service3Open: Story = { args: { title: services[2].name, defaultOpen: true, children: <DetailPanel item={services[2]} /> } }
export const Service4Closed: Story = { args: { title: services[3].name, defaultOpen: false, children: <DetailPanel item={services[3]} /> } }
export const Service4Open: Story = { args: { title: services[3].name, defaultOpen: true, children: <DetailPanel item={services[3]} /> } }
export const Service5Closed: Story = { args: { title: services[4].name, defaultOpen: false, children: <DetailPanel item={services[4]} /> } }
export const Service5Open: Story = { args: { title: services[4].name, defaultOpen: true, children: <DetailPanel item={services[4]} /> } }
export const Role1Closed: Story = { args: { title: roles[0].name, defaultOpen: false, children: <DetailPanel item={roles[0]} /> } }
export const Role1Open: Story = { args: { title: roles[0].name, defaultOpen: true, children: <DetailPanel item={roles[0]} /> } }
export const Role2Closed: Story = { args: { title: roles[1].name, defaultOpen: false, children: <DetailPanel item={roles[1]} /> } }
export const Role2Open: Story = { args: { title: roles[1].name, defaultOpen: true, children: <DetailPanel item={roles[1]} /> } }
export const Role3Closed: Story = { args: { title: roles[2].name, defaultOpen: false, children: <DetailPanel item={roles[2]} /> } }
export const Role3Open: Story = { args: { title: roles[2].name, defaultOpen: true, children: <DetailPanel item={roles[2]} /> } }
export const Role4Closed: Story = { args: { title: roles[3].name, defaultOpen: false, children: <DetailPanel item={roles[3]} /> } }
export const Role4Open: Story = { args: { title: roles[3].name, defaultOpen: true, children: <DetailPanel item={roles[3]} /> } }
export const Role5Closed: Story = { args: { title: roles[4].name, defaultOpen: false, children: <DetailPanel item={roles[4]} /> } }
export const Role5Open: Story = { args: { title: roles[4].name, defaultOpen: true, children: <DetailPanel item={roles[4]} /> } }
export const Role6Closed: Story = { args: { title: roles[5].name, defaultOpen: false, children: <DetailPanel item={roles[5]} /> } }
export const Role6Open: Story = { args: { title: roles[5].name, defaultOpen: true, children: <DetailPanel item={roles[5]} /> } }
export const FAQ1Closed: Story = { args: { title: faq[0][0], children: <p className="ui-control">{faq[0][1]}</p>, defaultOpen: false } }
export const FAQ1Open: Story = { args: { title: faq[0][0], children: <p className="ui-control">{faq[0][1]}</p>, defaultOpen: true } }
export const FAQ2Closed: Story = { args: { title: faq[1][0], children: <p className="ui-control">{faq[1][1]}</p>, defaultOpen: false } }
export const FAQ2Open: Story = { args: { title: faq[1][0], children: <p className="ui-control">{faq[1][1]}</p>, defaultOpen: true } }
export const FAQ3Closed: Story = { args: { title: faq[2][0], children: <p className="ui-control">{faq[2][1]}</p>, defaultOpen: false } }
export const FAQ3Open: Story = { args: { title: faq[2][0], children: <p className="ui-control">{faq[2][1]}</p>, defaultOpen: true } }
export const FAQ4Closed: Story = { args: { title: faq[3][0], children: <p className="ui-control">{faq[3][1]}</p>, defaultOpen: false } }
export const FAQ4Open: Story = { args: { title: faq[3][0], children: <p className="ui-control">{faq[3][1]}</p>, defaultOpen: true } }
