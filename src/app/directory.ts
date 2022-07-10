// Interface passed by the tree-list user
export interface Directory{
    id:number,
    parentId:number|null,
    name:string
}

// Interface used inside the tree-list
export interface TreeDirectory{
    id:number,
    parentId:number|null,
    name:string,
    // To refresh a child component when a tree structure changes, having a children property is much easier to let angular know when to refresh
    children:TreeDirectory[]
}