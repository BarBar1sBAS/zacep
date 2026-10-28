import { useEffect, type ReactNode } from 'react'
import {
  BriefForm, FAQ, FormatCard, Header, Icon, Logo, RoleSelector,
  ServiceSelector, Step, WorkCard, formats, navigation, steps,
} from './components'

const base = import.meta.env.BASE_URL

function Action({ href = '#brief', children = 'Обсудить задачу', secondary = false }: { href?: string; children?: ReactNode; secondary?: boolean }) {
  return <a className={`ui-button ui-button--${secondary ? 'link' : 'primary'} site-action`} href={href}>{children}<Icon name="arrow" /></a>
}

function Section({ id, label, title, children, lime = false }: { id?: string; label: string; title: ReactNode; children?: ReactNode; lime?: boolean }) {
  return <section id={id} className={`site-section${lime ? ' site-section--lime' : ''}`}>
    <div className="ui-container site-stack">
      <div className="site-heading"><p className="ui-label">{label}</p><h2 className="ui-h2">{title}</h2></div>
      {children}
    </div>
  </section>
}

function Footer() {
  return <footer className="site-footer ui-container"><div className="site-footer__inner">
    <a href={base} aria-label="Зацеп, главная"><Logo /></a>
    <div><p className="ui-control">Нижний Новгород</p><p className="ui-caption">Работаем по всей России</p></div>
    <p className="ui-caption">ЗАЦЕП © 2026</p>
  </div></footer>
}

function Home() {
  return <>
    <section className="site-hero ui-container" aria-labelledby="hero-title">
      <div className="site-hero__composition">
        <div className="site-hero__offer">
          <p className="ui-label">ЗАЦЕП / КОНТЕНТ-АГЕНТСТВО</p>
          <h1 id="hero-title" className="ui-h1">Контент,<br />который цепляет.</h1>
          <p className="site-lead">Стратегия, Reels, дизайн и таргет в одной системе продвижения.</p>
          <Action />
        </div>
        <img className="site-hero__image" src={`${base}assets/hero-collage.png`} alt="Коллаж о создании контента: смартфон, плёнка и монтажная лента" fetchPriority="high" />
      </div>
      <div className="site-geography ui-label"><span>НИЖНИЙ НОВГОРОД</span><span>РАБОТАЕМ ПО ВСЕЙ РОССИИ</span></div>
    </section>

    <Section id="services" label="01 / УСЛУГИ" title={<>Когда контент есть.<br />А системы нет.</>}>
      <div className="site-problems">{[
        ['Соцсети рывками', 'Нет единого ритма публикаций.'],
        ['Визуал распадается', 'Бренд выглядит по-разному.'],
        ['Реклама отдельно', 'Контент и продвижение не связаны.'],
      ].map(([title, body]) => <article key={title}><h3 className="site-subtitle">{title}</h3><p className="ui-control ui-text-secondary">{body}</p></article>)}</div>
      <h3 className="site-subheading">Собираем в одну систему.</h3>
      <ServiceSelector />
    </Section>

    <Section id="work" label="02 / РАБОТЫ" title={<>Показываем,<br />как может цеплять.</>}>
      <p className="ui-control ui-text-secondary">Демонстрационные концепции. Они показывают подход к визуалу и содержанию.</p>
      <WorkCard className="site-work-featured" variant="featured" title="Серия, которая держит внимание" image={`${base}assets/editing-collage.png`} imageAlt="Камера, наушники и монтажная лента в графике контентной серии" tag="01 / ДЕМО-КЕЙС · REELS" href={`${base}case-template/`} />
      <div className="site-work-grid">
        <WorkCard variant="content" title="Контент как узнаваемая система" image={`${base}assets/reels-frame.png`} imageAlt="Камера и вертикальный кадр в фирменной графике" tag="02 / ДЕМО-НАПРАВЛЕНИЕ · SMM">Рубрики, графика и единый ритм публикаций.</WorkCard>
        <WorkCard variant="launch" title="Один запуск. Один ясный маршрут." image={`${base}assets/hero-collage.png`} imageAlt="Смартфон и кадры кампании в фирменном коллаже" tag="03 / ДЕМО-НАПРАВЛЕНИЕ · КАМПАНИЯ">Связь сообщения, креатива и точки обращения.</WorkCard>
      </div>
    </Section>

    <Section id="process" label="03 / ПРОЦЕСС" title="Понятно, что дальше.">
      <div className="site-four-grid">{steps.map(([title, body], i) => <Step key={title} number={`0${i + 1}`} title={title}>{body}</Step>)}</div>
      <h3 className="site-subheading">Формат под вашу задачу.</h3>
      <div className="site-four-grid">{formats.map(([title, body]) => <FormatCard key={title} title={title}>{body}</FormatCard>)}</div>
    </Section>

    <Section id="team" label="04 / КОМАНДА" title={<>За проектом<br />стоят роли.</>}>
      <p className="site-lead">Одна задача. Общий контекст. Понятная ответственность.</p>
      <p className="ui-control ui-text-secondary">Это функции в проекте. Состав команды зависит от задачи.</p>
      <RoleSelector />
    </Section>

    <Section id="faq" label="05 / ВОПРОСЫ" title="Коротко о важном."><FAQ /></Section>

    <section id="brief" className="site-section site-section--lime">
      <div className="ui-container site-brief">
        <div className="site-heading"><p className="ui-label">06 / ЗАЯВКА</p><h2 className="ui-h2">Найдём,<br />чем зацепить.</h2><p>Расскажите о задаче. Уточним детали и предложим подходящий формат.</p><p className="ui-caption">* Обязательные поля</p></div>
        <BriefForm submissionDisabled />
      </div>
    </section>
  </>
}

function Case() {
  return <>
    <section className="site-case-intro ui-container site-stack" aria-labelledby="case-title">
      <Action href={`${base}#work`} secondary>Вернуться к работам</Action>
      <p className="ui-label">ДЕМО-КЕЙС / REELS И КОНТЕНТ</p>
      <h1 id="case-title" className="ui-h1">Серия, которая<br />держит внимание.</h1>
      <p>Демонстрационная концепция: один визуальный приём объединяет разные сюжеты.</p>
      <img className="site-case-cover" src={`${base}assets/hero-collage.png`} alt="Визуальный принцип серии: смартфон, плёнка и лаймовые акценты" fetchPriority="high" />
    </section>
    <Section label="01 / ЗАДАЧА" title={<>Узнаваемость<br />с первого кадра.</>}><p>Показать, как контент сохраняет характер бренда ещё до появления логотипа.</p></Section>
    <Section label="02 / ИДЕЯ" title={<>Один визуальный зацеп.<br />Много сюжетов.</>} lime><p>Повторяемый графический жест связывает ролики в серию. Меняются темы и ритм; остаются голос и узнаваемая графика.</p></Section>
    <Section label="03 / ВЫПОЛНЕННЫЕ РАБОТЫ" title="Правила для серии.">
      <div className="site-deliverables">{[
        ['01 / Сценарный каркас', 'Единая логика начала, развития и завершения короткого ролика.'],
        ['02 / Обложки и титры', 'Типографика, акценты и композиция в фирменном характере.'],
        ['03 / Правила монтажа', 'Ритм, переходы и адаптации под вертикальный формат.'],
      ].map(([title, body]) => <article key={title}><h3 className="site-subtitle">{title}</h3><p className="ui-control">{body}</p></article>)}</div>
    </Section>
    <Section label="04 / МАТЕРИАЛЫ" title={<>Один приём.<br />Разный ритм.</>}>
      <div className="site-case-gallery"><img src={`${base}assets/reels-frame.png`} alt="Вертикальная композиция контентной серии" loading="lazy" /><img src={`${base}assets/editing-collage.png`} alt="Графические элементы и монтажная лента серии" loading="lazy" /></div>
    </Section>
    <Section label="05 / РЕЗУЛЬТАТ" title={<>Цельная система<br />для производства.</>}><p>Зафиксированы визуальный принцип серии, сценарный каркас и правила применения. Это демонстрационный проект; клиентские показатели не заявляются.</p></Section>
    <Section label="06 / ЗАЯВКА" title="Есть похожая задача?" lime><Action href={`${base}#brief`} /></Section>
  </>
}

export function App() {
  const path = '/' + window.location.pathname.slice(base.length).replace(/\/$/, '')
  const home = path === '/', isCase = path === '/case-template'
  useEffect(() => {
    document.title = home ? 'Зацеп — контент, который цепляет' : isCase ? 'Серия, которая держит внимание — Зацеп' : 'Страница не найдена — Зацеп'
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    // Cross-page anchors resolve after React has mounted and local fonts settle.
    void document.fonts.ready.then(() => {
      if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    })
  }, [home, isCase])
  return <div className="site">
    <a className="ui-skip-link" href="#main">Перейти к содержанию</a>
    <Header homeHref={base} items={home ? navigation : navigation.map(item => ({ ...item, href: `${base}${item.href}` }))} />
    <main id="main" tabIndex={-1}>{home ? <Home /> : isCase ? <Case /> : <section className="site-not-found ui-container site-stack"><p className="ui-label">404 / ЗАЦЕП</p><h1 className="ui-h1">Страница не найдена.</h1><p>Проверьте адрес или вернитесь на главную.</p><Action href={base}>На главную</Action></section>}</main>
    <Footer />
  </div>
}
