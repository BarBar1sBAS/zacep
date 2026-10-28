import { useEffect, useId, useRef, useState } from 'react'
import { Logo } from './Logo'
import { Button } from './Controls'
export type NavItem = { label: string; href: string }
export const navigation: NavItem[] = [{ label: 'Услуги', href: '#services' }, { label: 'Работы', href: '#work' }, { label: 'Команда', href: '#team' }, { label: 'Заявка', href: '#brief' }]
export type MobileMenuProps = { open: boolean; onClose: () => void; items?: NavItem[]; id?: string }
export function MobileMenu({ open, onClose, items = navigation, id }: MobileMenuProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (!open) { node.close(); return }
    node.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { node.close(); document.body.style.overflow = previous }
  }, [open])
  return <dialog ref={dialog} id={id} className="ui-menu" aria-label="Навигация" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); onClose() } }} onCancel={event => { event.preventDefault(); onClose() }}><Button variant="secondary" icon="close" onClick={onClose} autoFocus>Закрыть</Button><nav aria-label="Мобильная навигация">{items.map(item => <a key={item.href} className="ui-button ui-button--primary" href={item.href} onClick={onClose}>{item.label}</a>)}</nav></dialog>
}
export type HeaderProps = { items?: NavItem[]; homeHref?: string; currentHref?: string }
export function Header({ items = navigation, homeHref = '/', currentHref }: HeaderProps) {
  const [open, setOpen] = useState(false), trigger = useRef<HTMLButtonElement>(null), id = useId()
  function close() { setOpen(false); trigger.current?.focus() }
  return <header className="ui-header"><div className="ui-container ui-header__inner"><a href={homeHref} aria-label="Зацеп, главная"><Logo /></a><nav className="ui-header__desktop" aria-label="Основная навигация">{items.map(item => <a key={item.href} href={item.href} aria-current={item.href === currentHref ? 'page' : undefined} className={`ui-button ui-button--${item.href.endsWith('#brief') ? 'primary' : 'link'}`}>{item.label}</a>)}</nav><Button ref={trigger} variant="secondary" icon="menu" className="ui-header__toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>Меню</Button></div><MobileMenu id={id} open={open} onClose={close} items={items} /></header>
}
