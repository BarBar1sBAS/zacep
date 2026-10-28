from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/03_zacep-wireframe.pdf'
SHOTS = ROOT / 'tmp/pdfs/zacep-prototype'
FONTS = ROOT / 'tmp/pdfs/fonts'
W, H = 960, 540
INK, PAPER, LIME, GREY = HexColor('#0A0A0A'), HexColor('#F3F0E8'), HexColor('#C8FF00'), HexColor('#77776F')

pdfmetrics.registerFont(TTFont('Unbounded', str(FONTS/'Unbounded-800.ttf')))
pdfmetrics.registerFont(TTFont('UnboundedBlack', str(FONTS/'Unbounded-900.ttf')))
pdfmetrics.registerFont(TTFont('Manrope', str(FONTS/'Manrope-400.ttf')))
pdfmetrics.registerFont(TTFont('ManropeBold', str(FONTS/'Manrope-700.ttf')))

def bg(c, color=PAPER): c.setFillColor(color); c.rect(0, 0, W, H, fill=1, stroke=0)
def text(c, x, y, value, size=12, font='Manrope', color=INK):
    c.setFillColor(color); c.setFont(font, size); c.drawString(x, y, value)
def title(c, value, x=36, y=454, size=38, color=INK):
    c.setFillColor(color); c.setFont('UnboundedBlack', size)
    for i, line in enumerate(value.split('\n')): c.drawString(x, y-i*(size*.98), line)
def label(c, value, x=36, y=505, color=INK): text(c,x,y,'↳ '+value.upper(),8,'ManropeBold',color)
def footer(c, page, dark=False):
    color = PAPER if dark else INK
    text(c,36,18,'ЗАЦЕП · WIREFRAME V2',6,'ManropeBold',color); text(c,900,18,f'{page:02}',6,'ManropeBold',color)
def fit_image(c, path, x, y, w, h, contain=False):
    im = Image.open(path); iw, ih = im.size
    scale = min(w/iw, h/ih) if contain else max(w/iw, h/ih)
    dw, dh = iw*scale, ih*scale; dx, dy = x+(w-dw)/2, y+(h-dh)/2
    c.saveState(); p=c.beginPath(); p.rect(x,y,w,h); c.clipPath(p,stroke=0,fill=0)
    c.drawImage(ImageReader(im),dx,dy,dw,dh,mask='auto'); c.restoreState()
def rule(c,x,y,w,color=INK,width=1): c.setStrokeColor(color); c.setLineWidth(width); c.line(x,y,x+w,y)
def box(c,x,y,w,h,fill=None,stroke=INK,lw=1):
    if fill: c.setFillColor(fill)
    c.setStrokeColor(stroke); c.setLineWidth(lw); c.rect(x,y,w,h,fill=1 if fill else 0,stroke=1)
def wrap(c, value, x, y, max_chars=48, size=11, leading=15, font='Manrope', color=INK):
    words=value.split(); lines=[]; line=[]
    for word in words:
        if len(' '.join(line+[word]))>max_chars: lines.append(' '.join(line)); line=[word]
        else: line.append(word)
    if line: lines.append(' '.join(line))
    for i,line in enumerate(lines): text(c,x,y-i*leading,line,size,font,color)

def build():
    OUT.parent.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1)
    c.setTitle('ЗАЦЕП — адаптивный дизайн-концепт и motion wireframe')
    c.setAuthor('ЗАЦЕП'); c.setSubject('Главная, шаблон кейса, mobile и анимационная система')
    p=1

    bg(c,LIME); fit_image(c,ROOT/'prototype/public/assets/hero-collage.png',535,0,425,540)
    label(c,'Адаптивный дизайн-концепт',36,505); title(c,'САЙТ, КОТОРЫЙ\nЦЕПЛЯЕТ И ВЕДЁТ\nК ЗАЯВКЕ.',36,385,39)
    wrap(c,'Интерактивный прототип · desktop 1440 · mobile 390 · шаблон кейса · motion-система',36,135,55,11,16,'ManropeBold')
    footer(c,p); c.showPage(); p+=1

    bg(c); label(c,'Design read'); title(c,'ДЕРЗКИЙ.\nНО ДЕЛОВОЙ.',36,440,48)
    wrap(c,'Контролируемый необрутализм: крупная кириллица, асимметрия, грубая рамка и один кислотный акцент. Характер не мешает считывать оффер и находить заявку.',36,265,48,13,19)
    for i,(n,v,d) in enumerate([('09','Вариативность','Редакционная композиция вместо сетки карточек'),('07','Движение','Анимация объясняет и направляет'),('03','Плотность','Воздух между сильными сценами')]):
        x=535+i*130; box(c,x,115,112,290,LIME if i==0 else PAPER,INK,2); text(c,x+12,360,n,33,'UnboundedBlack'); text(c,x+12,330,v.upper(),7,'ManropeBold'); wrap(c,d,x+12,290,15,9,13)
    footer(c,p); c.showPage(); p+=1

    bg(c,INK); label(c,'Конверсионный маршрут',36,505,PAPER); title(c,'УВИДЕЛ → ПОНЯЛ →\nПОВЕРИЛ → ДЕЙСТВИЕ',36,430,37,PAPER)
    route=[('01','Оффер','Контент + продвижение'),('02','Проблема','Узнаёт свою ситуацию'),('03','Услуги','Видит связанную систему'),('04','Работы','Понимает уровень'),('05','Процесс','Снимает риск'),('06','Заявка','Оставляет контекст')]
    for i,(n,h,d) in enumerate(route):
        x=36+i*150; box(c,x,120,132,190,LIME if i==5 else None,LIME if i==5 else PAPER,1.5); col=INK if i==5 else PAPER
        text(c,x+10,280,n,9,'ManropeBold',col); wrap(c,h,x+10,235,15,13,16,'Unbounded',col); wrap(c,d,x+10,175,18,8,12,'Manrope',col)
    footer(c,p,True); c.showPage(); p+=1

    bg(c); label(c,'Desktop · первый экран'); title(c,'ОФФЕР СЧИТЫВАЕТСЯ\nЗА НЕСКОЛЬКО СЕКУНД',36,472,27)
    fit_image(c,SHOTS/'home-desktop-hero.png',36,48,888,358,contain=True); box(c,36,48,888,358,None,INK,1)
    footer(c,p); c.showPage(); p+=1

    bg(c,INK); label(c,'Услуги · интерактивный индекс',36,505,PAPER); title(c,'НЕ ПЯТЬ КАРТОЧЕК.\nОДНА ЖИВАЯ СЦЕНА.',36,460,34,PAPER)
    fit_image(c,SHOTS/'desktop-services.png',425,55,499,400,contain=True)
    wrap(c,'Выбор направления меняет изображение, формулировку и состав работ. На desktop блок остаётся рядом со sticky-индексом; на mobile складывается в последовательность.',36,290,45,12,18,'Manrope',PAPER)
    footer(c,p,True); c.showPage(); p+=1

    bg(c); label(c,'Работы · редакционная сетка'); title(c,'РАЗНЫЙ МАСШТАБ =\nВИЗУАЛЬНЫЙ РИТМ',36,465,35)
    fit_image(c,SHOTS/'desktop-work.png',390,52,534,420,contain=True)
    wrap(c,'Карточки не притворяются реальными кейсами: каждая подписана как демонстрационное направление. Сетка готова принять реальные работы без переделки структуры.',36,285,43,12,18)
    footer(c,p); c.showPage(); p+=1

    bg(c,INK); label(c,'Процесс · снятие риска',36,505,PAPER); title(c,'ЛИНИЯ ПОКАЗЫВАЕТ,\nКАК ДВИЖЕТСЯ ПРОЕКТ',36,460,32,PAPER)
    fit_image(c,SHOTS/'desktop-process.png',36,73,888,290,contain=True); box(c,36,73,888,290,None,PAPER,1)
    wrap(c,'Прогресс проявляется по мере прокрутки. Страница не перехватывает скролл: движение только поддерживает последовательность диагностика → стратегия → производство → улучшение.',36,48,90,9,13,'Manrope',PAPER)
    footer(c,p,True); c.showPage(); p+=1

    bg(c); label(c,'Mobile · 390 px'); title(c,'ТОТ ЖЕ ХАРАКТЕР.\nКОРОЧЕ ШАГ.',36,475,31)
    fit_image(c,SHOTS/'home-mobile-hero.png',420,60,210,400,contain=True); fit_image(c,SHOTS/'mobile-services.png',650,60,274,400,contain=True)
    points=['Оффер не мельчает','CTA во всю ширину','Услуги — вертикально','Медиа сохраняет роль','Без горизонтального скролла']
    for i,item in enumerate(points): box(c,36,280-i*43,285,31,LIME if i==0 else None,INK,1); text(c,47,290-i*43,item,9,'ManropeBold')
    footer(c,p); c.showPage(); p+=1

    bg(c,LIME); label(c,'Финальная заявка',36,505); title(c,'ФОРМА ПРОСИТ\nТОЛЬКО НУЖНОЕ',36,445,38)
    fit_image(c,SHOTS/'desktop-brief.png',450,68,474,390,contain=True)
    wrap(c,'Имя, ниша, контакт и задача. Ошибки показываются рядом с полем. После отправки — честное демо-состояние: данные не уходят на сервер.',36,275,42,12,18,'ManropeBold')
    footer(c,p); c.showPage(); p+=1

    bg(c,INK); label(c,'Шаблон кейса',36,505,PAPER); title(c,'ИДЕЯ → РАБОТА →\nКАЧЕСТВЕННЫЙ РЕЗУЛЬТАТ',36,463,31,PAPER)
    fit_image(c,SHOTS/'case-desktop-hero.png',36,185,430,250,contain=True); fit_image(c,SHOTS/'case-desktop-gallery.png',490,70,434,365,contain=True)
    wrap(c,'Отдельный маршрут /case-template. Цифры и отзыв появляются только после подтверждения клиентом.',36,125,52,11,16,'Manrope',PAPER)
    footer(c,p,True); c.showPage(); p+=1

    bg(c); label(c,'Motion system'); title(c,'ДВИЖЕНИЕ ИМЕЕТ\nРАБОТУ',36,468,35)
    motions=[('01','HERO','Собрать иерархию','translate + opacity','650 мс'),('02','УСЛУГИ','Показать выбор','crossfade','280 мс'),('03','ПРОЦЕСС','Объяснить прогресс','scaleX','по скроллу'),('04','CTA','Дать отклик','translate','200 мс')]
    for i,(n,h,purpose,prop,time) in enumerate(motions):
        x=36+i*222; box(c,x,145,198,240,LIME if i==0 else None,INK,2); text(c,x+14,350,n,10,'ManropeBold'); text(c,x+14,300,h,17,'UnboundedBlack'); wrap(c,purpose,x+14,255,24,10,14); rule(c,x+14,220,170); text(c,x+14,195,prop.upper(),8,'ManropeBold'); text(c,x+14,170,time,9,'Manrope')
    wrap(c,'prefers-reduced-motion отключает последовательные появления, маски, hover-сдвиги и движение строки.',36,90,95,10,15,'ManropeBold')
    footer(c,p); c.showPage(); p+=1

    bg(c,LIME); label(c,'Готовность к реальному контенту'); title(c,'ЗАМЕНЯЕМ МАТЕРИАЛЫ.\nНЕ ЛОМАЕМ СИСТЕМУ.',36,465,34)
    checks=['4–6 подтверждённых работ','Логотипы только с разрешением','Метрики со способом расчёта','Отзыв с именем и ролью','Политика обработки данных','Рабочая отправка формы']
    for i,item in enumerate(checks):
        x=36+(i%3)*292; y=285-(i//3)*98; box(c,x,y,270,70,PAPER,INK,1.5); text(c,x+13,y+45,f'0{i+1}',8,'ManropeBold'); wrap(c,item,x+48,y+43,28,10,14,'ManropeBold')
    wrap(c,'До подстановки реального портфолио все концепты остаются явно помеченными как демонстрационные.',36,84,85,11,16,'ManropeBold')
    footer(c,p); c.showPage()
    c.save(); print(OUT)

if __name__=='__main__': build()
