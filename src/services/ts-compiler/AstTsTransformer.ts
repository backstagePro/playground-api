
import * as ts from "typescript";
import * as _ from 'lodash';
import Ast from "./Ast";

export default class AstTsTransformer extends Ast {

  /**
   * 
   * Used to transform the AST tree - adding, replacing, removing nodes.
   * 
   * When wanting to modify the AST in any way you need to traverse the tree - recursively. In more concrete terms 
   * we want to visit each node, and then return either the same, an updated, or a completely new node.
   * 
   * ref: https://github.com/madou/typescript-transformer-handbook#manipulation
   * 
   * @param filterFn - return modified ts.Node
   * @param options - print options 
   * 
   * @returns ts.Node or string of changed code (depend if `printProgram` is set to `true`)
   */
  protected trasform(
    filterFn: (node: ts.Node, context: ts.TransformationContext) => any,
    options: { printProgram: boolean } = {
      printProgram: false
    }
   ): ts.Node | string {


    const transformerFactory: ts.TransformerFactory<ts.Node> = (
        context: ts.TransformationContext
    ) => {
      return ( sourceFile ) => {
        function visit(node: ts.Node): ts.Node {
          node = ts.visitEachChild(node, visit, context);

          return filterFn(node, context);
        }

        return ts.visitNode(sourceFile, visit);
      };
    };
    
    const transformationResult = ts.transform(
        this.sourceFile, [transformerFactory]
    );

    if(options.printProgram){
      return this.printer.printNode(ts.EmitHint.Unspecified, transformationResult.transformed[0], this.sourceFile)
    }

    return transformationResult.transformed[0];
  }
}