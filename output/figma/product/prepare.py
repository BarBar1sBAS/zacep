# -*- coding: utf-8 -*-
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import json
base=Path('output/figma/product')
f=TTFont('tmp/pdfs/fonts/Unbounded-900.ttf'); gs=f.getGlyphSet(); cmap=f.getBestCmap(); units=f['head'].unitsPerEm
scale=34/units;x=0;paths=[]
for char in 'ЗАЦЕП':
 g=gs[cmap[ord(char)]];p=SVGPathPen(gs);g.draw(p);paths.append(f'<path transform="translate({x} 34) scale({scale} {-scale})" d="{p.getCommands()}"/>');x+=g.width*scale
za=sum(gs[cmap[ord(c)]].width*scale for c in 'ЗА')+5
svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{x}" height="58" viewBox="0 0 {x} 58"><g fill="#0A0A0A">'+''.join(paths)+f'</g><path d="M{za} 41 h36 c12 0 12 13 2 15" fill="none" stroke="#0A0A0A" stroke-width="4"/></svg>'
mark='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M78 14 H25 V72 H72 V92 C72 108 92 108 92 88" transform="translate(0 -7) scale(0.9)" fill="none" stroke="#0A0A0A" stroke-width="12" stroke-linecap="butt" stroke-linejoin="miter"/></svg>'
(base/'logo.svg').write_text(svg);(base/'sign.svg').write_text(mark)
source=Path('output/figma/build-v1.js').read_text()
data=source[source.index('const svc='):source.index('let desktopDecks=')]
(base/'data.js').write_text(data+'\nconst logoSVG='+json.dumps(svg)+';\nconst signSVG='+json.dumps(mark)+';\n')
