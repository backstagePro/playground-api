import ts from "typescript";
import { SERVICE_ID_GENERATOR } from "../../services";
import ServiceLocator from "../ServiceLocator";
import AstTsTransformer from "./AstTsTransformer";
import AbstractRunTransformer from "./run-transformers/abstract/AbstractRunTransformer";
import TransformEvent from "./run-transformers/events/TransformEvent";

/**
 * Used to transform typescript file for showing the data inside 
 * when the code run.
 */
export default class RunTransform extends AstTsTransformer {

  private transformers: AbstractRunTransformer[];

  constructor(filePath: string, transformers: AbstractRunTransformer[]){
    super(filePath);

    this.transformers = transformers;
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

      // @TODO - performance issues
      for(let i = 0, len = this.transformers.length; i < len; i += 1){
        
        const transformer = this.transformers[i];
        
        if(transformer.nodeTypeTest(node)){

          const fileFilter = transformer.getFileRegex();

          const fileName = this.getFileName();
  
          // filter for which file to be applied transformer
          if(fileFilter === null || (fileFilter && fileFilter.test(fileName))){

            let transformEvent = new TransformEvent({ 
              context, 
              node,
              fileName: fileName, 
              relFilePath: fileRelPath,
              sourceFile: this.getSourceFile(), 
              idGenerator 
            });

            return this.transformers[i].transform(node, transformEvent);
          }

        }
        
      }

      // return node if it is not transformed
      return node;
    }, {printProgram: true}) as string;


    // return this.trasform((node, context) => {

    //   /**
    //    * REPLACE IMPORTANT STATEMENTS WITH THE NEW FILE PATHS
    //    */
    //   if(ts.isStringLiteral(node) && this.modifyMap.imports !== false){

    //     let parent = this.findParentOf(node, (_node) => {

    //       if(ts.isImportDeclaration(_node)){
    //         return true;
    //       }

    //       return false;

    //     });

    //     if(parent !== null){

    //       return context.factory.createStringLiteral(
    //         (this.modifyMap.imports as any).replaceImport(node.getText())
    //       );
    //     }

    //   }

    //   /**
    //    * ADD LOGS
    //    */
    //   if((ts.isVariableStatement(node) || ts.isExpressionStatement(node)) && this.modifyMap.logs !== false){
  
    //     let identNode = this.findFirstChild(node, (_node) => {
  
    //       if(ts.isIdentifier(_node)){
    //         return true;
    //       }
  
    //       return false;
    //     });
  
    //     return [
    //       node, // orignal node  
  
    //       context.factory.createExpressionStatement(context.factory.createCallExpression(
    //         context.factory.createIdentifier(`__show__${identifier}`),
    //         undefined,
    //         [context.factory.createObjectLiteralExpression(
    //           [
    //             context.factory.createPropertyAssignment(
    //               context.factory.createIdentifier("variableName"),
    //               context.factory.createStringLiteral(identNode.getText().trim())
    //             ),
    //             context.factory.createPropertyAssignment(
    //               context.factory.createIdentifier("id"),
    //               context.factory.createStringLiteral(idGenerator.generateId())
    //             ),
    //             context.factory.createPropertyAssignment(
    //               context.factory.createIdentifier("filePath"),
    //               context.factory.createStringLiteral(fileRelPath)
    //             ),
    //             context.factory.createPropertyAssignment(
    //               context.factory.createIdentifier("val"),
    //               context.factory.createIdentifier(identNode.getText().trim())
    //             )
    //           ],
    //           false
    //         )]
    //       ))
    //     ];
    //   }
  
    //   return node;
    // }, 
    // { printProgram: true }
    // ) as string;
  }

  /**
   * 
   * Replace  __show__<id>({ id: "b", val: b }) with <%= b %>
   * 
   * @param program
   * @param id 
   * @returns 
   */
  // public getReplacedProgram(program: string, id: string){


  //   return program.replace(new RegExp(`__show__${id}\((.*)\)`, 'gi'), function(a, b, c, d){

  //       const jsonData = b.substring(1, b.length-2);

  //       const match = /id: "(.*?)"/.exec(jsonData);

  //       return `<%= ${match[1]} %>`;
  //   })
  // }
}