import ts from "typescript";
import { SERVICE_ID_GENERATOR, SERVICE_RUN_FILES_UTILS } from "../../services";
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
    const runFileUtils = await ServiceLocator.get<SERVICE_RUN_FILES_UTILS>(SERVICE_RUN_FILES_UTILS);

    return this.trasform((node, context) => {

      // @TODO - performance issues
      for(let i = 0, len = this.transformers.length; i < len; i += 1){
        
        const transformer = this.transformers[i];

        const fileName = this.getFileName();

        // create a transform event
        let transformEvent = new TransformEvent({ 
          context, 
          node,
          fileName: fileName, 
          relFilePath: fileRelPath,
          sourceFile: this.getSourceFile(),
          
          // services
          // @TODO - think about making the transform method to be async
          idGenerator,
          runFileUtils
        });
        
        if(transformer.nodeTypeTest(node, transformEvent)){

          const fileFilter = transformer.getFileRegex();
  
          console.log(`[REGEX TEST] Testing file " ${fileName} " for transforms with filter ${fileFilter} return ${fileFilter.test(fileName)}`);

          if(fileFilter){
            fileFilter.lastIndex = 0;
          }

          // filter for which file to be applied transformer
          if(fileFilter === null || (fileFilter && fileFilter.test(fileName))){

            return this.transformers[i].transform(node, transformEvent);
          }
        }
      }

      // return node if it is not transformed
      return node;
    }, {printProgram: true}) as string;
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