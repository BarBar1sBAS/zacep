# Зацеп / UI kit

React + TypeScript + Vite. Лендинг и страница кейса собраны из библиотеки React-компонентов на существующей SCSS-системе. UI kit доступен в Storybook. Исходный `prototype/` остаётся самостоятельным референсом; команды из корня работают с новым приложением.

```sh
npm ci
npm run dev
npm run build
npm test
```

`npm run dev` запускает лендинг на адресе, который напечатает Vite. `/case-template` открывает демонстрационный кейс; неизвестные адреса показывают 404. Сайт закрыт от индексации, форма пока не отправляет данные. `dist/` содержит результат production-сборки.

## Storybook и React-компоненты

```sh
npx playwright install chromium  # один раз для браузерных тестов
npm run storybook               # http://127.0.0.1:6006
npm run test:ui                 # все истории, взаимодействия и accessibility в Chromium
npm run test:ui:watch           # TDD: тест → ожидаемое падение → реализация → рефакторинг
npm run build-storybook        # статический сайт в storybook-static/
npm run test:responsive        # при запущенном Storybook: 390 / 768 / 1440, reduced motion
```

Для проверки статической сборки запустите её HTTP-сервером и передайте адрес через `STORYBOOK_URL`. Адаптивная проверка сохраняет PNG в `test-results/storybook/`, проверяет изображения, отсутствие горизонтального скролла, Tab/Shift+Tab, Escape и возврат фокуса в меню. Журнал разработки: [tests/TDD.md](tests/TDD.md).

Разделы Storybook: основа, все шесть иконок, логотипы, контролы, контент, навигация и формы. Docs показывает свойства и исходный JSX, Controls позволяет менять параметры. Состояния hover/pressed/focus демонстрируются через pseudo-states и реальные действия; публичного свойства `state` у контролов нет.

```tsx
import './styles/main.scss'
import { Button, Input, Checkbox, ServiceSelector, BriefForm } from './components'
import type { BriefValues } from './components'

<Button variant="primary" onClick={openBrief}>Обсудить задачу</Button>
<Input label="Имя" name="name" hint="Как к вам обращаться" />
<Checkbox label="Согласен на обработку персональных данных" />
<ServiceSelector />
<BriefForm onSubmit={async (values: BriefValues) => {
  await sendBrief(values) // обработчик приложения; успешный Promise подтверждает отправку
}} />
```

Единый экспорт компонентов и типов: `src/components/index.ts`. Библиотека не импортирует оформление каталога или Storybook.

| Группа | Компоненты / свойства |
| --- | --- |
| Контролы | Button: variant, busy, icon; Input/Textarea: label, hint, error; Checkbox: label, error; SelectionRow: selected |
| Ресурсы | Icon: name, size, label и SVG-свойства; Logo: surface paper/ink/lime и SVG-свойства |
| Выбор | ServiceSelector / RoleSelector: items, defaultSelected; DetailPanel: item типа DetailItem |
| Контент | Accordion: title, children, defaultOpen или open/onOpenChange; FAQ: items; Step: number/title; FormatCard: title; WorkCard: variant, image, imageAlt, tag, title, href |
| Навигация | Header: items, homeHref, currentHref; MobileMenu: open, onClose, items |
| Форма | BriefForm: onSubmit(values): Promise<void>, defaultValues; BriefValues: name, company, contact, task, consent |

Кнопки, поля и checkbox передают нативные HTML-свойства и ref соответствующему контролу. Для ссылки используйте `<a className="ui-button ui-button--link">`: Button остаётся нативной кнопкой. Иконка по умолчанию декоративная; самостоятельной иконке задавайте `label`. Логотип на тёмной поверхности использует `surface="ink"`; фон задаёт потребитель.

Форма проверяет имя, контакт, задачу и согласие, переводит фокус на первую ошибку и связывает сообщения с полями. Пока Promise выполняется, контролы заблокированы. При ошибке данные остаются в памяти компонента и повторно передаются обработчику; после успеха можно начать новую заявку. Перезагрузка страницы очищает данные. В Storybook используются локальные обработчики успеха, ожидания и ошибки, сетевой отправки нет.

Storybook 10.6.5 и Vitest 5.0.5 работают на Node 22.21.0. В `vitest.config.ts` есть небольшая совместимость с кириллицей в пути проекта: Storybook декодирует только пробелы в проверке пути теста, поэтому дополнительно применяется decodeURI. Без этого раннер регистрирует ноль тестов. Настройку можно удалить после исправления upstream и проверки запуска тестов из папки с кириллицей.

## Подключение

В точке входа приложения один раз:

```ts
import './styles/main.scss'
```

В SCSS потребителя:

```scss
@use './styles' as ui;

.example {
  @include ui.stack(24);
  @include ui.typography(body);
  color: ui.color(text-primary);
  border: ui.token(border, thin) solid ui.color(border-subtle);

  @include ui.from(desktop) { max-width: 70ch; }
}
```

`src/styles/_index.scss` экспортирует только API, без CSS. Его можно подключать в любом количестве файлов. `main.scss` генерирует токены, шрифты, базу и классы. `src/site.scss` оформляет только страницы сайта и не входит в библиотеку. Прежнее оформление каталога сохранено в `src/catalog.scss`.

## Структура

| Модуль | Назначение |
| --- | --- |
| `tokens/_maps.scss` | Единственный источник исходных значений, ролей, типографики и адаптивных настроек |
| `tokens/_emit.scss` | Генерация CSS-переменных и адаптивных переопределений |
| `tools/` | Строгий доступ к токенам, миксины без побочного CSS |
| `base/` | Локальные шрифты, минимальный reset, стили документа и доступность |
| `components/` | Глобальные классы базовых элементов |

## Токены

Исходные значения находятся в Sass-картах, которые также доступны через публичный модуль. CSS-переменные можно переопределять во время выполнения. Семантические роли ссылаются на примитивы через `var()`, поэтому изменение примитива распространяется на потребителей.

| Группа | Ключи / значения | CSS |
| --- | --- | --- |
| `$colors` | paper `#F3F0E8`, ink `#1E1E1E`, lime `#DCFE38`, muted `#54534F`, line `#BAB8B0`, disabled `#DEDDD6`, error `#A32920` | `--ui-color-{name}` |
| `$roles` | surface-canvas, surface-inverse, surface-disabled, text-primary, text-secondary, text-inverse, action-primary, border-default, border-subtle, feedback-error, focus-ring | `--ui-{role}` |
| `$spaces` | 0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96 px | `--ui-space-{step}` |
| `$borders` | thin: 1px, strong: 2px | `--ui-border-{name}` |
| `$radii` | square: 0px | `--ui-radius-square` |
| `$sizes` | touch-min: 44px, button: 56px, input: 52px, textarea: 112px, checkbox: 24px, content-max: 1440px | `--ui-size-{name}` |
| `$motion` | standard: 240ms, easing: cubic-bezier(0, 0, .58, 1) | `--ui-motion-{name}` |
| `$fonts` | body: Manrope, display: Unbounded | `--ui-font-{name}` |
| `$weights` | regular: 400, semibold: 600, bold: 700, black: 900 | `--ui-weight-{name}` |

Семантика: canvas → paper, inverse → ink, disabled → disabled; primary text → ink, secondary text → muted, inverse text → paper; primary action → lime; default border/focus → ink, subtle border → line; error → error. На тёмной поверхности цвет фокуса нужно переопределить контрастным значением, например `--ui-focus-ring: var(--ui-color-paper)`.

### Типографика

Шрифты поставляются через Fontsource и включают Cyrillic и Latin; сетевой запрос к Google Fonts не нужен. Все стили имеют tracking 0, кроме заголовков: `-.03em`. В таблице размер / межстрочный интервал в px.

| Стиль | Шрифт / вес | Mobile | Tablet | Desktop |
| --- | --- | --- | --- | --- |
| h1 | Unbounded / 900 | 32/40 | 48/60 | 64/80 |
| h2 | Unbounded / 900 | 28/35 | 36/45 | 44/55 |
| h3 | Unbounded / 900 | 20/28 | 24/30 | 24/30 |
| body | Manrope / 400 | 16/24 | 18/27 | 18/27 |
| control | Manrope / 400 | 16/24 | 16/24 | 16/24 |
| label | Manrope / 700 | 12/18 | 12/18 | 12/18 |
| caption | Manrope / 400 | 12/18 | 12/18 | 12/18 |
| button | Manrope / 700 | 14/21 | 14/21 | 14/21 |

Каждый стиль генерирует `--ui-type-{name}-{family|weight|tracking|size|line}`. Размер и межстрочный интервал переключаются на корневом элементе через media queries. Явный `.ui-h1` не меняет семантику HTML: используйте корректный уровень заголовка.

### Адаптивность

| Диапазон | Колонки | Поля контейнера | Gap | Интервал секции |
| --- | --- | --- | --- | --- |
| <600px | 1 | 20px | 20px | 56px |
| ≥600px, <1024px | 8 | 32px | 20px | 72px |
| ≥1024px | 12 | 48px | 24px | 96px |

`--ui-layout-{columns|gutter|gap|section}` автоматически меняются. Максимум контейнера 1440px включает поля. Брейкпоинты доступны только как Sass-значения: CSS-переменные не подходят для условий media queries. У `.ui-grid` нет автоматического span для детей: размещение элементов задаёт потребитель.

## Sass API

| Функция / миксин | Контракт |
| --- | --- |
| `color($name)` | CSS var примитива или семантической роли |
| `space($step)` | CSS var именованного отступа; шаг числовой, например `24` |
| `token($group, $name)` | CSS var группы border, radius, size, motion, font, weight |
| `breakpoint($name)` | Числовое Sass-значение tablet/desktop |
| `lookup($map, $key, $group)` | Строгий доступ к карте с диагностикой |
| `typography($name)` | Семейство, вес, размер, интерлиньяж и трекинг стиля |
| `from($name) { … }` | Mobile-first media query от именованного брейкпоинта |
| `container` | Fluid-контейнер с адаптивными полями и ограничением ширины |
| `grid` | Адаптивная сетка 1/8/12 колонок |
| `stack($gap: 16)` | Вертикальный flex-поток с именованным отступом |
| `section-space` | Вертикальные отступы секции |
| `focus-ring` | Контрастный outline 2px с отступом 2px |
| `transition($properties...)` | Переход выбранных свойств 240ms; 0ms при reduced motion |
| `reduced-motion { … }` | Media query prefers-reduced-motion: reduce |
| `control-base` | Типографика, поверхность, цвет, рамка и радиус контрола |
| `control-states` | Hover, focus, aria-invalid и disabled/aria-disabled |
| `visually-hidden` | Скрытие текста с сохранением доступности |

Неизвестный ключ останавливает Sass-компиляцию с сообщением `Unknown … token` и списком доступных ключей. `transition` принимает свойства явно: не передавайте `all` и не анимируйте размеры/раскладку.

## Готовые классы

- Типографика: `.ui-h1`, `.ui-h2`, `.ui-h3`, `.ui-body`, `.ui-control`, `.ui-label`, `.ui-caption`, `.ui-text-secondary`.
- Раскладка: `.ui-container`, `.ui-grid`, `.ui-stack`, `.ui-section`.
- Кнопки: `.ui-button` + `.ui-button--primary`, `--secondary` или `--link`.
- Поля: `.ui-field`, `.ui-field__label`, `.ui-input`, `.ui-textarea`, `.ui-field__hint`, `.ui-field__error`.
- Checkbox: `.ui-checkbox` на label, `.ui-checkbox__control` на нативном input.
- Доступность: `.ui-visually-hidden`, `.ui-skip-link`.

```html
<button type="button" class="ui-button ui-button--primary">
  Обсудить задачу
</button>

<div class="ui-field">
  <label for="contact" class="ui-field__label">Телефон или Telegram</label>
  <input id="contact" class="ui-input" aria-invalid="true" aria-describedby="contact-error" />
  <p id="contact-error" class="ui-field__error">Укажите контакт</p>
</div>

<label class="ui-checkbox">
  <input type="checkbox" class="ui-checkbox__control" />
  <span>Согласен на обработку персональных данных</span>
</label>
```

Состояния используют нативные псевдоклассы и ARIA. Заполненное поле использует реальное значение, checkbox — `:checked`. Для недоступных кнопок используйте `disabled`; `aria-disabled` только объявляет состояние, блокировку действий и клавиатурную семантику обеспечивает потребитель. При `aria-busy="true"` задавайте также `disabled`, сохраняйте читаемую подпись «Отправляем…». CSS не отправляет формы, не выполняет валидацию, не управляет фокусом и не реализует блокировку событий у ссылок. Сообщения об ошибках связывайте с контролом через `aria-describedby`.

## Источник и отличия

Палитра сайта и локальных исходников обновлена 28.10.2026: Lime `#DCFE38`, Ink `#1E1E1E`. Сам файл Figma в рамках этого обновления не изменялся.

[Figma: Foundations / 05 · UI Kit](https://www.figma.com/design/33uZlvdpstuANY0xc0tvUf?node-id=134-2445). Foundations был просмотрен через Computer Use. MCP-чтение недоступно из-за лимита тарифа; сохранённые исходники `output/figma/product/base.js` и `layouts.js` дают точные значения и состояния. Полная повторная инспекция каждого варианта в актуальном файле не выполнена.

`DESIGN.md` описывает более ранние интервалы: H1 64/72, H2 44/52, H3 24/32, mobile H2 28/36, body 18/28. Продуктовая библиотека использует 64/80, 44/55, 24/30, 28/35, 18/27. Перенесены продуктовые значения; исходный документ сохранён. Mobile H3 20/28 и tablet H3 24/30 взяты из размеров компонентов; интервал секции tablet 72px выбран между mobile 56px и desktop 96px. Состояния Link дополнены подчёркиванием, чтобы обратная связь была заметна без изменения фирменной палитры. React Checkbox использует фирменную SVG-иконку check; для прежней HTML-разметки сохранена CSS-галочка.

## Расширение

Новый общий размер или цвет добавляйте в карту, роль — в `$roles`. CSS генерируется автоматически. Новые компоненты подключайте в `main.scss`, собирайте их общие правила из миксинов. Специфическую раскладку секции держите у потребителя. Не копируйте значения токенов в TS и не генерируйте все возможные utility-классы.

Автотесты проверяют отсутствие CSS у публичного API, композицию миксинов, диагностику неверных ключей, однократную генерацию токенов и наличие состояний. Визуальные проверки выполняются на 390/768/1440px, включая фокус, checkbox, ошибки, disabled и reduced motion.

## Лендинг

Главная `/` и кейс `/case-template` используют существующие изображения, шрифты, токены и компоненты. Переходы выполняются обычными ссылками; сервер публикации должен отдавать `index.html` для маршрутов приложения.

```sh
npm run test:landing  # при запущенном сайте на 5173
SITE_URL=http://127.0.0.1:4173 npm run test:landing  # проверка preview-сборки
```

Проверки охватывают 360 / 390 / 600 / 768 / 1024 / 1440 px, форму без отправки, услуги, роли, FAQ, меню, клавиатуру, переходы и 404. Снимки обеих страниц на 390 / 768 / 1440 px сохраняются в `test-results/landing/`.

`<BriefForm submissionDisabled />` проверяет поля и показывает «Отправка пока недоступна», сохраняя введённое. Обработчик не вызывается, сеть не используется, успешная отправка не имитируется. Для подключения сервиса замените этот режим на существующий `onSubmit(values): Promise<void>`. Не вызывайте успешное завершение до подтверждения сервера.

Перед публикацией нужны подтверждённые контакты, политика обработки данных и юридический текст согласия. После выбора домена задайте абсолютный `og:image` и снимите `noindex`, когда сайт будет готов к приёму заявок.
