export type Point={x:number;y:number};
export type PathNode=Point&{id:string;type:'walkway'|'entrance'|'checkout'|'checkpoint';label:string};
export type PathEdge={id:string;from:string;to:string;blocked:boolean;weight?:number};
export type Shelf={id:string;name:string;aisle:string;x:number;y:number;width:number;height:number;accessNodeId:string};
export type Product={id:string;sku:string;name:string;category:string;aliases:string[];shelfId:string;stock:'available'|'low'|'unknown'|'unavailable';imageUrl?:string};
export type StoreMap={id:string;slug:string;name:string;width:number;height:number;scaleMetersPerUnit?:number;nodes:PathNode[];edges:PathEdge[];shelves:Shelf[];products:Product[];revision:number;publishedAt?:string};
export type RouteResult={nodeIds:string[];points:Point[];lengthUnits:number;stopShelfIds:string[];unreachableShelfIds:string[];steps:string[];startNodeId:string;notice?:string;revision:number};
