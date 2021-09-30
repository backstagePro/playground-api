import ts from "typescript";
import AstTsTransformer from "./AstTsTransformer";

export default class LoggerTransform extends AstTsTransformer {

  /**
   * Add logs to file 
   * 
   * @returns 
   */
  public addLogs(){

    this.printAllChildren(this.getSourceFile());

    return this.trasform((node, context) => {

      if(ts.isVariableStatement(node) || ts.isExpressionStatement(node)){
  
        let result = this.findFirstChild(node, (_node) => {
  
          if(ts.isIdentifier(_node)){
            return true;
          }
  
          return false;
        });
  
        return [
          node, // orignal node  
  
          context.factory.createCallExpression( // log node
            context.factory.createPropertyAccessExpression(
              context.factory.createIdentifier("console"),
              context.factory.createIdentifier("log")
            ),
            undefined,
            [context.factory.createIdentifier(result.getText())]
          )
        ];
      }
  
      return node;
    }, 
    { printProgram: true }
    );
  }
}