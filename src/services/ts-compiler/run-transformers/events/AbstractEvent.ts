import ts from 'typescript';

export default class AbstractEvent {
 
  /**
   * 
   * Find a parent node for which the predicate function returns `true`
   * 
   * @param node - current note
   * @param predicate - function to test the parent node
   */
  public findParentOf(node: ts.Node, predicate: (node: ts.Node) => any){

    if(node.parent){
      
      if(predicate(node.parent)){
          return node.parent;
      }

      else {
          return this.findParentOf(node.parent, predicate);
      }

    } else {
      return null;
    }

  }

  /**
   * For given parent node, find all children for which the `predicate` function returns true
   * 
   * This function will iterate all children deep in the tree.
   * 
   * @param parent 
   * @param predicate 
   */
  public findChildren(parent: ts.Node, predicate: (node: ts.Node) => boolean, result = []){

    parent.getChildren().forEach((child) => {

      if(predicate(parent)){
        result.push(parent);
      }

      if(child.getChildren().length){

        child.getChildren().forEach((_child) => {
          if(predicate(_child)){
            result.push(_child);
          }   

          this.findChildren(_child, predicate, result);
        })
      }
    })

    return result;
  }

  /**
   * 
   * @param node 
   * @param cb 
   * @param depth 
   */
  public forEachChild(node: ts.Node, cb: (node: ts.Node, depth: number) => void, depth = 0) {

    cb(node, depth);

    
    depth++;


    node.getChildren().forEach(c=> this.forEachChild(c, cb, depth));
  }

  /**
   * Same as `findChildren()` but will return the first found node.
   * 
   * This function will iterate all children deep in the tree.
   * 
   * @param parent 
   * @param predicate 
   * @returns 
   **/
  public findFirstChild(parent: ts.Node, predicate: (node: ts.Node) => boolean): ts.Node | null {

    let parentChildren = parent.getChildren();

    for(let i = 0, len = parentChildren.length; i < len; i += 1){
      let childNode = parentChildren[i];

      if(predicate(childNode)){
        return childNode;
      }

      let childNodeChildren = childNode.getChildren();

      for(let j = 0, lenJ = childNodeChildren.length; j < lenJ; j += 1){

        let _child = childNodeChildren[j];

        if(predicate(_child)){
          return _child;
        }
        
        let result = this.findFirstChild(_child, predicate);
        if(result !== null){
          return result;
        }
      }
    }

    return null;
  }
}