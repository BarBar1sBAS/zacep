import { FormEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { cases, faq, services, steps } from './data'

const ease = [0.23, 1, 0.32, 1] as const

function Mark({ compact = false }: { compact?: boolean }) {
  return <span className={compact ? 'mark compact' : 'mark'} aria-label="ЗАЦЕП">{compact ? 'Ц' : 'ЗАЦЕП'}</span>
}

function Arrow() { return <span aria-hidden="true">↗</span> }

function Header({ onCase = false }: { onCase?: boolean }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <a href="/" className="brand"><Mark /></a>
    <button className="menu-button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? 'Закрыть' : 'Меню'}</button>
    <nav className="desktop-nav" aria-label="Основная навигация">
      {onCase ? <a href="/">Главная</a> : <><a href="#services">Услуги</a><a href="#work">Работы</a><a href="#process">Подход</a></>}
      <a className="nav-cta" href={onCase ? '/#brief' : '#brief'}>Оставить заявку <Arrow /></a>
    </nav>
    <AnimatePresence>
      {open && <motion.nav id="mobile-menu" className="mobile-nav" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: .24, ease }}>
        <a href="/#services" onClick={() => setOpen(false)}>Услуги</a><a href="/#work" onClick={() => setOpen(false)}>Работы</a><a href="/#process" onClick={() => setOpen(false)}>Подход</a><a href="/#brief" onClick={() => setOpen(false)}>Оставить заявку</a>
      </motion.nav>}
    </AnimatePresence>
  </header>
}

function Hero() {
  const reduced = useReducedMotion()
  const words = ['Контент,', 'который', 'цепляет.']
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="kicker">Контент-агентство · Нижний Новгород / Россия</p>
      <h1 id="hero-title">{words.map((word, i) => <motion.span key={word} initial={reduced ? false : { opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + i * .12, duration: .65, ease }}>{word}</motion.span>)}</h1>
      <p className="hero-lead">Продвижение, которое работает на заявки. Стратегия, Reels, дизайн и таргет — в одной связке.</p>
      <div className="hero-actions"><a className="button lime magnetic" href="#brief">Обсудить задачу <Arrow /></a><a className="text-link" href="#work">Посмотреть подход ↓</a></div>
    </div>
    <motion.div className="hero-media" initial={reduced ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} transition={{ delay: .25, duration: .85, ease }}>
      <img src="/assets/hero-collage.png" alt="Авторский коллаж о производстве контента: камера, смартфон и монтажная лента" />
      <div className="hook" aria-hidden="true">↳</div>
      <p className="media-note">Не декорируем бизнес.<br />Находим, чем зацепить.</p>
    </motion.div>
  </section>
}

function Marquee() {
  return <div className="marquee" aria-label="Из Нижнего Новгорода — работаем по всей России"><div>ИЗ НИЖНЕГО НОВГОРОДА · РАБОТАЕМ ПО ВСЕЙ РОССИИ · SMM · REELS · ДИЗАЙН · ТАРГЕТ · ИЗ НИЖНЕГО НОВГОРОДА · РАБОТАЕМ ПО ВСЕЙ РОССИИ ·</div></div>
}

function Manifesto() {
  return <section className="manifesto section-pad">
    <p className="section-label">Когда контент не работает</p>
    <h2>Публикации выходят.<br /><span>Система — нет.</span></h2>
    <div className="problem-list"><p>Reels живут отдельно от бренда.</p><p>Дизайн меняется от поста к посту.</p><p>Реклама ведёт в пустоту.</p><p className="answer">Мы собираем это в один маршрут →</p></div>
  </section>
}

function Services() {
  const [active, setActive] = useState(0)
  const item = services[active]
  return <section id="services" className="services section-pad dark">
    <div className="section-heading"><p className="section-label">Что делаем</p><h2>Пять направлений.<br />Одна система.</h2></div>
    <div className="services-layout">
      <div className="service-index" role="tablist" aria-label="Услуги">
        {services.map((service, index) => <button key={service.id} role="tab" aria-selected={active === index} onClick={() => setActive(index)} onMouseEnter={() => setActive(index)}><span>{service.id}</span>{service.name}<span className="service-arrow">{active === index ? '→' : '↗'}</span></button>)}
      </div>
      <div className="service-stage" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div key={item.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .28, ease }}>
            <img src={item.visual} alt="" />
            <div className="stage-copy"><h3>{item.statement}</h3><p>{item.details}</p><ul>{item.deliverables.map(x => <li key={x}>{x}</li>)}</ul></div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </section>
}

function Work() {
  return <section id="work" className="work section-pad">
    <div className="section-heading split"><div><p className="section-label">Как это может выглядеть</p><h2>Работы говорят<br />за себя.</h2></div><p className="honesty">Здесь показаны демонстрационные направления, а не вымышленные клиентские кейсы. Реальные работы заменяются без изменения сетки.</p></div>
    <div className="work-grid">
      {cases.map((item, index) => <a className={`work-card ${item.format}`} href="/case-template" key={item.slug}>
        <div className="work-image"><img src={item.image} alt="Демонстрационный брендовый концепт" /><span>0{index + 1}</span></div>
        <div className="work-meta"><p>{item.category}</p><h3>{item.title}</h3><Arrow /></div>
      </a>)}
    </div>
  </section>
}

function Process() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 65%'] })
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 28 })
  return <section id="process" ref={ref} className="process section-pad dark">
    <p className="section-label">Как работаем</p><h2>Не магия.<br />Понятный процесс.</h2>
    <div className="process-line"><motion.i style={{ scaleX }} /></div>
    <div className="steps">{steps.map(([n, title, copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
  </section>
}

function Formats() {
  const rows = [
    ['Комплексное ведение', 'Стратегия, контент, публикация и развитие каналов.', 'Когда нужна единая команда вместо пяти подрядчиков.'],
    ['Контент-продакшен', 'Серии Reels, съёмка, монтаж и графика.', 'Когда есть стратегия, но не хватает сильного производства.'],
    ['Таргет + креативы', 'Гипотезы, рекламные материалы и оптимизация.', 'Когда трафик должен быть связан с содержанием страницы.'],
    ['Дизайн-поддержка', 'Шаблоны, презентации и текущие digital-задачи.', 'Когда бренд уже есть, но ему нужна визуальная дисциплина.'],
  ]
  return <section className="formats section-pad"><p className="section-label">Форматы сотрудничества</p><h2>Подключаемся там,<br />где нужен зацеп.</h2><div className="format-table">{rows.map(([name, offer, fit]) => <article key={name}><h3>{name}</h3><p>{offer}</p><p>{fit}</p><a href="#brief" aria-label={`Обсудить формат ${name}`}><Arrow /></a></article>)}</div></section>
}

function WhyFaq() {
  const [opened, setOpened] = useState<number | null>(0)
  return <section className="why-faq section-pad">
    <div className="why"><p className="section-label">Почему ЗАЦЕП</p><h2>Одна команда.<br />Один контекст.</h2><ul><li>Сначала понимаем задачу</li><li>Связываем контент и продвижение</li><li>Показываем статус без тумана</li><li>Не обещаем недоказуемое</li></ul></div>
    <div className="faq"><p className="section-label">Коротко о важном</p>{faq.map(([q, a], index) => <div className="faq-row" key={q}><button aria-expanded={opened === index} onClick={() => setOpened(opened === index ? null : index)}><span>{q}</span><b>{opened === index ? '−' : '+'}</b></button><AnimatePresence>{opened === index && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .24, ease }}>{a}</motion.p>}</AnimatePresence></div>)}</div>
  </section>
}

function Brief() {
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = new FormData(e.currentTarget); const next = { name: !form.get('name'), contact: !form.get('contact'), task: !form.get('task'), consent: !form.get('consent') }; setErrors(next)
    if (!Object.values(next).some(Boolean)) setSent(true)
  }
  return <section id="brief" className="brief section-pad">
    <div><p className="section-label">Следующий шаг</p><h2>Расскажите,<br />что должно<br /><span>зацепить.</span></h2><p className="brief-side">Ответим по делу: уточним задачу и предложим подходящий формат.</p></div>
    <AnimatePresence mode="wait">
      {sent ? <motion.div className="success" key="success" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><Mark compact /><h3>Заявка собрана.</h3><p>Это демонстрационный прототип, поэтому данные никуда не отправлены.</p><button onClick={() => setSent(false)}>Заполнить ещё раз</button></motion.div> :
      <motion.form key="form" onSubmit={submit} noValidate>
        <label>Имя<input name="name" aria-invalid={errors.name} placeholder="Как к вам обращаться" />{errors.name && <small>Укажите имя</small>}</label>
        <label>Компания или ниша<input name="company" placeholder="Например, мебель на заказ" /></label>
        <label>Телефон или Telegram<input name="contact" aria-invalid={errors.contact} placeholder="Как с вами связаться" />{errors.contact && <small>Нужен контакт</small>}</label>
        <label>Задача<textarea name="task" aria-invalid={errors.task} placeholder="Что хотите изменить?" />{errors.task && <small>Опишите задачу</small>}</label>
        <label className="consent"><input type="checkbox" name="consent" /> <span>Согласен на обработку данных в рамках демонстрации</span></label>{errors.consent && <small>Нужно согласие</small>}
        <button className="button black" type="submit">Собрать заявку <Arrow /></button><p className="demo-note">Демо-форма: данные не отправляются.</p>
      </motion.form>}
    </AnimatePresence>
  </section>
}

function Footer() { return <footer><Mark /><div><a href="mailto:hello@zacep.agency">hello@zacep.agency</a><p>Нижний Новгород · Россия</p></div><div><p>Telegram · VK</p><p>© 2026 · Концепт</p></div></footer> }

function HomePage() { return <><Header /><main><Hero /><Marquee /><Manifesto /><Services /><Work /><Process /><Formats /><WhyFaq /><Brief /></main><Footer /></> }

function CasePage() {
  return <><Header onCase /><main className="case-page">
    <section className="case-hero"><div><p className="kicker">Демо-кейс · Контент-система</p><h1>Серия, которая<br /><span>держит внимание.</span></h1><p>Шаблон показывает структуру кейса без вымышленных клиентов, отзывов и показателей.</p></div><img src="/assets/reels-frame.png" alt="Демонстрационный кадр контент-продакшена" /></section>
    <section className="case-facts section-pad"><div><p className="section-label">Исходная задача</p><h2>Сделать контент узнаваемым ещё до появления логотипа.</h2></div><div><p className="section-label">Что сделали</p><ul><li>Определили визуальный приём серии</li><li>Собрали сценарный каркас</li><li>Спроектировали обложки и титры</li><li>Настроили правила монтажа</li></ul></div></section>
    <section className="case-idea dark section-pad"><p className="section-label">Найденная идея</p><h2>Один визуальный зацеп.<br />Много сюжетов.</h2><p>Повторяемый графический жест связывает разные темы, а контент остаётся живым. В реальном кейсе здесь появляется объяснение решения и подтверждённый контекст.</p></section>
    <section className="case-gallery section-pad"><img className="gallery-wide" src="/assets/hero-collage.png" alt="Широкий демонстрационный коллаж" /><img className="gallery-tall" src="/assets/reels-frame.png" alt="Вертикальный демонстрационный кадр" /><img className="gallery-land" src="/assets/editing-collage.png" alt="Демонстрационный монтажный коллаж" /></section>
    <section className="case-result section-pad"><p className="section-label">Качественный результат</p><h2>Система стала цельной, повторяемой и удобной для производства.</h2><p>Цифры добавляются только после подтверждения клиентом. Пока здесь фиксируется наблюдаемый эффект без неподтверждённых обещаний.</p></section>
    <section className="case-cta"><p>Есть похожая задача?</p><h2>Давайте найдём<br />ваш зацеп.</h2><a className="button black" href="/#brief">Обсудить проект <Arrow /></a></section>
  </main><Footer /></>
}

export function App() {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => { const nav = () => setPath(location.pathname); addEventListener('popstate', nav); return () => removeEventListener('popstate', nav) }, [])
  useEffect(() => { document.querySelectorAll('a[href^="/"]').forEach(el => el.addEventListener('click', (event) => { const a = event.currentTarget as HTMLAnchorElement; if (a.origin === location.origin && !a.hash) { event.preventDefault(); history.pushState({}, '', a.pathname); setPath(a.pathname); scrollTo(0, 0) } })); }, [path])
  return path === '/case-template' ? <CasePage /> : <HomePage />
}
