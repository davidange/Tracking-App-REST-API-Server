
const flatten=(objectTree,key)=>{
    let unflattenTree=[objectTree];
    let counter=0;
    while(counter<unflattenTree.length){
       
        const child=unflattenTree[counter][key];
        if(child){
            unflattenTree=[].concat(unflattenTree,unflattenTree[counter][key].flat())
        }
        counter=counter+1;
    }

    return unflattenTree
};

module.exports={flatten};