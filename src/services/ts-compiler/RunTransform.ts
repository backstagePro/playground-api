import ts from "typescript";
import { SERVICE_ID_GENERATOR } from "../../services";
import ServiceLocator from "../ServiceLocator";
import AstTsTransformer from "./AstTsTransformer";

/**
 * Used to transform typescript file for showing the data inside 
 * when the code run.
 */
export default class RunTransform extends AstTsTransformer {

  private modifyMap: {
    logs: boolean,
    imports: boolean | {
      replaceImport: (importString) => string
    }
  } = {
    'logs': false,
    'imports': false
  };

  public setImportModify(replaceImport: (importString) => string){

    this.modifyMap.imports = {
      replaceImport
    };
  }

  public setLogsModify(){
    this.modifyMap.logs = true;
  }

  /**
   * Modify the program depends on `modifyMap` var
   * 
   * @returns 
   */
  public async modifyProgram(
    identifier: string,
    fileRelPath: string, // path relative to project
  ) : Promise<string> {

    const idGenerator = await ServiceLocator.get<SERVICE_ID_GENERATOR>(SERVICE_ID_GENERATOR);

    return this.trasform((node, context) => {

      /**
       * REPLACE IMPORTANT STATEMENTS WITH THE NEW FILE PATHS
       */
      if(ts.isStringLiteral(node) && this.modifyMap.imports !== false){

        let parent = this.findParentOf(node, (_node) => {

          if(ts.isImportDeclaration(_node)){
            return true;
          }

          return false;

        });

        if(parent !== null){

          return context.factory.createStringLiteral(
            (this.modifyMap.imports as any).replaceImport(node.getText())
          );
        }

      }

      /**
       * ADD LOGS
       */
      if((ts.isVariableStatement(node) || ts.isExpressionStatement(node)) && this.modifyMap.logs !== false){
  
        let identNode = this.findFirstChild(node, (_node) => {
  
          if(ts.isIdentifier(_node)){
            return true;
          }
  
          return false;
        });
  
        return [
          node, // orignal node  
  
          context.factory.createExpressionStatement(context.factory.createCallExpression(
            context.factory.createIdentifier(`__show__${identifier}`),
            undefined,
            [context.factory.createObjectLiteralExpression(
              [
                context.factory.createPropertyAssignment(
                  context.factory.createIdentifier("variableName"),
                  context.factory.createStringLiteral(identNode.getText().trim())
                ),
                context.factory.createPropertyAssignment(
                  context.factory.createIdentifier("id"),
                  context.factory.createStringLiteral(idGenerator.generateId())
                ),
                context.factory.createPropertyAssignment(
                  context.factory.createIdentifier("filePath"),
                  context.factory.createStringLiteral(fileRelPath)
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

        const match = /id: "(.*?)"/.exec(jsonData);

        return `<%= ${match[1]} %>`;
    })
  }
}