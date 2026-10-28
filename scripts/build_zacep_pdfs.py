from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.utils import ImageReader
from PIL import Image
import math

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output' / 'pdf'
SHOTS = ROOT / 'tmp' / 'pdfs' / 'reference-shots'
FONTS = ROOT / 'tmp' / 'pdfs' / 'fonts'
OUT.mkdir(parents=True, exist_ok=True)

W, H = 960, 540
LIME = HexColor('#DCFE38')
INK = HexColor('#1E1E1E')
PAPER = HexColor('#F3F0E8')
WHITE = HexColor('#FFFFFF')
GRAY = HexColor('#A6A6A6')
MID = HexColor('#D8D5CC')
RED = HexColor('#FF4D35')

pdfmetrics.registerFont(TTFont('U900', str(FONTS / 'Unbounded-900.ttf')))
pdfmetrics.registerFont(TTFont('U800', str(FONTS / 'Unbounded-800.ttf')))
pdfmetrics.registerFont(TTFont('M400', str(FONTS / 'Manrope-400.ttf')))
pdfmetrics.registerFont(TTFont('M600', str(FONTS / 'Manrope-600.ttf')))
pdfmetrics.registerFont(TTFont('M700', str(FONTS / 'Manrope-700.ttf')))

def rect(c, x, y, w, h, fill, stroke=None, sw=1, radius=0):
    c.setLineWidth(sw)
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
    else:
        c.setStrokeColor(fill)
    if radius:
        c.roundRect(x, y, w, h, radius, fill=1, stroke=1 if stroke else 0)
    else:
        c.rect(x, y, w, h, fill=1, stroke=1 if stroke else 0)

def line(c, x1, y1, x2, y2, color=INK, sw=1):
    c.setStrokeColor(color); c.setLineWidth(sw); c.line(x1, y1, x2, y2)

def txt(c, s, x, y, size=12, font='M400', color=INK, anchor='start'):
    c.setFont(font, size); c.setFillColor(color)
    if anchor == 'center': c.drawCentredString(x, y, s)
    elif anchor == 'end': c.drawRightString(x, y, s)
    else: c.drawString(x, y, s)

def wrap_lines(text, font, size, width):
    out=[]
    for para in text.split('\n'):
        if not para:
            out.append(''); continue
        words=para.split(); cur=''
        for word in words:
            trial=(cur+' '+word).strip()
            if pdfmetrics.stringWidth(trial,font,size) <= width or not cur:
                cur=trial
            else:
                out.append(cur); cur=word
        if cur: out.append(cur)
    return out

def para(c, text, x, y, width, size=12, leading=None, font='M400', color=INK, max_lines=None):
    leading = leading or size*1.35
    lines = wrap_lines(text,font,size,width)
    if max_lines: lines=lines[:max_lines]
    c.setFont(font,size); c.setFillColor(color)
    for i,s in enumerate(lines): c.drawString(x,y-i*leading,s)
    return y-len(lines)*leading

def image_cover(c, path, x, y, w, h, tint=None):
    path=Path(path)
    if not path.exists():
        rect(c,x,y,w,h,MID,INK,1)
        txt(c,'СКРИНШОТ НЕДОСТУПЕН',x+w/2,y+h/2,12,'M700',INK,'center')
        return
    with Image.open(path) as im: iw,ih=im.size
    scale=max(w/iw,h/ih); dw,dh=iw*scale,ih*scale
    c.saveState(); p=c.beginPath(); p.rect(x,y,w,h); c.clipPath(p,stroke=0,fill=0)
    c.drawImage(ImageReader(str(path)),x+(w-dw)/2,y+(h-dh)/2,dw,dh,mask='auto')
    if tint:
        c.setFillColor(tint); c.setFillAlpha(0.18); c.rect(x,y,w,h,fill=1,stroke=0); c.setFillAlpha(1)
    c.restoreState()

def page_base(c, page_no, section, dark=False):
    rect(c,0,0,W,H,INK if dark else PAPER)
    color=PAPER if dark else INK
    txt(c,'ЗАЦЕП',36,H-32,10,'U900',color)
    txt(c,section.upper(),W/2,H-31,8,'M700',color,'center')
    txt(c,f'{page_no:02d}',W-36,H-32,9,'M700',color,'end')
    line(c,36,H-44,W-36,H-44,color,0.7)

def title(c, kicker, heading, sub=None, dark=False, y=452):
    color=PAPER if dark else INK
    txt(c,kicker.upper(),48,y,10,'M700',LIME if dark else INK)
    y2=para(c,heading,48,y-34,850,34,38,'U900',color)
    if sub: para(c,sub,48,y2-10,800,14,19,'M400',color)

def pill(c, text, x, y, dark=False, w=None):
    w=w or pdfmetrics.stringWidth(text,'M700',9)+22
    rect(c,x,y,w,24,LIME,INK if not dark else LIME,1,12)
    txt(c,text,x+w/2,y+7,9,'M700',INK,'center')
    return w

def arrow(c,x,y,length=70,color=INK):
    line(c,x,y,x+length,y,color,3)
    line(c,x+length,y,x+length-12,y+8,color,3)
    line(c,x+length,y,x+length-12,y-8,color,3)

def draw_hook(c,x,y,s,color=INK,bg=None):
    c.saveState(); c.setStrokeColor(color); c.setLineWidth(max(5,s*.12)); c.setLineCap(0); c.setLineJoin(0)
    p=c.beginPath(); p.moveTo(x+s*.78,y+s*.86); p.lineTo(x+s*.25,y+s*.86); p.lineTo(x+s*.25,y+s*.28); p.lineTo(x+s*.72,y+s*.28); p.lineTo(x+s*.72,y+s*.08); p.curveTo(x+s*.72,y-s*.08,x+s*.92,y-s*.08,x+s*.92,y+s*.12)
    c.drawPath(p,stroke=1,fill=0); c.restoreState()

def logo(c,x,y,scale=1,color=INK,sign_color=None):
    size=34*scale; txt(c,'ЗАЦЕП',x,y,size,'U900',color)
    # the hooked underline makes the wordmark proprietary and echoes the descender of Ц
    start=x+pdfmetrics.stringWidth('ЗА','U900',size)+5*scale
    c.setStrokeColor(sign_color or color); c.setLineWidth(4*scale)
    p=c.beginPath(); p.moveTo(start,y-7*scale); p.lineTo(start+36*scale,y-7*scale); p.curveTo(start+48*scale,y-7*scale,start+48*scale,y-20*scale,start+38*scale,y-22*scale)
    c.drawPath(p,stroke=1,fill=0)

def cover(c, doc_label, title_text, subtitle, code):
    rect(c,0,0,W,H,LIME)
    txt(c,doc_label.upper(),44,H-48,10,'M700',INK)
    txt(c,code,W-44,H-48,10,'M700',INK,'end')
    line(c,44,H-62,W-44,H-62,INK,1)
    draw_hook(c,W-205,H-255,150,INK)
    para(c,title_text,44,335,700,46,52,'U900',INK)
    para(c,subtitle,48,180,620,16,22,'M600',INK)
    txt(c,'Нижний Новгород / Россия / 2026',48,46,10,'M700',INK)
    c.showPage()

def end_page(c, label, page_no):
    rect(c,0,0,W,H,LIME)
    logo(c,48,335,1.45,INK)
    para(c,label,48,250,700,26,34,'U900',INK)
    arrow(c,48,122,130,INK)
    txt(c,'Система готова к наполнению реальными работами.',48,74,12,'M600',INK)
    txt(c,f'{page_no:02d}',W-48,46,10,'M700',INK,'end')
    c.showPage()

def create_reference_pdf():
    path=OUT/'01_reference-sites.pdf'; c=canvas.Canvas(str(path),pagesize=(W,H),pageCompression=1)
    c.setTitle('ЗАЦЕП - сайты-референсы'); c.setAuthor('ЗАЦЕП'); c.setSubject('Анализ визуальных и конверсионных решений сайтов агентств')
    cover(c,'Исследование / digital', 'САЙТЫ, КОТОРЫЕ ЦЕПЛЯЮТ', '8 референсов для агентства «ЗАЦЕП»: визуальная система, доверие, кейсы и путь к заявке.', '01 / 03')
    page_base(c,2,'Метод',False)
    title(c,'Как читать документ','НЕ КОПИРУЕМ. СОБИРАЕМ СИСТЕМУ.','Каждый сайт оценён по четырём практическим критериям: заметность, ясность оффера, доказательства и конверсия.')
    labels=[('01','ВИЗУАЛ','Типографика, цвет, сетка, ритм.'),('02','ОФФЕР','Понятно ли, чем и кому помогает агентство.'),('03','ДОВЕРИЕ','Работы, клиенты, процесс, отзывы.'),('04','CTA','Как посетителя ведут к контакту.')]
    for i,(n,h,b) in enumerate(labels):
        x=48+i*220; rect(c,x,90,192,155,WHITE,INK,2); txt(c,n,x+14,216,10,'M700',INK); txt(c,h,x+14,176,16,'U800',INK); para(c,b,x+14,142,162,11,15,'M400',INK)
    txt(c,'Дата проверки: 01.10.2026',48,54,9,'M700',INK); c.showPage()

    refs=[
      dict(name='SETTERS',slug='setters',url='https://www.setters.agency/we-are',tag='РОССИЯ / КРЕАТИВ + SMM',note='Прямой сайт не открылся из среды проверки; использован архивный снимок от 09.02.2025.',like='Человеческий манифест вместо безличного «мы оказываем услуги».',take='Категории услуг, принципы работы и доверие через список клиентов.',where='Блоки «Подход», «Услуги» и полоса доверия.',avoid='Не перегружать наградами: у нового бренда их пока нет.'),
      dict(name='REDKEDS',slug='redkeds',url='https://redkeds.com/',tag='РОССИЯ / WORK-FIRST',note='Снят напрямую 01.10.2026.',like='Работы занимают сцену; агентство доказывает вкус портфолио.',take='Крупные кейс-карточки, свободный ритм и сильные названия.',where='Избранные работы и шаблон кейса.',avoid='Не прятать оффер за экспериментальным интерфейсом.'),
      dict(name='SHIFT MOTION',slug='shift-motion',url='https://shiftmotion.ru/',tag='РОССИЯ / SMB + SMM',note='Снят напрямую 01.10.2026.',like='Близкая аудитория: бизнес, понятные услуги, живые отзывы.',take='Фильтрация работ по нишам и язык реальных задач.',where='Портфолио, причины доверять и FAQ.',avoid='Не делать длинную стену текста и одинаковые CTA.'),
      dict(name='HEADLINE',slug='headline',url='https://www.headlineideas.com/',tag='SOCIAL-FIRST / POSITIONING',note='Снят напрямую 01.10.2026.',like='С первой фразы понятно: агентство живёт социальными медиа.',take='Одна специализация, короткие формулировки, культурный тон.',where='Первый экран и блок услуг.',avoid='Не превращать выразительный hero в чистое шоу без заявки.'),
      dict(name='OUR OWN BRAND',slug='our-own-brand',url='https://ourownbrand.co/',tag='SOCIAL-FIRST / CASES',note='Снят напрямую 01.10.2026.',like='Яркий характер связан с кейсами и измеримыми результатами.',take='Связка «задача - работа - результат» и активные CTA.',where='Карточки работ и шаблон кейса.',avoid='Не использовать цифры до появления подтверждённой аналитики.'),
      dict(name='DOG HOUSE RIOT → BRUTALIST STUDIO',slug='brutalist-studio',url='https://themainwebsite.com/projects/project-04',tag='НЕОБРУТАЛИЗМ / ЗАМЕНА',note='Домен Dog House Riot не резолвится 01.10.2026. Для визуального анализа взят живой Brutalist Studio.',like='Высокий контраст, грубая структура и типографика с контролем.',take='Толстые рамки, номерные метки, чёрный фон и сигнальный цвет.',where='Вся графическая система «ЗАЦЕП».',avoid='Не жертвовать читаемостью и скоростью ради эффекта.'),
      dict(name='OBYS',slug='obys',url='https://obys.agency/',tag='PORTFOLIO / EDITORIAL',note='Снят напрямую 01.10.2026; сайт интерактивный, статичный кадр намеренно минимален.',like='Крайняя уверенность: минимум объяснений, максимум авторства.',take='Крупные номера, воздух и ритм проектной ленты.',where='Навигация по кейсам и презентация работ.',avoid='Не оставлять пользователя без понятного оффера и CTA.'),
      dict(name='BOLD CREATIVE',slug='bold-creative',url='https://weareboldcreative.com/',tag='SMB / CONVERSION',note='Снят напрямую 01.10.2026.',like='Сильный hero сразу соединяет характер и коммерческий смысл.',take='Последовательность: обещание → услуги → процесс → работы → форма.',where='Каркас главной страницы.',avoid='Не перегружать обещаниями и неподтверждёнными числами.'),
    ]
    pno=3
    for r in refs:
        page_base(c,pno,'Референсы',False)
        txt(c,r['tag'],48,456,9,'M700',INK)
        para(c,r['name'],48,420,860,23,27,'U900',INK,max_lines=2)
        image_cover(c,SHOTS/f"{r['slug']}-hero.png",48,194,450,190)
        image_cover(c,SHOTS/f"{r['slug']}-detail.png",508,194,404,190)
        cols=[('ПОНРАВИЛОСЬ',r['like']),('БЕРЁМ',r['take']),('ГДЕ ПРИМЕНИМ',r['where']),('НЕ КОПИРУЕМ',r['avoid'])]
        for i,(h,b) in enumerate(cols):
            x=48+i*216; txt(c,h,x,160,9,'M700',INK); para(c,b,x,139,190,10,13,'M400',INK,max_lines=4)
        para(c,r['note'],48,62,650,8.5,11,'M400',HexColor('#555555'),max_lines=2)
        c.linkURL(r['url'],(742,48,912,78),relative=0)
        rect(c,742,48,170,30,LIME,INK,1,15); txt(c,'ОТКРЫТЬ САЙТ',827,58,9,'M700',INK,'center')
        c.showPage(); pno+=1

    page_base(c,pno,'Матрица',True)
    title(c,'Сводное решение','КАК СОБИРАЕМ «ЗАЦЕП»',None,True)
    rows=[('Первый экран','Headline + Bold Creative','Ясный social-first оффер, CTA сразу'),('Визуальный язык','Brutalist Studio + REDKEDS','Крупный шрифт, рамки, лайм, проектный ритм'),('Услуги','SETTERS + Shift Motion','Пять направлений без профессионального тумана'),('Кейсы','Our Own Brand + REDKEDS','Визуал, задача, работа, честный результат'),('Доверие','SETTERS + Shift Motion','Люди, процесс, клиенты, отзывы - когда появятся'),('Конверсия','Bold Creative','CTA после hero, работ и в финале')]
    y=340
    for i,(part,src,res) in enumerate(rows):
        fill=LIME if i==0 else PAPER
        rect(c,48,y-i*52,864,42,fill,None)
        txt(c,part,62,y+14-i*52,10,'M700',INK); txt(c,src,260,y+14-i*52,10,'M600',INK); txt(c,res,520,y+14-i*52,10,'M400',INK)
    c.showPage(); pno+=1
    end_page(c,'РЕФЕРЕНСЫ ДАЛИ НАПРАВЛЕНИЕ. БРЕНД ДОЛЖЕН СТАТЬ СВОИМ.',pno)
    c.save(); return path

def create_brandbook_pdf():
    path=OUT/'02_zacep-brandbook.pdf'; c=canvas.Canvas(str(path),pagesize=(W,H),pageCompression=1)
    c.setTitle('ЗАЦЕП - брендбук'); c.setAuthor('ЗАЦЕП'); c.setSubject('Платформа бренда, логотип, цвета, типографика и применение')
    cover(c,'Брендбук / v1.0','ЗАЦЕП','Айдентика контент-агентства: позиционирование, логотип, цвет, типографика и система применения.', '02 / 03')
    # 2
    page_base(c,2,'Платформа',True); title(c,'Суть бренда','ЦЕПЛЯЕМ ВНИМАНИЕ.\nРАБОТАЕМ НА ЗАЯВКИ.','«ЗАЦЕП» превращает SMM, Reels, таргет и дизайн в одну понятную систему продвижения.',True)
    pill(c,'СМЕЛО',48,88,True); pill(c,'СИСТЕМНО',140,88,True); pill(c,'БЕЗ ПУСТЫХ ОБЕЩАНИЙ',270,88,True)
    c.showPage()
    # 3
    page_base(c,3,'Позиционирование',False); title(c,'Для кого','МАЛЫЙ И СРЕДНИЙ БИЗНЕС','Собственники и руководители, которым нужен не «контент ради контента», а регулярное присутствие, понятный процесс и путь к обращению.')
    cards=[('АУДИТОРИЯ','Бизнес по всей России.\nБаза - Нижний Новгород.'),('ПРОБЛЕМА','Соцсети ведутся рывками, визуал распадается, реклама живёт отдельно.'),('РЕШЕНИЕ','Стратегия, производство контента, дизайн и продвижение в одной команде.'),('ОБЕЩАНИЕ','Контент, который цепляет. Продвижение, которое работает на заявки.')]
    for i,(h,b) in enumerate(cards):
        x=48+(i%2)*440; y=232-(i//2)*130; rect(c,x,y,414,106,WHITE,INK,2); txt(c,h,x+16,y+76,10,'M700',INK); para(c,b,x+16,y+50,375,12,16,'M400',INK,max_lines=3)
    c.showPage()
    # 4 naming
    page_base(c,4,'Название',False); title(c,'Имя','ЗАЦЕП','Короткое русское слово с двойным смыслом: первый кадр, который удерживает внимание, и эмоциональная связь бренда с человеком.')
    rect(c,48,90,530,190,LIME,INK,3); logo(c,80,182,1.5,INK)
    para(c,'Зацеп внимания\nЗацеп смысла\nЗацеп для действия',620,245,260,18,29,'U800',INK)
    c.showPage()
    # 5 voice
    page_base(c,5,'Голос',True); title(c,'Tone of voice','ОСТРО. ЯСНО. НА «ВЫ».',None,True)
    examples=[('ДА','Ваш контент должен приводить к действию.','Коротко, конкретно, без шума.'),('НЕТ','Мы предоставляем комплекс инновационных решений.','Канцелярит без смысла.'),('ДА','Сначала разберём задачу. Потом включим производство.','Понятный процесс.'),('НЕТ','Гарантируем взрывной рост продаж.','Неподтверждённая гарантия.')]
    for i,(mark,phrase,why) in enumerate(examples):
        x=48+(i%2)*438; y=260-(i//2)*120; ok=mark=='ДА'; rect(c,x,y,410,96,LIME if ok else PAPER,None); txt(c,mark,x+16,y+66,9,'M700',INK); para(c,phrase,x+70,y+65,315,12,15,'M600',INK,max_lines=2); txt(c,why,x+70,y+18,9,'M400',INK)
    c.showPage()
    # 6 logo
    page_base(c,6,'Логотип',False); title(c,'Основная версия','СЛОВО + ЗАЦЕП','Тяжёлый wordmark получает собственный характер за счёт нижнего штриха: он продолжает букву «Ц» и превращается в крючок.')
    rect(c,48,118,864,190,WHITE,INK,2); logo(c,150,205,2.1,INK)
    txt(c,'ОСНОВНАЯ ВЕРСИЯ',64,136,9,'M700',INK)
    c.showPage()
    # 7 variants
    page_base(c,7,'Логотип',False); title(c,'Варианты','ОДИН ЗНАК. ТРИ ФОНА.')
    panels=[(48,PAPER,INK,'СВЕТЛЫЙ'),(340,INK,LIME,'ТЁМНЫЙ'),(632,LIME,INK,'СИГНАЛЬНЫЙ')]
    for x,bg,fg,label in panels:
        rect(c,x,150,260,220,bg,INK,2); logo(c,x+22,255,.72,fg); draw_hook(c,x+90,180,72,fg); txt(c,label,x+16,164,8,'M700',fg)
    c.showPage()
    # 8 sign
    page_base(c,8,'Знак',True); title(c,'Компактная версия','ЗАЦЕП КАК СИМВОЛ',None,True)
    rect(c,48,116,250,250,LIME,None); draw_hook(c,88,155,170,INK)
    para(c,'Знак строится на геометрии буквы «Ц»: прямой угол даёт устойчивость, нижний штрих - движение и «зацеп». Использование: аватар, favicon, маркер CTA, водяной знак.',350,330,490,15,21,'M400',PAPER)
    c.showPage()
    # 9 rules
    page_base(c,9,'Правила',False); title(c,'Охранное поле','ДАЙТЕ ЛОГОТИПУ ВОЗДУХ')
    rect(c,90,150,440,210,WHITE,MID,1); rect(c,130,190,360,130,LIME,None); logo(c,160,238,1.05,INK); txt(c,'x',112,250,12,'M700',INK); txt(c,'x',310,165,12,'M700',INK)
    para(c,'Охранное поле = высота буквы «А».\nМинимум: 120 px в digital, 32 мм в печати.\nЗнак отдельно: минимум 24 px.',590,320,290,13,20,'M600',INK)
    c.showPage()
    # 10 misuse
    page_base(c,10,'Правила',False); title(c,'Не делаем','НЕ ЛОМАЕМ ХАРАКТЕР')
    bad=[('НЕ РАСТЯГИВАТЬ','ЗА Ц Е П'),('НЕ МЕНЯТЬ ЦВЕТ','ЗАЦЕП'),('НЕ ДОБАВЛЯТЬ ТЕНИ','ЗАЦЕП'),('НЕ СТАВИТЬ НА ШУМ','ЗАЦЕП')]
    for i,(h,word) in enumerate(bad):
        x=48+(i%2)*438; y=240-(i//2)*125; rect(c,x,y,410,98,WHITE,INK,1); txt(c,'×',x+15,y+60,22,'U900',RED); txt(c,h,x+52,y+70,9,'M700',INK); txt(c,word,x+52,y+28,18,'U900',GRAY)
    c.showPage()
    # 11 colors
    page_base(c,11,'Цвет',False); title(c,'Палитра','ТРИ ЦВЕТА. НОЛЬ СЛУЧАЙНОСТЕЙ.')
    colors=[('ЗАЦЕП LIME','#DCFE38',LIME,INK),('INK','#1E1E1E',INK,PAPER),('PAPER','#F3F0E8',PAPER,INK)]
    for i,(n,hx,col,fg) in enumerate(colors):
        x=48+i*288; rect(c,x,130,264,230,col,INK,2); txt(c,n,x+18,318,11,'M700',fg); txt(c,hx,x+18,158,18,'U800',fg)
    txt(c,'Основные контрастные пары: INK/LIME, PAPER/INK, LIME/INK. Мелкий текст не ставить лаймом на светлом фоне.',48,86,10,'M600',INK)
    c.showPage()
    # 12 type
    page_base(c,12,'Типографика',True); title(c,'Шрифты','UNBOUNDED + MANROPE',None,True)
    txt(c,'UNBOUNDED 900',48,330,10,'M700',LIME); txt(c,'ЦЕПЛЯЕТ',48,250,54,'U900',PAPER)
    txt(c,'MANROPE 400 / 600 / 700',520,330,10,'M700',LIME); para(c,'Понятный основной текст для сайта, презентаций и социальных сетей. Кириллица читается уверенно даже в небольшом размере.',520,280,350,16,23,'M400',PAPER)
    txt(c,'Оба семейства бесплатны, поддерживают кириллицу и распространяются по SIL Open Font License.',48,82,9,'M400',PAPER)
    c.showPage()
    # 13 graphic system
    page_base(c,13,'Графика',False); title(c,'Система','РАМКИ. МЕТКИ. СТРЕЛКИ. ЗАЦЕПЫ.')
    rect(c,48,124,190,210,LIME,INK,3); txt(c,'01',66,294,12,'M700',INK); txt(c,'SMM',66,160,28,'U900',INK)
    rect(c,260,124,190,210,INK,None); txt(c,'02',278,294,12,'M700',LIME); draw_hook(c,302,160,95,LIME)
    rect(c,472,124,190,210,PAPER,INK,3); txt(c,'03',490,294,12,'M700',INK); arrow(c,500,190,105,INK)
    rect(c,684,124,190,210,WHITE,INK,3); txt(c,'04',702,294,12,'M700',INK); line(c,710,185,835,185,LIME,11); txt(c,'REELS',710,210,22,'U900',INK)
    c.showPage()
    # 14 applications
    page_base(c,14,'Применение',False); title(c,'Digital','БРЕНД В РАБОТЕ')
    # website mock
    rect(c,48,110,520,260,INK,None,10); logo(c,68,338,.42,LIME); txt(c,'УСЛУГИ  РАБОТЫ  ПОДХОД',320,342,7,'M700',PAPER)
    para(c,'КОНТЕНТ, КОТОРЫЙ ЦЕПЛЯЕТ.',70,285,440,26,31,'U900',PAPER,max_lines=2); rect(c,70,145,150,35,LIME,None,17); txt(c,'ОСТАВИТЬ ЗАЯВКУ',145,157,8,'M700',INK,'center')
    # social card
    rect(c,610,110,270,260,LIME,INK,2); txt(c,'REELS / 01',628,337,9,'M700',INK); para(c,'3 СЕКУНДЫ, ЧТОБЫ ЗАЦЕПИТЬ',628,285,220,22,26,'U900',INK); draw_hook(c,760,142,82,INK)
    c.showPage()
    # 15 applications 2
    page_base(c,15,'Применение',True); title(c,'Носители','ОДНА СИСТЕМА. РАЗНЫЙ РИТМ.',None,True)
    # presentation, avatar, post
    rect(c,48,120,400,220,PAPER,None); txt(c,'ПРЕЗЕНТАЦИЯ / 2026',68,310,8,'M700',INK); para(c,'СИСТЕМА\nКОНТЕНТА',68,260,330,28,34,'U900',INK); line(c,68,152,250,152,LIME,12)
    rect(c,500,160,150,150,LIME,None,25); draw_hook(c,525,180,100,INK); txt(c,'АВАТАР',575,136,8,'M700',PAPER,'center')
    rect(c,700,120,180,220,PAPER,None); txt(c,'ПОСТ / 04',718,310,8,'M700',INK); para(c,'НЕ ШУМИМ.\nЦЕПЛЯЕМ.',718,260,145,18,24,'U900',INK); arrow(c,718,152,90,INK)
    c.showPage()
    # 16 summary
    end_page(c,'ЗАЦЕП - ЭТО СМЕЛЫЙ ВИД, ЯСНАЯ РЕЧЬ И ЧЕСТНАЯ РАБОТА.',16)
    c.save(); return path

def wf_browser(c,x,y,w,h,title_text='zacep.agency'):
    rect(c,x,y,w,h,WHITE,INK,1,5); rect(c,x,y+h-22,w,22,PAPER,INK,1,5)
    for i,col in enumerate([RED,LIME,GRAY]): rect(c,x+9+i*14,y+h-15,7,7,col,None,3)
    txt(c,title_text,x+w/2,y+h-15,7,'M600',INK,'center')

def wf_block(c,x,y,w,h,label,kind='plain',num=None):
    fill=LIME if kind=='cta' else WHITE
    rect(c,x,y,w,h,fill,INK,1.2,3)
    if num: txt(c,num,x+8,y+h-16,7,'M700',INK)
    lines=[]
    for raw in label.split('\n'):
        lines.extend(wrap_lines(raw,'M700',7.5,w-20))
    leading=11
    start=y+h/2+(len(lines)-1)*leading/2-3
    for i,part in enumerate(lines):
        txt(c,part,x+w/2,start-i*leading,7.5,'M700',INK,'center')

def draw_desktop_overview(c,x,y,w,h):
    wf_browser(c,x,y,w,h)
    inner_x=x+12; inner_w=w-24; top=y+h-34
    units=[('HEADER',22),('HERO + CTA',55),('TRUST',20),('PAIN',34),('SERVICES',52),('WORK',58),('PROCESS',38),('FORMATS',35),('WHY',34),('FAQ',34),('FORM',48),('FOOTER',20)]
    total=sum(v for _,v in units); scale=(h-46)/total; cy=top
    for i,(label,uh) in enumerate(units):
        bh=uh*scale; cy-=bh; wf_block(c,inner_x,cy,inner_w,bh-2,label,'cta' if i in (1,10) else 'plain',str(i+1).zfill(2))

def mobile_overview(c,x,y,w,h):
    wf_browser(c,x,y,w,h,'390 px')
    inner=x+8; iw=w-16; cy=y+h-32
    labels=['HEADER','HERO','CTA','TRUST','PAIN','SERVICES','WORK','PROCESS','FORMATS','WHY','FAQ','FORM','FOOTER']
    bh=(h-42)/len(labels)
    for i,l in enumerate(labels):
        cy-=bh; wf_block(c,inner,cy,iw,bh-2,l,'cta' if l in ('CTA','FORM') else 'plain',str(i+1).zfill(2))

def create_wireframe_pdf():
    path=OUT/'03_zacep-wireframe.pdf'; c=canvas.Canvas(str(path),pagesize=(W,H),pageCompression=1)
    c.setTitle('ЗАЦЕП - wireframe сайта'); c.setAuthor('ЗАЦЕП'); c.setSubject('Главная страница и шаблон кейса: desktop 1440 px и mobile 390 px')
    cover(c,'Wireframe / desktop + mobile','САЙТ, КОТОРЫЙ ВЕДЁТ К ЗАЯВКЕ','Аннотированная структура главной страницы и шаблона кейса. Без выдуманных метрик, отзывов и клиентов.', '03 / 03')
    page_base(c,2,'Логика',False); title(c,'Путь пользователя','УВИДЕЛ → ПОНЯЛ → ПОВЕРИЛ → ОСТАВИЛ ЗАЯВКУ')
    stages=[('01','УВИДЕЛ','Сильный hero'),('02','ПОНЯЛ','Услуги и процесс'),('03','ПОВЕРИЛ','Работы и принципы'),('04','ДЕЙСТВИЕ','Короткая форма')]
    for i,(n,h,b) in enumerate(stages):
        x=48+i*220; rect(c,x,145,190,170,LIME if i==3 else WHITE,INK,2); txt(c,n,x+15,282,10,'M700',INK); txt(c,h,x+15,230,17,'U800',INK); txt(c,b,x+15,178,11,'M400',INK)
        if i<3: arrow(c,x+170,130,45,INK)
    c.showPage()
    page_base(c,3,'Главная / desktop',False); title(c,'Карта страницы','12 БЛОКОВ. 3 ТОЧКИ КОНВЕРСИИ.')
    draw_desktop_overview(c,210,62,540,340)
    txt(c,'CTA 01 / HERO',48,330,9,'M700',INK); txt(c,'CTA 02 / ПОСЛЕ РАБОТ',48,280,9,'M700',INK); txt(c,'CTA 03 / ФИНАЛЬНАЯ ФОРМА',48,230,9,'M700',INK)
    para(c,'Desktop 1440 px\nКонтентная ширина 1200 px\n12-колоночная сетка',770,330,150,10,16,'M600',INK)
    c.showPage()
    # hero detail
    page_base(c,4,'Главная / 01-02',False); title(c,'Header + hero','ОФФЕР ПОНЯТЕН ЗА 5 СЕКУНД')
    wf_browser(c,48,95,864,280)
    wf_block(c,65,321,830,34,'ЛОГО     УСЛУГИ  РАБОТЫ  ПОДХОД  КОНТАКТЫ       [ОСТАВИТЬ ЗАЯВКУ]','plain','01')
    wf_block(c,65,118,510,190,'КОНТЕНТ, КОТОРЫЙ ЦЕПЛЯЕТ.\nПродвижение, которое работает на заявки.\n[SMM / REELS / ТАРГЕТ / ДИЗАЙН]\n[ОСТАВИТЬ ЗАЯВКУ]','cta','02')
    wf_block(c,590,118,305,190,'ДИНАМИЧЕСКИЙ ВИЗУАЛ\nкадры / типографика / знак','plain')
    txt(c,'CTA №1 - виден без прокрутки',48,64,10,'M700',INK); c.showPage()
    # trust pain
    page_base(c,5,'Главная / 03-04',False); title(c,'Контекст','ДОВЕРИЕ, ПОТОМ - УЗНАВАЕМАЯ БОЛЬ')
    wf_block(c,48,300,864,62,'ИЗ НИЖНЕГО НОВГОРОДА - РАБОТАЕМ ПО ВСЕЙ РОССИИ   [ЛОГОТИПЫ КЛИЕНТОВ: PLACEHOLDER]','plain','03')
    txt(c,'Не придумывать клиентов: логотипы добавляются только после подтверждения.',48,277,9,'M400',INK)
    labels=['КОНТЕНТ ВЫХОДИТ РЫВКАМИ','REELS НЕ УДЕРЖИВАЮТ','ВИЗУАЛ РАСПАДАЕТСЯ','РЕКЛАМА ЖИВЁТ ОТДЕЛЬНО']
    for i,l in enumerate(labels): wf_block(c,48+i*216,125,198,120,l,'plain',str(i+1).zfill(2))
    c.showPage()
    # services
    page_base(c,6,'Главная / 05',True); title(c,'Услуги','ПЯТЬ НАПРАВЛЕНИЙ. ОДНА СИСТЕМА.',None,True)
    services=['SMM ПОД КЛЮЧ','REELS / SHORT VIDEO','КОНТЕНТ-ПЛАНЫ','ТАРГЕТ','ДИЗАЙН-ПОДДЕРЖКА']
    for i,s in enumerate(services):
        y=345-i*58; rect(c,48,y,864,46,LIME if i==0 else PAPER,None); txt(c,str(i+1).zfill(2),62,y+17,9,'M700',INK); txt(c,s,120,y+15,13,'U800',INK); txt(c,'КРАТКИЙ РЕЗУЛЬТАТ УСЛУГИ →',880,y+17,8,'M700',INK,'end')
    c.showPage()
    # work
    page_base(c,7,'Главная / 06',False); title(c,'Работы','ПОКАЗЫВАЕМ, А НЕ ПРИДУМЫВАЕМ')
    for i in range(4):
        x=48+(i%2)*438; y=125+(1-i//2)*125; rect(c,x,y,410,110,WHITE,INK,1.5); rect(c,x+10,y+10,150,90,MID,None); txt(c,'ВИЗУАЛ',x+85,y+52,8,'M700',INK,'center'); txt(c,f'КЕЙС {i+1:02d}',x+180,y+76,8,'M700',INK); txt(c,'Клиент / категория',x+180,y+52,12,'M600',INK); txt(c,'Задача + выполненные работы',x+180,y+28,9,'M400',INK)
    txt(c,'CTA №2: «Обсудить похожую задачу» после сетки работ.',48,84,10,'M700',INK); c.showPage()
    # process formats
    page_base(c,8,'Главная / 07-08',False); title(c,'Как работаем','ПРОЦЕСС СНИМАЕТ РИСК')
    steps=['ДИАГНОСТИКА','СТРАТЕГИЯ','ПРОИЗВОДСТВО','ЗАПУСК + УЛУЧШЕНИЕ']
    for i,s in enumerate(steps): wf_block(c,48+i*216,255,198,90,s,'cta' if i==3 else 'plain',str(i+1).zfill(2))
    formats=['КОМПЛЕКСНОЕ ВЕДЕНИЕ','КОНТЕНТ-ПРОДАКШЕН','ТАРГЕТ','ДИЗАЙН-ПОДДЕРЖКА']
    for i,s in enumerate(formats): txt(c,s,48+i*216,175,10,'M700',INK); line(c,48+i*216,162,230+i*216,162,INK,1)
    txt(c,'Цены не показываем: каждый формат ведёт к брифу и оценке задачи.',48,96,10,'M600',INK); c.showPage()
    # why faq
    page_base(c,9,'Главная / 09-10',False); title(c,'Доверие','ОТВЕЧАЕМ ДО ТОГО, КАК СПРОСЯТ')
    why=['ЕДИНАЯ КОМАНДА','СИСТЕМНЫЙ РИТМ','ПОНЯТНАЯ СВЯЗЬ','ФОКУС НА ЗАЯВКАХ']
    for i,s in enumerate(why): wf_block(c,48+i*216,300,198,72,s,'plain',str(i+1).zfill(2))
    faqs=['С какими нишами работаете?','Можно заказать только Reels?','Кто участвует со стороны клиента?','Когда появятся первые материалы?','Как вы оцениваете результат?']
    for i,q in enumerate(faqs):
        y=240-i*34; line(c,48,y,912,y,INK,1); txt(c,q,58,y-23,10,'M600',INK); txt(c,'+',890,y-23,16,'U900',INK)
    c.showPage()
    # form
    page_base(c,10,'Главная / 11-12',True); title(c,'Финал','ЗАЯВКА БЕЗ ЛИШНИХ ПОЛЕЙ',None,True)
    rect(c,48,104,520,260,PAPER,None); fields=['Имя','Компания или ниша','Телефон / Telegram / e-mail','Коротко о задаче']
    for i,f in enumerate(fields):
        y=315-i*48; txt(c,f,70,y,9,'M600',INK); line(c,70,y-10,540,y-10,INK,1)
    rect(c,70,125,190,34,LIME,INK,1,17); txt(c,'ОТПРАВИТЬ ЗАЯВКУ',165,137,9,'M700',INK,'center')
    para(c,'[ ] Согласие на обработку персональных данных',280,143,250,8,11,'M400',INK)
    para(c,'После отправки:\n• понятное подтверждение\n• срок ответа\n• альтернативный Telegram\n\nФутер: контакты, реквизиты, политика.',620,325,270,13,21,'M600',PAPER)
    c.showPage()
    # mobile
    page_base(c,11,'Главная / mobile',False); title(c,'Mobile 390 px','ТОТ ЖЕ ПУТЬ. КОРОЧЕ ШАГИ.')
    mobile_overview(c,370,62,220,350)
    para(c,'• CTA занимает всю ширину\n• услуги - вертикальный accordion\n• работы - горизонтальные карточки\n• форма - четыре поля\n• навигация - компактное меню',48,320,260,12,20,'M600',INK)
    para(c,'Лайм отмечает действие, а не декоративный шум.',650,210,240,14,20,'U800',INK)
    c.showPage()
    # mobile details
    page_base(c,12,'Mobile / hero + form',False); title(c,'Ключевые экраны','HERO И ЗАЯВКА БЕЗ ТУПИКОВ')
    for j,label in enumerate(['HERO','FORM']):
        x=190+j*360; wf_browser(c,x,80,220,330,label)
        if label=='HERO':
            wf_block(c,x+10,350,200,38,'ЛОГО     MENU','plain'); wf_block(c,x+10,175,200,165,'КОНТЕНТ, КОТОРЫЙ ЦЕПЛЯЕТ\nSMM / REELS / ТАРГЕТ\n[ОСТАВИТЬ ЗАЯВКУ]','cta')
        else:
            wf_block(c,x+10,338,200,50,'ОСТАВИТЬ ЗАЯВКУ','cta');
            for i,f in enumerate(['ИМЯ','БИЗНЕС','КОНТАКТ','ЗАДАЧА']): wf_block(c,x+10,287-i*46,200,36,f,'plain')
            wf_block(c,x+10,88,200,38,'ОТПРАВИТЬ','cta')
    c.showPage()
    # case overview
    page_base(c,13,'Шаблон кейса',False); title(c,'Структура кейса','РАБОТА ГОВОРИТ ЗА СЕБЯ')
    wf_browser(c,240,70,480,340,'case / client-name')
    blocks=['CLIENT + CATEGORY','TASK','IDEA','DELIVERABLES','GALLERY','QUALITATIVE RESULT','REVIEW*','CTA']
    cy=370
    for i,b in enumerate(blocks):
        h=34 if b!='GALLERY' else 72; cy-=h; wf_block(c,255,cy,450,h-2,b,'cta' if b=='CTA' else 'plain',str(i+1).zfill(2))
    txt(c,'* Отзыв появляется только после предоставления клиентом.',48,70,9,'M600',INK); c.showPage()
    # case details
    page_base(c,14,'Шаблон кейса',True); title(c,'Содержание','ФАКТЫ ВМЕСТО ДЕКОРАЦИИ',None,True)
    cols=[('ЗАДАЧА','Что нужно было изменить и почему.'),('ИДЕЯ','Главный творческий или стратегический ход.'),('СДЕЛАЛИ','SMM, Reels, дизайн, таргет - только реальные работы.'),('РЕЗУЛЬТАТ','Качественное изменение; цифры - только подтверждённые.'),('ГАЛЕРЕЯ','Вертикальные видео, сетка постов, key visuals.'),('CTA','«Обсудить похожую задачу».')]
    for i,(h,b) in enumerate(cols):
        x=48+(i%3)*288; y=240-(i//3)*125; rect(c,x,y,264,98,LIME if i==5 else PAPER,None); txt(c,h,x+14,y+68,10,'M700',INK); para(c,b,x+14,y+44,232,10,14,'M400',INK,max_lines=3)
    c.showPage()
    # content inputs
    page_base(c,15,'Наполнение',False); title(c,'Что заменить','PLACEHOLDER - ЭТО ДОГОВОРЁННОСТЬ, НЕ ФЕЙК')
    items=[('4-6 РАБОТ','Обложка, клиент, категория, задача, сделанные материалы.'),('ЛОГОТИПЫ','Только клиенты, чьё размещение согласовано.'),('ОТЗЫВЫ','Дословный текст и имя/роль автора.'),('МЕТРИКИ','Только с периодом, источником и контекстом.'),('КОНТАКТЫ','Телефон, e-mail, Telegram, реквизиты.'),('ПОЛИТИКА','Согласие и ссылка на обработку данных.')]
    for i,(h,b) in enumerate(items):
        x=48+(i%3)*288; y=250-(i//3)*130; rect(c,x,y,264,105,WHITE,INK,1.5); txt(c,h,x+14,y+74,10,'M700',INK); para(c,b,x+14,y+48,232,10,14,'M400',INK,max_lines=3)
    c.showPage()
    # checklist
    page_base(c,16,'Проверка',False); title(c,'Acceptance','САЙТ ГОТОВ К ДИЗАЙНУ, КОГДА...')
    checks=['Оффер считывается без прокрутки','CTA виден на hero, после работ и в финале','Каждая услуга описана через результат','Нет вымышленных клиентов, отзывов и цифр','Главная и кейс работают на mobile 390 px','Форма содержит согласие и понятный следующий шаг','Все плейсхолдеры имеют список данных для замены']
    for i,q in enumerate(checks):
        y=350-i*42; rect(c,48,y,28,28,LIME,INK,1); txt(c,'OK',62,y+9,8,'M700',INK,'center'); txt(c,q,92,y+8,12,'M600',INK)
    c.showPage()
    end_page(c,'СЛЕДУЮЩИЙ ШАГ - ПОДСТАВИТЬ РАБОТЫ И СОБРАТЬ UI.',17)
    c.save(); return path

if __name__ == '__main__':
    outputs=[create_reference_pdf(),create_brandbook_pdf(),create_wireframe_pdf()]
    for p in outputs: print(p)
