figma.showUI(__html__,{width:340,height:160});
figma.ui.onmessage=async m=>{if(m.type==='close')return figma.closePlugin();if(m.type!=='build')return;try{
 await figma.loadAllPagesAsync();
 const all=figma.root.findAll();
 const roots=['4:1162','4:1394','4:1611','4:1660'];
 const report={name:figma.root.name,pages:figma.root.children.map(n=>({id:n.id,name:n.name})),counts:{},texts:[],roots:[],components:[],styles:[],variables:[],reactions:[]};
 const owned=n=>{let p=n.parent;while(p&&p.type!=='PAGE'){if(p.type==='INSTANCE')return false;p=p.parent;}return true;};
 for(const n of all){report.counts[n.type]=(report.counts[n.type]||0)+1;if(n.type==='TEXT'&&owned(n))report.texts.push({id:n.id,name:n.name,chars:n.characters.slice(0,60),w:n.width,h:n.height,font:n.fontSize,line:n.lineHeight,hsize:n.layoutSizingHorizontal,vsize:n.layoutSizingVertical,grow:n.layoutGrow,align:n.layoutAlign,minh:n.minHeight,reactions:n.reactions,parent:n.parent.id});if('reactions'in n&&n.reactions.length)report.reactions.push({id:n.id,reactions:n.reactions});if(n.type==='COMPONENT_SET'||(n.type==='COMPONENT'&&n.parent.type!=='COMPONENT_SET'))report.components.push({id:n.id,name:n.name,props:n.componentPropertyDefinitions});}
 for(const id of roots){const n=await figma.getNodeByIdAsync(id);report.roots.push({id,w:n.width,h:n.height,children:n.children.map(x=>({id:x.id,name:x.name,x:x.x,y:x.y,w:x.width,h:x.height}))});}
 report.styles=(await figma.getLocalTextStylesAsync()).map(x=>({id:x.id,name:x.name})); report.variables=(await figma.variables.getLocalVariableCollectionsAsync()).map(x=>({id:x.id,name:x.name}));
 figma.ui.postMessage({type:'save',name:'wireframe-before.json',data:report});
}catch(e){figma.ui.postMessage({type:'save',name:'wireframe-error.json',data:{error:String(e),stack:e.stack}});}};
figma.ui.postMessage({type:'ready'});
