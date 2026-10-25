import type {StoreMap,PathNode,PathEdge,Product,Shelf} from './types.ts';
export function seedStore():StoreMap{
 const nodes:PathNode[]=[],edges:PathEdge[]=[],shelves:Shelf[]=[],products:Product[]=[];
 const names=['Fasteners','Paint & finishes','Plumbing','Electrical','Hand tools','Garden'];
 const catalogue=[['M8 bolts','Hex nuts M8','Steel washers','Wall plugs','Wood screws','Cable ties'],['Paint brush','Roller tray','Masking tape','White emulsion','Wood varnish','Sandpaper'],['Copper elbow','PTFE tape','Pipe cutter','Sink trap','Tap washer','Drain cleaner'],['LED bulb','Socket outlet','Wire connector','Extension lead','Circuit tester','Electrical tape'],['Claw hammer','Spirit level','Tape measure','Screwdriver set','Adjustable spanner','Safety glasses'],['Garden gloves','Pruning shears','Watering can','Hose connector','Plant feed','Garden trowel']];
 const ys=[120,290,420,570,720],suffix=['north','upper','cross','lower','south'];
 for(let a=0;a<6;a++){
  const x=180+a*160;for(let j=0;j<5;j++){const checkpoint=j===2&&a%2===1;nodes.push({id:checkpoint?`cp-aisle-${a+1}`:`a${a+1}-${suffix[j]}`,x,y:ys[j],type:checkpoint?'checkpoint':'walkway',label:`Aisle ${a+1} · ${j===2?'cross aisle':suffix[j]}`});}
  const aisleNodes=nodes.slice(-5);for(let j=0;j<4;j++)edges.push({id:`vertical-${a}-${j}`,from:aisleNodes[j].id,to:aisleNodes[j+1].id,blocked:false});
  for(let s=0;s<2;s++){const letter=String.fromCharCode(65+a),id=`${letter}${s+1}`;shelves.push({id,name:`Shelf ${id}`,aisle:`Aisle ${a+1} · ${names[a]}`,x:x+34,y:s===0?200:460,width:92,height:180,accessNodeId:`a${a+1}-${s===0?'upper':'lower'}`});for(let k=0;k<3;k++){const n=s*3+k;products.push({id:`product-${a}-${n}`,sku:`HW-${a+1}${String(n+1).padStart(3,'0')}`,name:catalogue[a][n],category:names[a],aliases:catalogue[a][n]==='M8 bolts'?['bolts M8','8mm bolt','metric bolts']:catalogue[a][n]==='Wall plugs'?['rawl plugs','anchors']:catalogue[a][n]==='Paint brush'?['paintbrush','brush']:[],shelfId:id,stock:n===4?'low':n===5&&a===5?'unavailable':n===5?'unknown':'available'});}}
 }
 for(let a=0;a<5;a++)for(const j of [0,2,4]){const from=nodes[a*5+j],to=nodes[(a+1)*5+j];edges.push({id:`cross-${a}-${j}`,from:from.id,to:to.id,blocked:false});}
 nodes.push({id:'entrance',x:80,y:790,type:'entrance',label:'Main entrance'},{id:'checkout',x:1100,y:790,type:'checkout',label:'Checkout'});
 edges.push({id:'entry',from:'entrance',to:'a1-south',blocked:false},{id:'exit',from:'a6-south',to:'checkout',blocked:false});
 return {id:'demo-hardware',slug:'demo-hardware',name:'Northline Hardware',width:1200,height:860,nodes,edges,shelves,products,revision:1};
}
