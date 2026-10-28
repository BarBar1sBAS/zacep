from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/04_zacep-concept-summary.pdf'
FONTS = ROOT / 'tmp/pdfs/fonts'
W, H = 960, 540
BLACK = HexColor('#111111')
MID = HexColor('#707070')
LIGHT = HexColor('#D8D8D8')
PALE = HexColor('#F4F4F4')
WHITE = HexColor('#FFFFFF')

pdfmetrics.registerFont(TTFont('Manrope', str(FONTS / 'Manrope-400.ttf')))
pdfmetrics.registerFont(TTFont('ManropeSemi', str(FONTS / 'Manrope-600.ttf')))
pdfmetrics.registerFont(TTFont('ManropeBold', str(FONTS / 'Manrope-700.ttf')))
pdfmetrics.registerFont(TTFont('LogoHeavy', str(FONTS / 'Unbounded-900.ttf')))

refs = [
    ('SETTERS', 'https://www.setters.agency/we-are',
     'Понятная архитектура услуг, короткие тексты и доверие через клиентов и награды.',
     'Ясный маршрут: оффер, услуги, работы, доказательства и заявка.'),
    ('REDKEDS', 'https://redkeds.com/',
     'Портфолио выступает главным аргументом, а асимметричная подача создаёт характер.',
     'Показать работы раньше и использовать разный масштаб кейсов.'),
    ('Shift Motion', 'https://shiftmotion.ru/',
     'Практичная подача услуг и работ для российского бизнеса, категории кейсов и отзывы.',
     'Сделать услуги понятными и оставить место для реальных отзывов.'),
    ('HEADLINE', 'https://www.headlineideas.com/',
     'С первого экрана понятно, что агентство специализируется на social-first продвижении.',
     'Сразу обозначить специализацию и перечислить основные услуги.'),
    ('Our Own Brand', 'https://ourownbrand.co/',
     'Кейсы связывают креативную идею с задачей бизнеса, а не только показывают картинку.',
     'Строить кейс по схеме: задача, идея, работы, подтверждённый результат.'),
    ('Dog House Riot', 'https://www.doghouseriot.com/',
     'Высокий контраст и строгая необруталистичная система выглядят смело, но собранно.',
     'Использовать сильную иерархию, рамки и контраст без визуального шума.'),
    ('Obys', 'https://obys.agency/',
     'Крупная типографика, ритмичная сетка портфолио и чередование плотных и свободных блоков.',
     'Сделать заголовки заметными, а кейсы - разными по масштабу.'),
    ('Bold Creative', 'https://weareboldcreative.com/',
     'Логичная последовательность: оффер, процесс, работы и переход к обращению.',
     'Повторять CTA после ключевых блоков и вести к короткой форме.'),
]

def background(c):
    c.setFillColor(WHITE); c.rect(0, 0, W, H, fill=1, stroke=0)

def txt(c, x, y, value, size=11, font='Manrope', color=BLACK):
    c.setFillColor(color); c.setFont(font, size); c.drawString(x, y, value)

def wrapped(c, x, y, value, width=48, size=11, leading=16, font='Manrope', color=BLACK):
    words = value.split(); lines = []; line = []
    for word in words:
        candidate = ' '.join(line + [word])
        if len(candidate) > width and line:
            lines.append(' '.join(line)); line = [word]
        else:
            line.append(word)
    if line: lines.append(' '.join(line))
    for i, line in enumerate(lines): txt(c, x, y - i * leading, line, size, font, color)
    return y - len(lines) * leading

def heading(c, value, x=44, y=465, size=30):
    c.setFont('ManropeBold', size); c.setFillColor(BLACK)
    for i, line in enumerate(value.split('\n')): c.drawString(x, y - i * (size + 3), line)

def overline(c, value, page):
    txt(c, 44, 507, value.upper(), 7.5, 'ManropeSemi', MID)
    txt(c, 900, 507, f'{page:02}', 7.5, 'ManropeSemi', MID)
    c.setStrokeColor(LIGHT); c.setLineWidth(.7); c.line(44, 493, 916, 493)

def footer(c):
    c.setStrokeColor(LIGHT); c.setLineWidth(.6); c.line(44, 31, 916, 31)
    txt(c, 44, 17, 'КОНЦЕПЦИЯ САЙТА МАРКЕТИНГОВОГО АГЕНТСТВА', 6.5, 'ManropeSemi', MID)

def rect(c, x, y, w, h, label='', fill=WHITE, stroke=BLACK, lw=1, size=8):
    c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(lw); c.rect(x, y, w, h, fill=1, stroke=1)
    if label: txt(c, x + 8, y + h - 15, label, size, 'ManropeSemi', BLACK)

def link_text(c, x, y, label, url):
    txt(c, x, y, label, 8.5, 'ManropeSemi', BLACK)
    width = pdfmetrics.stringWidth(label, 'ManropeSemi', 8.5)
    c.setStrokeColor(BLACK); c.setLineWidth(.5); c.line(x, y - 2, x + width, y - 2)
    c.linkURL(url, (x, y - 4, x + width, y + 10), relative=0, thickness=0)

def reference_card(c, x, y, w, h, item, idx):
    name, url, liked, take = item
    c.setStrokeColor(LIGHT); c.setLineWidth(1); c.rect(x, y, w, h, fill=0, stroke=1)
    txt(c, x + 18, y + h - 28, f'0{idx}', 8, 'ManropeSemi', MID)
    txt(c, x + 18, y + h - 58, name, 18, 'ManropeBold')
    link_text(c, x + 18, y + h - 81, url.replace('https://', '').rstrip('/'), url)
    txt(c, x + 18, y + h - 119, 'ЧТО ПОНРАВИЛОСЬ', 7.5, 'ManropeBold', MID)
    wrapped(c, x + 18, y + h - 139, liked, 48, 10, 14)
    txt(c, x + 18, y + 72, 'ЧТО БЕРЁМ', 7.5, 'ManropeBold', MID)
    wrapped(c, x + 18, y + 52, take, 48, 10, 14, 'ManropeSemi')

def desktop_frame(c, x, y, w, h):
    c.setStrokeColor(BLACK); c.setLineWidth(1.3); c.rect(x, y, w, h, fill=0, stroke=1)
    c.setFillColor(PALE); c.rect(x, y + h - 22, w, 22, fill=1, stroke=0)
    txt(c, x + 10, y + h - 15, 'ЛОГО', 6.5, 'ManropeBold')
    txt(c, x + w - 148, y + h - 15, 'УСЛУГИ   РАБОТЫ   ЗАЯВКА', 5.5, 'ManropeSemi')

def arrow(c, x1, y1, x2, y2):
    c.setStrokeColor(BLACK); c.setLineWidth(1); c.line(x1, y1, x2, y2)
    c.line(x2, y2, x2 - 5, y2 + 3); c.line(x2, y2, x2 - 5, y2 - 3)

def logo_sketch(c, x, y, scale=1.0):
    txt(c, x, y, 'ЗАЦЕП', 48 * scale, 'LogoHeavy')
    # Продолжение начинается у правого нижнего штриха «Ц»,
    # поэтому зацеп остаётся частью буквы при любом масштабе.
    attach_x = x + pdfmetrics.stringWidth('ЗАЦ', 'LogoHeavy', 48 * scale) - 8 * scale
    c.setStrokeColor(BLACK); c.setLineWidth(6 * scale); c.setLineCap(0)
    c.line(attach_x, y - 8 * scale, attach_x, y - 28 * scale)
    c.line(attach_x, y - 28 * scale, attach_x + 23 * scale, y - 28 * scale)
    c.line(attach_x + 23 * scale, y - 28 * scale, attach_x + 23 * scale, y - 18 * scale)

def compact_mark(c, x, y, s=90):
    c.setStrokeColor(BLACK); c.setLineWidth(3); c.rect(x, y, s, s, fill=0, stroke=1)
    txt(c, x + 16, y + 25, 'Ц', 52, 'LogoHeavy')
    c.setLineWidth(5); c.line(x + 58, y + 20, x + 58, y + 8); c.line(x + 58, y + 8, x + 77, y + 8); c.line(x + 77, y + 8, x + 77, y + 16)

def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
    c.setTitle('Концепция сайта маркетингового агентства ЗАЦЕП')
    c.setAuthor('Рабочая концепция')
    c.setSubject('Референсы, чёрно-белый wireframe, название и эскиз логотипа')

    # 1
    background(c); overline(c, 'Рабочая презентация', 1)
    heading(c, 'КОНЦЕПЦИЯ САЙТА\nМАРКЕТИНГОВОГО АГЕНТСТВА', 44, 390, 38)
    wrapped(c, 44, 230, 'Референсы, структура сайта, название и первый набросок логотипа.', 60, 15, 22, 'ManropeSemi')
    txt(c, 44, 78, 'Версия для обсуждения', 9, 'Manrope', MID); footer(c); c.showPage()

    # 2
    background(c); overline(c, 'Задача', 2); heading(c, 'ЧТО ДОЛЖЕН СДЕЛАТЬ САЙТ', 44, 450, 31)
    goals = [('01', 'Быстро объяснить', 'Кто мы, какие задачи решаем и для кого работаем.'), ('02', 'Показать уровень', 'Дать понятную структуру услуг и работ без лишних обещаний.'), ('03', 'Снять сомнения', 'Объяснить процесс и ответить на частые вопросы.'), ('04', 'Привести к заявке', 'Повторить понятный CTA и оставить короткую форму.')]
    for i,(n,h,t) in enumerate(goals):
        x=44+(i%2)*438; y=286-(i//2)*142
        rect(c,x,y,408,110); txt(c,x+16,y+82,n,8,'ManropeSemi',MID); txt(c,x+55,y+80,h,15,'ManropeBold'); wrapped(c,x+55,y+52,t,48,10,14)
    footer(c); c.showPage()

    # 3-6
    for slide in range(4):
        background(c); overline(c, 'Сайты-референсы', slide+3)
        heading(c, f'ПРИМЕРЫ {slide*2+1}-{slide*2+2}', 44, 454, 29)
        reference_card(c,44,78,420,330,refs[slide*2],slide*2+1)
        reference_card(c,496,78,420,330,refs[slide*2+1],slide*2+2)
        footer(c); c.showPage()

    # 7
    background(c); overline(c, 'Общий вывод', 7); heading(c, 'ЧТО СОБИРАЕМ ИЗ РЕФЕРЕНСОВ', 44, 454, 30)
    decisions=[('01','Ясный оффер','Понятен за несколько секунд.'),('02','Услуги','Пять направлений без перегрузки.'),('03','Работы','Главное доказательство уровня.'),('04','Процесс','Показывает следующие шаги.'),('05','Доверие','География и реальные клиенты.'),('06','Наша команда','Люди и роли за проектом.'),('07','CTA','Повторяется после ключевых блоков.'),('08','FAQ','Закрывает базовые возражения.'),('09','Короткая форма','Просит только нужный контекст.')]
    for i,(n,h,t) in enumerate(decisions):
        col=i%3; row=i//3; x=44+col*292; y=350-row*103
        txt(c,x,y,n,8,'ManropeSemi',MID); txt(c,x+35,y,h,11,'ManropeBold'); wrapped(c,x+35,y-23,t,30,8.5,12,'Manrope',MID); c.setStrokeColor(LIGHT); c.line(x,y-50,x+270,y-50)
    footer(c); c.showPage()

    # 8
    background(c); overline(c, 'Чёрно-белый wireframe', 8); heading(c, 'ПЕРВЫЙ ЭКРАН И ДОВЕРИЕ', 44, 454, 30)
    desktop_frame(c,270,82,646,330)
    rect(c,286,211,335,178,'ОФФЕР + КРАТКОЕ ОБЪЯСНЕНИЕ'); rect(c,637,211,263,178,'ВИЗУАЛ / КЕЙС')
    rect(c,300,232,126,34,'ОСТАВИТЬ ЗАЯВКУ',PALE); rect(c,286,166,614,31,'НИЖНИЙ НОВГОРОД / РОССИЯ + ЛОГОТИПЫ КЛИЕНТОВ',PALE)
    wrapped(c,44,335,'Первый экран отвечает на три вопроса: что делаем, для кого и какой следующий шаг.',25,11,16,'ManropeSemi')
    arrow(c,204,260,267,260); footer(c); c.showPage()

    # 9
    background(c); overline(c, 'Чёрно-белый wireframe', 9); heading(c, 'ПРОБЛЕМЫ И УСЛУГИ', 44, 454, 30)
    desktop_frame(c,270,82,646,330)
    rect(c,286,294,614,95,'ПРОБЛЕМЫ КЛИЕНТА: КОНТЕНТ / REELS / ДИЗАЙН / РЕКЛАМА')
    for i,name in enumerate(['SMM','REELS','КОНТЕНТ-ПЛАНЫ','ТАРГЕТ','ДИЗАЙН']): rect(c,286,253-i*34,245,27,name,PALE if i==0 else WHITE)
    rect(c,548,117,352,163,'АКТИВНОЕ НАПРАВЛЕНИЕ: ОПИСАНИЕ + СОСТАВ РАБОТ')
    wrapped(c,44,335,'Услуги работают как единый список. Выбор пункта показывает описание и ожидаемый состав работ.',25,11,16,'ManropeSemi')
    arrow(c,206,255,267,255); footer(c); c.showPage()

    # 10
    background(c); overline(c, 'Чёрно-белый wireframe', 10); heading(c, 'РАБОТЫ, ПРОЦЕСС И ФОРМАТЫ', 44, 454, 29)
    desktop_frame(c,270,82,646,330)
    rect(c,286,265,360,124,'ИЗБРАННЫЕ РАБОТЫ'); rect(c,662,265,238,124,'КЕЙС')
    for i,name in enumerate(['ДИАГНОСТИКА','СТРАТЕГИЯ','ПРОИЗВОДСТВО','ЗАПУСК']): rect(c,286+i*153,198,142,45,name,PALE)
    for i,name in enumerate(['ВЕДЕНИЕ','ПРОДАКШЕН','ТАРГЕТ','ДИЗАЙН']): rect(c,286+i*153,128,142,45,name)
    wrapped(c,44,335,'Работы показывают уровень. Процесс снижает риск. Форматы помогают выбрать подходящий способ сотрудничества.',25,11,16,'ManropeSemi')
    arrow(c,206,250,267,250); footer(c); c.showPage()

    # 11
    background(c); overline(c, 'Чёрно-белый wireframe', 11); heading(c, 'КОМАНДА, FAQ, ЗАЯВКА И MOBILE', 44, 454, 27)
    rect(c,44,306,476,92,'НАША КОМАНДА');
    for i in range(4):
        rect(c,60+i*110,324,96,48,'ФОТО',PALE,LIGHT,.8,6); txt(c,66+i*110,312,'ИМЯ / РОЛЬ',6.5,'ManropeSemi',MID)
    rect(c,44,194,476,92,'FAQ');
    for i,q in enumerate(['Можно начать с одной услуги?','Как строится работа?','Вы работаете по всей России?']):
        c.setStrokeColor(LIGHT); c.line(60,260-i*21,504,260-i*21); txt(c,66,249-i*21,q,7.5,'ManropeSemi'); txt(c,486,249-i*21,'+',8,'ManropeBold')
    rect(c,44,82,476,92,'КОРОТКАЯ ФОРМА')
    for i,f in enumerate(['Имя','Ниша','Контакт','Задача']): c.setStrokeColor(LIGHT); c.line(60,150-i*16,344,150-i*16); txt(c,60,153-i*16,f,6.5,'Manrope',MID)
    rect(c,364,100,140,28,'ОТПРАВИТЬ',PALE)
    rect(c,628,82,208,316,'MOBILE 390 PX'); rect(c,642,346,180,30,'ШАПКА',PALE); rect(c,642,260,180,76,'ОФФЕР + CTA'); rect(c,642,196,180,54,'УСЛУГИ'); rect(c,642,132,180,54,'РАБОТЫ'); rect(c,642,96,180,26,'ФОРМА',PALE)
    footer(c); c.showPage()

    # 12
    background(c); overline(c, 'Название', 12); heading(c, 'ПОЧЕМУ «ЗАЦЕП»', 44, 454, 34)
    senses=[('01','Захват внимания','Маркетинг сначала должен остановить взгляд и вызвать интерес.'),('02','Запоминающийся креатив','Хороший контент оставляет узнаваемый образ и повод вернуться.'),('03','Связь с действием','Задача не только понравиться, но и привести человека к следующему шагу.')]
    for i,(n,h,t) in enumerate(senses):
        x=44+i*292; rect(c,x,142,270,245); txt(c,x+16,354,n,8,'ManropeSemi',MID); txt(c,x+16,307,h,15,'ManropeBold'); wrapped(c,x+16,270,t,34,11,16)
    txt(c,44,88,'Название короткое, русскоязычное и связано с реальной задачей агентства.',12,'ManropeSemi')
    footer(c); c.showPage()

    # 13
    background(c); overline(c, 'Маркетинговое раскрытие', 13); heading(c, 'КАК НАЗВАНИЕ РАБОТАЕТ В КОММУНИКАЦИИ', 44, 454, 28)
    txt(c,44,385,'ОБЕЩАНИЕ',8,'ManropeBold',MID); wrapped(c,44,360,'Контент, который цепляет. Продвижение, которое работает на заявки.',47,15,21,'ManropeBold')
    txt(c,516,385,'ХАРАКТЕР',8,'ManropeBold',MID); wrapped(c,516,360,'Смелый, понятный, живой и без недоказанных обещаний.',42,15,21,'ManropeBold')
    c.setStrokeColor(LIGHT); c.line(44,280,916,280)
    txt(c,44,248,'ВОЗМОЖНЫЕ ФОРМУЛИРОВКИ',8,'ManropeBold',MID)
    slogans=['Контент, который цепляет.','Находим, чем зацепить.','Зацепить внимание. Довести до заявки.','Один сильный зацеп вместо лишнего шума.']
    for i,s in enumerate(slogans):
        txt(c,44,205-i*37,f'0{i+1}',8,'ManropeSemi',MID); txt(c,84,205-i*37,s,13,'ManropeSemi')
    footer(c); c.showPage()

    # 14
    background(c); overline(c, 'Набросок логотипа', 14); heading(c, 'ПРОСТОЙ ЗНАК ДЛЯ ОБСУЖДЕНИЯ', 44, 454, 30)
    wrapped(c,44,385,'Тяжёлое текстовое написание. Нижний штрих буквы «Ц» продолжается и образует графический зацеп.',43,11,16,'ManropeSemi')
    rect(c,44,126,560,178,'ОСНОВНОЙ WORDMARK',WHITE,LIGHT,1)
    logo_sketch(c,86,192,.96)
    rect(c,636,126,280,178,'КОМПАКТНЫЙ ЗНАК',WHITE,LIGHT,1)
    compact_mark(c,730,165,90)
    txt(c,44,82,'Это презентационный набросок, а не финальный товарный знак.',9,'Manrope',MID)
    footer(c); c.showPage()

    c.save(); print(OUT)

if __name__ == '__main__': build()
