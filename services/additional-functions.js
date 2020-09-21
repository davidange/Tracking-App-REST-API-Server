/**
 * Function to unflatten the Object Tree to an Array
 * @param {JSON} objectTree JSON Object Tree to unflatten
 * @param {String} key Key that has children of Node in Tree
 * @returns {Array} Array of all nodes of tree 
 */
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