import { useId, useState, type HTMLAttributes, type ReactNode } from 'react'
import { Icon } from './Icon'
import { SelectionRow } from './Controls'
import { services, roles, faq } from './data'
export type DetailItem = { name: string; title: string; desc: string; items: string[]; result: string }
export function DetailPanel({ item }: { item: DetailItem }) {
  return <div className="ui-detail"><h3 className="ui-h3">{item.title.replaceAll('\n', ' ')}</h3><p className="ui-control">{item.desc}</p><ol>{item.items.map(text => <li key={text}>{text}</li>)}</ol><div className="ui-detail__outcome"><p className="ui-label">РЕЗУЛЬТАТ</p><p className="ui-control">{item.result}</p></div></div>
}
export type AccordionProps = { title: string; children: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }
export function Accordion({ title, children, open, defaultOpen = false, onOpenChange }: AccordionProps) {
  const [local, setLocal] = useState(defaultOpen), expanded = open ?? local, id = useId()
  return <div className="ui-accordion"><h3><button type="button" id={`${id}-trigger`} aria-expanded={expanded} aria-controls={`${id}-panel`} onClick={() => { setLocal(!expanded); onOpenChange?.(!expanded) }}>{title}<Icon name={expanded ? 'minus' : 'plus'} /></button></h3><div id={`${id}-panel`} aria-labelledby={`${id}-trigger`} hidden={!expanded} className="ui-accordion__body">{children}</div></div>
}
export type SelectorProps = { items?: DetailItem[]; defaultSelected?: number }
function Selector({ items, defaultSelected = 0 }: Required<Pick<SelectorProps, 'items'>> & Pick<SelectorProps, 'defaultSelected'>) {
  const [selected, setSelected] = useState(defaultSelected), item = items[selected] ?? items[0]
  if (!item) return null
  return <><div className="ui-selector"><div className="ui-selector__options" aria-label="Выбор направления">{items.map((d, i) => <SelectionRow key={d.name} selected={d === item} onClick={() => setSelected(i)}>{d.name}</SelectionRow>)}</div><DetailPanel item={item} /></div><div className="ui-selector-mobile">{items.map((d, i) => <Accordion key={d.name} title={d.name} open={selected === i} onOpenChange={open => setSelected(open ? i : -1)}><DetailPanel item={d} /></Accordion>)}</div></>
}
export function ServiceSelector({ items = services, ...props }: SelectorProps) { return <Selector items={items} {...props} /> }
export function RoleSelector({ items = roles, ...props }: SelectorProps) { return <Selector items={items} {...props} /> }
export function FAQ({ items = faq }: { items?: string[][] }) { return <div className="ui-faq">{items.map(([title, answer]) => <Accordion key={title} title={title}><p className="ui-control">{answer}</p></Accordion>)}</div> }
export type ContentBlockProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & { title: string }
export function Step({ number, title, children, className = '', ...props }: ContentBlockProps & { number: string }) {
  return <article {...props} className={`ui-step ${className}`}><span className="ui-step__number">{number}</span><h3 className="ui-h3">{title}</h3><p className="ui-control">{children}</p></article>
}
export function FormatCard({ title, children, className = '', ...props }: ContentBlockProps) {
  return <article {...props} className={`ui-format ${className}`}><h3 className="ui-h3">{title}</h3><p className="ui-control">{children}</p></article>
}
export type WorkCardProps = ContentBlockProps & { variant: 'featured' | 'content' | 'launch'; image: string; imageAlt: string; tag: string; href?: string }
export function WorkCard({ variant, title, image, imageAlt, tag, href, children, className = '', ...props }: WorkCardProps) {
  return <article {...props} className={`ui-work ui-work--${variant} ${className}`}><img src={image} alt={imageAlt} /><p className="ui-label">{tag}</p><h3 className="ui-h3">{title}</h3>{children && <p className="ui-control ui-text-secondary">{children}</p>}{href && <a className="ui-button ui-button--link" href={href}>Посмотреть кейс<Icon name="arrow" /></a>}</article>
}
