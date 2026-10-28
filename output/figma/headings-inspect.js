figma.showUI(__html__,{width:340,height:160});
const save=(name,data)=>figma.ui.postMessage({type:'save',name,data});
figma.ui.onmessage=async m=>{if(m.type==='close')return figma.closePlugin();if(m.type!=='build')return;try{
await figma.loadAllPagesAsync();const all=figma.root.findAll();
const nodes=all.filter(n=>n.type!=='PAGE').map(n=>({id:n.id,name:n.name,type:n.type,parent:n.parent.id,x:n.x,y:n.y,w:n.width,h:n.height,layoutMode:n.layoutMode,layoutSizingHorizontal:n.layoutSizingHorizontal,layoutSizingVertical:n.layoutSizingVertical,primaryAxisAlignItems:n.primaryAxisAlignItems,layoutPositioning:n.layoutPositioning,itemSpacing:n.itemSpacing,paddingTop:n.paddingTop,paddingBottom:n.paddingBottom,paddingLeft:n.paddingLeft,paddingRight:n.paddingRight,children:'children'in n?n.children.map(c=>c.id):undefined,fills:'fills'in n&&n.fills!==figma.mixed?n.fills:undefined,reactions:'reactions'in n?n.reactions:undefined}));
save('headings-before.json',{name:figma.root.name,pages:figma.root.children.map(p=>({id:p.id,name:p.name})),fonts:(await figma.listAvailableFontsAsync()).filter(f=>f.fontName.family==='Manrope'),nodes});
}catch(e){save('headings-error.json',{error:String(e),stack:e.stack});}};figma.ui.postMessage({type:'ready'});
