import ts from "typescript";
import AstTsTransformer from "./AstTsTransformer";

export default class LoggerTransform extends AstTsTransformer {

  /**
   * Add logs to file 
   * 
   * @returns 
   */
  public addLogs(identifier: string, replaceImport: (importString) => string) : string {

    return this.trasform((node, context) => {

      /**
       * REPLACE IMPORTANT STATEMENTS WITH THE NEW FILE PATHS
       */
      if(ts.isStringLiteral(node)){

        let parent = this.findParentOf(node, (_node) => {

          if(ts.isImportDeclaration(_node)){
            return true;
          }

          return false;

        });

        if(parent !== null){

          return context.factory.createStringLiteral(replaceImport(node.getText()));
        }

      }

      /**
       * ADD LOGS
       */
      if(ts.isVariableStatement(node) || ts.isExpressionStatement(node)){
  
        let identNode = this.findFirstChild(node, (_node) => {
  
          if(ts.isIdentifier(_node)){
            return true;
          }
  
          return false;
        });
  
        return [
          node, // orignal node  
  
          context.factory.createExpressionStatement(context.factory.createCallExpression(
            context.factory.createIdentifier("__show__dada"),
            undefined,
            [context.factory.createObjectLiteralExpression(
              [
                context.factory.createPropertyAssignment(
                  context.factory.createIdentifier("id"),
                  context.factory.createStringLiteral(identNode.getText().trim())
                ),
                context.factory.createPropertyAssignment(
                  context.factory.createIdentifier("val"),
                  context.factory.createIdentifier(identNode.getText().trim())
                )
              ],
              false
            )]
          ))
        ];
      }
  
      return node;
    }, 
    { printProgram: true }
    ) as string;
  }

  /**
   * 
   * Replace  __show__<id>({ id: "b", val: b }) with <%= b %>
   * 
   * @param program
   * @param id 
   * @returns 
   */
  public getReplacedProgram(program: string, id: string){


    return program.replace(new RegExp(`__show__${id}\((.*)\)`, 'gi'), function(a, b, c, d){

        const jsonData = b.substring(1, b.length-2);

        const match = /id: "(.*)"/.exec(jsonData);

        return `<%= ${match[1]} %>`;
    })
  }
}