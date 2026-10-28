figma.showUI(__html__,{width:340,height:160});
const save=(name,data)=>figma.ui.postMessage({type:'save',name,data});
const gray=v=>({type:'SOLID',color:{r:v/255,g:v/255,b:v/255}});
const owned=n=>{let p=n.parent;while(p&&p.type!=='PAGE'){if(p.type==='INSTANCE')return false;p=p.parent;}return true;};
figma.ui.onmessage=async m=>{if(m.type==='close')return figma.closePlugin();if(m.type!=='build')return;let stage='load';const log={replacements:{},warnings:[],dimensions:[]};try{
await figma.loadAllPagesAsync();
const all=figma.root.findAll();const fonts={};for(const n of all)if(n.type==='TEXT'){for(const s of n.getStyledTextSegments(['fontName']))fonts[JSON.stringify(s.fontName)]=s.fontName;}
await Promise.all(Object.values(fonts).map(x=>figma.loadFontAsync(x)));
const original=all.filter(n=>n.type!=='PAGE').map(n=>({id:n.id,w:n.width,h:n.height,x:n.x,y:n.y}));save('wireframe-geometry-before.json',original);
const targets=all.filter(n=>n.type==='TEXT'&&owned(n)).map(n=>({id:n.id,w:n.width,h:n.height,x:n.x,y:n.y,font:typeof n.fontSize==='number'?n.fontSize:16,line:n.lineHeight,chars:n.characters,align:n.layoutAlign,grow:n.layoutGrow,hsize:n.layoutSizingHorizontal,position:n.layoutPositioning,minHeight:n.minHeight,minWidth:n.minWidth,maxHeight:n.maxHeight,maxWidth:n.maxWidth,visible:n.visible,opacity:n.opacity,constraints:n.constraints,reactions:n.reactions}));
stage='logo';const logo=await figma.getNodeByIdAsync('4:30');for(const c of [...logo.children])c.remove();logo.name='Logo / Placeholder';const mark=figma.createRectangle();mark.name='Блок / Логотип';mark.resize(116,32);mark.fills=[gray(210)];logo.appendChild(mark);mark.x=0;mark.y=11;
stage='text';
for(const t of targets){const n=await figma.getNodeByIdAsync(t.id);if(!n||n.removed)continue;const p=n.parent;const idx=p.children.indexOf(n);const f=figma.createFrame();f.name=t.font>=24?'Заполнитель / Заголовок':t.h>42?'Заполнитель / Абзац':'Заполнитель / Подпись';f.fills=[];f.clipsContent=false;f.resize(Math.max(1,t.w),Math.max(1,t.h));f.layoutMode='VERTICAL';f.primaryAxisSizingMode='FIXED';f.counterAxisSizingMode='FIXED';f.primaryAxisAlignItems='CENTER';f.counterAxisAlignItems='MIN';
const lh=t.line&&t.line.unit==='PIXELS'?t.line.value:t.font*1.5;const count=t.minHeight&&t.h<=t.minHeight?1:Math.max(1,Math.round(t.h/lh));const bh=Math.min(t.h/count,Math.max(5,Math.min(22,t.font*.42)));f.itemSpacing=Math.max(0,lh-bh);
for(let i=0;i<count;i++){const r=figma.createRectangle();r.name='Линия / '+(i+1);let fraction=count>1?(i===count-1?.62:.9):Math.min(.78,Math.max(.12,t.chars.length*t.font*.48/t.w));if(t.w<60)fraction=.65;r.resize(Math.max(2,t.w*fraction),bh);r.fills=[gray(t.font>=24?175:194)];f.appendChild(r);}
p.insertChild(idx,f);f.layoutPositioning=t.position;f.layoutAlign=t.align;f.layoutGrow=t.grow;if(t.hsize==='FILL')f.layoutSizingHorizontal='FILL';f.minHeight=t.minHeight;f.minWidth=t.minWidth;f.maxHeight=t.maxHeight;f.maxWidth=t.maxWidth;f.visible=t.visible;f.opacity=t.opacity;f.constraints=t.constraints;if(!p.layoutMode||p.layoutMode==='NONE'||t.position==='ABSOLUTE'){f.x=t.x;f.y=t.y;}if(t.reactions.length)await f.setReactionsAsync(t.reactions);log.replacements[t.id]=f.id;n.remove();}
stage='properties';for(const n of figma.root.findAll(n=>n.type==='COMPONENT_SET'||(n.type==='COMPONENT'&&n.parent.type!=='COMPONENT_SET'))){for(const [key,prop]of Object.entries(n.componentPropertyDefinitions))if(prop.type==='TEXT')n.deleteComponentProperty(key);n.description='';}
stage='paints';
function paint(p,stroke,n){if(p.type==='IMAGE')return gray(232);if(p.type!=='SOLID')return gray(224);const c=p.color;if(Math.abs(c.r-c.g)<.001&&Math.abs(c.g-c.b)<.001){if(stroke)return gray(c.r<.15?170:Math.round(c.r*255));return {...gray(c.r<.15?130:Math.round(c.r*255)),opacity:p.opacity===undefined?1:p.opacity,visible:p.visible===undefined?true:p.visible};}if(stroke)return gray(170);const isLime=c.g>.9&&c.r>.6&&c.b<.15;if(isLime){const big=n.width>1000&&n.height>200;return gray(big?245:207);}if(c.r>.8&&c.g>.8)return gray(255);return gray(165);}
let imageCount=0;const scalar=['height','width','itemSpacing','paddingLeft','paddingRight','paddingTop','paddingBottom','visible','cornerRadius','topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius','minWidth','maxWidth','minHeight','maxHeight','counterAxisSpacing','strokeWeight','strokeTopWeight','strokeRightWeight','strokeBottomWeight','strokeLeftWeight','opacity','gridRowGap','gridColumnGap'];
for(const n of figma.root.findAll()){
 if(n.type==='PAGE'){n.backgrounds=[gray(238)];continue;}
 if(/зацеп/i.test(n.name))n.name=n.name.replace(/зацеп/gi,'Каркас');
 if(/коллаж|фирменный/i.test(n.name))n.name='Изображение / Placeholder';
 if('description'in n)n.description='';
 if('fills'in n&&n.fills!==figma.mixed){const img=n.fills.some(p=>p.type==='IMAGE');if(img){imageCount++;n.name='Изображение / Placeholder';}n.fills=n.fills.map(p=>paint(p,false,n));}
 if('strokes'in n&&n.strokes!==figma.mixed)n.strokes=n.strokes.map(p=>paint(p,true,n));
 if('effects'in n)n.effects=[];
 if('layoutGrids'in n)n.layoutGrids=n.layoutGrids.map(g=>({...g,color:{r:.5,g:.5,b:.5,a:.08}}));
 if('boundVariables'in n)for(const field of scalar)if(n.boundVariables[field]){const value=n[field];n.setBoundVariable(field,null);if(value!==figma.mixed)n[field]=value;}
}
log.imagesReplaced=imageCount;
stage='styles';for(const s of await figma.getLocalTextStylesAsync())s.remove();for(const s of await figma.getLocalPaintStylesAsync())s.remove();for(const v of await figma.variables.getLocalVariableCollectionsAsync())v.remove();
stage='rename';try{figma.root.name='Сайт · Каркас';}catch(e){log.warnings.push('rename: '+e);}
for(const id of ['4:1162','4:1394','4:1611','4:1660']){const n=await figma.getNodeByIdAsync(id);log.dimensions.push({id,w:n.width,h:n.height});}
log.name=figma.root.name;log.finished=true;save('wireframe-change.json',log);figma.commitUndo();
}catch(e){save('wireframe-error.json',{stage,error:String(e),stack:e.stack,log});}};
figma.ui.postMessage({type:'ready'});
