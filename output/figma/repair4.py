from pathlib import Path
p=Path('output/figma/plugin/code.js')
s=p.read_text()
s=s.replace('async function run(){','async function run(assets){')
s=s.replace('await run();','await run(m.assets);')
needle='await figma.setCurrentPageAsync(proto);'
patch='''
const allPages=[main,proto,kit];for(const p of allPages)await p.loadAsync();
const imageMap={};for(const [key,bytes] of Object.entries(assets)){const im=figma.createImage(new Uint8Array(bytes));imageMap[state.assets[key]]=im.hash;state.assets[key]=im.hash;await im.getSizeAsync();}
let imageFixes=0;for(const p of allPages)for(const n of p.findAll(n=>'fills' in n && Array.isArray(n.fills)&&n.fills.some(f=>f.type==='IMAGE'))){n.fills=n.fills.map(f=>f.type==='IMAGE'&&imageMap[f.imageHash]?{...f,imageHash:imageMap[f.imageHash]}:f);imageFixes++;}
// Replace emoji-prone glyphs with the official Tabler arrow-up-right SVG.
function inInstance(n){for(let p=n.parent;p;p=p.parent)if(p.type==='INSTANCE')return true;return false;}
for(const p of allPages)for(const n of p.findAll(n=>n.type==='TEXT'&&n.characters.includes('↗'))){if(inInstance(n))continue;if(n.characters==='↗'){const parent=n.parent,index=parent.children.indexOf(n),c=parent.name.includes('Hover')?'#C8FF00':'#0A0A0A';const icon=figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/></svg>');icon.name='Icon / Arrow up right';parent.insertChild(index,icon);n.remove();}else n.characters=n.characters.replace(/ ↗/g,'');}
for(const n of kit.findAll(n=>n.name==='Согласие')){n.minHeight=44;}
state.imageFixes=imageFixes;
'''
s=s.replace(needle,patch+needle,1)
needle='state.prototypeErrors=errors;'
patch='''
const nodeAction=(to,nav)=>({type:'NODE',destinationId:to.id,navigation:nav,transition:{type:nav==='SCROLL_TO'?'SCROLL_ANIMATE':'DISSOLVE',easing:{type:'EASE_OUT'},duration:.24},resetScrollPosition:nav==='NAVIGATE'});
async function multi(n,actions){try{await n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions}]);}catch(e){errors.push({source:n.id,error:String(e),action:'multi'});}}
for(const key of ['caseDesktop','caseMobile']){const root=roots[key],home=roots[key==='caseMobile'?'homeMobile':'homeDesktop'];for(const name of ['Услуги','Команда','Заявка'])for(const n of nodes(root,'Nav '+name))await multi(n,[nodeAction(home,'NAVIGATE'),nodeAction(section(home,name),'SCROLL_TO')]);for(const n of nodes(root,'CTA / Обсудить задачу'))await multi(n,[nodeAction(home,'NAVIGATE'),nodeAction(section(home,'Заявка'),'SCROLL_TO')]);for(const n of root.findAll(x=>x.type==='TEXT'&&x.characters==='← Вернуться к работам'))await multi(n,[nodeAction(home,'NAVIGATE'),nodeAction(section(home,'Работы'),'SCROLL_TO')]);}
function frame(name,w){const f=figma.createFrame();f.name=name;f.resize(w,100);f.layoutMode='VERTICAL';f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='FIXED';f.paddingTop=f.paddingBottom=f.paddingLeft=f.paddingRight=20;f.itemSpacing=12;f.fills=[{type:'SOLID',color:{r:243/255,g:240/255,b:232/255}}];return f;}
const buttonMaster=await figma.getNodeByIdAsync(state.components['Button / Primary'].variants[0].id);
function button(label){const n=buttonMaster.createInstance();n.resize(350,56);const t=n.findOne(n=>n.type==='TEXT');t.characters=label;return n;}
state.menus={};for(const key of ['homeMobile','caseMobile']){let menu=proto.children.find(n=>n.name==='Меню / '+key);if(!menu){menu=frame('Меню / '+key,390);proto.appendChild(menu);menu.x=4400;menu.y=key==='homeMobile'?80:550;const close=button('Закрыть');menu.appendChild(close);await multi(close,[{type:'CLOSE'}]);for(const title of ['Услуги','Команда','Заявка']){const b=button(title);menu.appendChild(b);await multi(b,[{type:'CLOSE'},...(key==='caseMobile'?[nodeAction(roots.homeMobile,'NAVIGATE')]:[]),nodeAction(section(roots.homeMobile,title),'SCROLL_TO')]);}}for(const n of nodes(roots[key],'Menu toggle'))await set(n,menu,'OVERLAY');state.menus[key]=menu.id;}
'''
s=s.replace(needle,patch+needle,1)
s=s.replace("name:'state-layouts.json'","name:'state-final.json'")
s=s.replace("['mobile-hero',screens.homeMobile.children[1],1]","['mobile-hero',screens.homeMobile.children[1],1],['mobile-form',screens.homeMobile.children[7],1],['desktop-form',screens.homeDesktop.children[7],.8]")
s=s.replace("Макеты собраны. Проверка: ","Готово. Изображений: '+imageFixes+'. Ошибок: ")
p.write_text(s)
Path('/tmp/zacep-figma/code.js').write_text(s)
