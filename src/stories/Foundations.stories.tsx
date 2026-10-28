import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
function Tokens({ group = 'color' }: { group?: string }) {
  const [tokens, setTokens] = useState<[string, string][]>([])
  useEffect(() => {
    function read() { const styles = getComputedStyle(document.documentElement); setTokens(Array.from(styles).filter(key => key.startsWith(`--ui-${group}-`)).sort().map(key => [key, styles.getPropertyValue(key).trim()])) }
    read(); window.addEventListener('resize', read); return () => window.removeEventListener('resize', read)
  }, [group])
  return <div className="story-stack"><h1 className="ui-h2">Токены интерфейса</h1><p className="ui-control">Значения читаются из подключённого CSS. Источник: Sass-карты UIkit.</p><div className="story-grid">{tokens.map(([key, value]) => <div key={key} className="story-swatch">{group === 'color' && <div aria-hidden="true" style={{ background: `var(${key})`, height: 'var(--ui-space-64)', border: 'var(--ui-border-thin) solid var(--ui-border-default)' }} />}<code>{key}</code><p className="ui-caption">{value}</p></div>)}</div></div>
}
const meta = { title: 'Основа/Токены', component: Tokens, argTypes: { group: { control: 'select', options: ['color', 'space', 'border', 'radius', 'size', 'motion', 'font', 'weight', 'layout', 'type'] } }, parameters: { docs: { description: { component: 'Sass API: @use styles as ui. Подключение CSS: import styles/main.scss. Цветовые роли ссылаются на примитивы; токены можно переопределять CSS-переменными.' } } } } satisfies Meta<typeof Tokens>
export default meta
type Story = StoryObj<typeof meta>
export const Colors: Story = { args: { group: 'color' }, play: async ({ canvasElement }) => { await expect(await within(canvasElement).findByText('--ui-color-lime')).toBeVisible() } }
export const Spacing: Story = { args: { group: 'space' } }
export const Borders: Story = { args: { group: 'border' } }
export const Radius: Story = { args: { group: 'radius' } }
export const Sizes: Story = { args: { group: 'size' } }
export const Motion: Story = { args: { group: 'motion' } }
export const Fonts: Story = { args: { group: 'font' } }
export const Weights: Story = { args: { group: 'weight' } }
export const Layout: Story = { args: { group: 'layout' } }
export const SemanticRoles: Story = { render: () => <div className="story-stack">{['surface-canvas', 'surface-inverse', 'surface-disabled', 'text-primary', 'text-secondary', 'text-inverse', 'action-primary', 'border-default', 'border-subtle', 'feedback-error', 'focus-ring'].map(role => <div key={role} className="story-icon"><span aria-hidden="true" style={{ background: `var(--ui-${role})`, width: 'var(--ui-space-48)', height: 'var(--ui-space-48)', border: 'var(--ui-border-thin) solid var(--ui-border-subtle)' }} /><code>--ui-{role}</code></div>)}</div> }
export const Typography: Story = { render: () => <div className="story-stack">{['h1', 'h2', 'h3', 'body', 'control', 'label', 'caption', 'button'].map(type => <div key={type}><p className="ui-caption">{type}</p><p className={`ui-${type}`}>Контент, который цепляет</p></div>)}</div> }
export const Grid: Story = { render: () => <div className="ui-container"><div className="ui-grid">{Array.from({ length: 12 }, (_, i) => <div className="story-swatch" key={i}>{i + 1}</div>)}</div></div> }
