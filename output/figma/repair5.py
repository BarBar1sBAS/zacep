from pathlib import Path
import json
state=json.loads(Path('output/figma/review/state-final.json').read_text());state.pop('nodes',None)
s='figma.showUI(__html__,{width:380,height:240});\nconst state='+json.dumps(state,ensure_ascii=False)+';\n'
s+='''
const errors=[];const color=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
async function run(assets){
await Promise.all([{family:'Unbounded',style:'Black'},{family:'Manrope',style:'Regular'},{family:'Manrope',style:'SemiBold'},{family:'Manrope',style:'Bold'}].map(x=>figma.loadFontAsync(x)));
const main=await figma.getNodeByIdAsync(state.pages.main),proto=await figma.getNodeByIdAsync(state.pages.prototype),kit=await figma.getNodeByIdAsync(state.pages.system);for(const p of [main,proto,kit])await p.loadAsync();
for(const [key,bytes]of Object.entries(assets)){const im=figma.createImage(bytes);state.assets[key]=im.hash;await im.getSizeAsync();}
const mediaNames={'Фирменный коллаж':'hero-collage','Обложка кейса':'editing-collage','Главный визуал':'hero-collage','Вертикальный кадр':'reels-frame','Монтажный коллаж':'editing-collage'};
state.imageAudit=[];for(const p of [main,proto])for(const n of p.findAll(n=>n.type==='RECTANGLE')){let key=mediaNames[n.name];if(n.name==='Визуал')key=n.parent.children.some(n=>n.type==='TEXT'&&n.characters.includes('SMM'))?'reels-frame':'hero-collage';if(key){n.fills=[{type:'IMAGE',imageHash:state.assets[key],scaleMode:'FILL'}];state.imageAudit.push({id:n.id,name:n.name,fills:n.fills,bound:n.boundVariables});}}
const roots={};for(const [key,id]of Object.entries(state.prototypes))roots[key]=await figma.getNodeByIdAsync(id);
const act=(to,nav)=>({type:'NODE',destinationId:to.id,navigation:nav,transition:{type:nav==='SCROLL_TO'?'SCROLL_ANIMATE':'DISSOLVE',easing:{type:'EASE_OUT'},duration:.24},resetScrollPosition:nav==='NAVIGATE'});
async function link(n,to,nav='NAVIGATE',trigger={type:'ON_CLICK'}){try{await n.setReactionsAsync([{trigger,actions:[act(to,nav)]}]);}catch(e){errors.push({id:n.id,to:to.id,error:String(e)});}}
const section=(r,name)=>r.children[0].children.find(n=>n.name===name);
const named=(r,name)=>r.findAll(n=>n.name===name);
async function wire(root,key){const mob=key.includes('Mobile'),isCase=key.startsWith('case');for(const title of ['Услуги','Команда','Заявка'])for(const n of named(root,'Nav '+title))await link(n,isCase?entries[(mob?'Mobile':'Desktop')+title]:section(root,title),isCase?'NAVIGATE':'SCROLL_TO');for(const n of named(root,'CTA / Обсудить задачу'))await link(n,isCase?entries[(mob?'Mobile':'Desktop')+'Заявка']:section(root,'Заявка'),isCase?'NAVIGATE':'SCROLL_TO');for(const n of named(root,'Кейс / Серия'))await link(n,roots[mob?'caseMobile':'caseDesktop']);for(const n of root.findAll(n=>n.type==='TEXT'&&n.characters==='← Вернуться к работам'))await link(n,entries[(mob?'Mobile':'Desktop')+'Работы']);if(mob)for(const n of named(root,'Menu toggle'))await link(n,await figma.getNodeByIdAsync(state.menus.homeMobile),'OVERLAY');}
const entries={};state.entries={};for(const size of ['Desktop','Mobile'])for(const [i,title] of ['Услуги','Команда','Заявка','Работы'].entries()){const name='Вход / '+size+' / '+title;let r=proto.children.find(n=>n.name===name);if(!r){r=roots['home'+size].clone();r.name=name;proto.appendChild(r);r.x=5100+(size==='Desktop'?0:1600);r.y=80+i*1050;}entries[size+title]=r;state.entries[size+title]=r.id;await link(r,section(r,title),'SCROLL_TO',{type:'AFTER_TIMEOUT',timeout:.01});}
for(const [key,r]of Object.entries(roots))await wire(r,key);for(const [key,r]of Object.entries(entries))await wire(r,'home'+(key.startsWith('Mobile')?'Mobile':'Desktop'));
for(const id of Object.values(state.menus)){const menu=await figma.getNodeByIdAsync(id);for(const b of menu.children){const t=b.findOne(n=>n.type==='TEXT');if(t&&entries['Mobile'+t.characters])await link(b,entries['Mobile'+t.characters]);}}
// Grid is available for editing without covering the visual.
for(const id of Object.values(state.screens)){const f=await figma.getNodeByIdAsync(id);f.layoutGrids=f.width===1440?[{pattern:'COLUMNS',alignment:'STRETCH',gutterSize:24,count:12,offset:48,visible:false,color:{r:.5,g:.5,b:.5,a:.1}}]:[];}
state.prototypeErrors=errors;state.nodes=[];for(const p of [main,proto,kit])state.nodes.push(...p.findAll().map(n=>({id:n.id,name:n.name,type:n.type})));
figma.ui.postMessage({type:'save',name:'state-final.json',data:state});
const screens={};for(const[key,id]of Object.entries(state.screens))screens[key]=await figma.getNodeByIdAsync(id);
await figma.setCurrentPageAsync(main);figma.currentPage.selection=[];figma.viewport.scrollAndZoomIntoView([screens.homeDesktop.children[0],screens.homeDesktop.children[1]]);
const shots=[['desktop-full',screens.homeDesktop,.5],['mobile-full',screens.homeMobile,1],['case-desktop-full',screens.caseDesktop,.5],['case-mobile-full',screens.caseMobile,1],['desktop-hero',screens.homeDesktop.children[1],1],['desktop-services',screens.homeDesktop.children[2],.8],['desktop-team',screens.homeDesktop.children[5],.8],['mobile-hero',screens.homeMobile.children[1],1],['mobile-form',screens.homeMobile.children[7],1],['desktop-form',screens.homeDesktop.children[7],.8]];
for(const[name,node,scale]of shots){const bytes=await node.exportAsync({format:'PNG',constraint:{type:'SCALE',value:scale}});figma.ui.postMessage({type:'image',name:name+'.png',bytes:Array.from(bytes)});}
figma.ui.postMessage({type:'log',text:'Готово. Переходы: '+errors.length+' ошибок. Визуалов: '+state.imageAudit.length});
}
figma.ui.onmessage=async m=>{if(m.type==='close')figma.closePlugin();if(m.type==='build')try{await run(m.assets);}catch(e){figma.ui.postMessage({type:'save',name:'repair-error.json',data:{error:String(e),stack:e.stack,errors}});}};figma.ui.postMessage({type:'ready'});
'''
Path('output/figma/plugin/code.js').write_text(s);Path('/tmp/zacep-figma/code.js').write_text(s)
