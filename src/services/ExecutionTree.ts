import path from 'path';
import { IRunSessionExecTree } from "../model/entities/RunSession";
import { SERVICE_TRANSFORMER_FACTORY } from "../services";

export default class FileImportTree {

  private transformerFactory: SERVICE_TRANSFORMER_FACTORY;

  private projectPath: string;

  constructor(projectPath: string, transformerFactory: SERVICE_TRANSFORMER_FACTORY){

    this.transformerFactory = transformerFactory; 
    this.projectPath = projectPath;
  }

  /**
   * Used to generate the `execution tree` structure
   * 
   * @param fullPathToRootFile -  this is the path to root ts file, 
   * from where the program start
   */
   public async generateFileImportTree(
    fullPathToRootFile: string,
    jsonMap = {root: null, children: {}}
  ) : Promise<IRunSessionExecTree> {

    let loggerTransformer = this.transformerFactory.getTransformer('logger', {
      filePath: fullPathToRootFile
    });

    let allImports: {path: string}[] = loggerTransformer.getAllImportStatement();

    for(let i = 0, len = allImports.length; i < len; i += 1){
      let importPath = allImports[i];
      
      // abs path to file
      let fullImportPath = path.join(path.dirname(fullPathToRootFile), importPath.path ) + '.ts';

      // relative paths which will be saved in database
      let relativeProjectPath = path.relative(
        this.projectPath, path.join(path.dirname(fullPathToRootFile), importPath.path )
      ) + '.ts' 

      let relativeServicePath = path.relative(
        this.projectPath,
        fullPathToRootFile
      )

      // initialize
      if( jsonMap.children[relativeServicePath] === void(0) ){
        jsonMap.children[relativeServicePath] = []
      }

      jsonMap.children[relativeServicePath].push(relativeProjectPath)

      // collect data for children files
      await this.generateFileImportTree(fullImportPath, jsonMap);
    }

    return jsonMap;
  }

  public iterateExecutionTree(tree: IRunSessionExecTree, cb: (treeNode) => void) {
    
    const recur = ( root ) => {
      
      cb(root);

      if(tree.children[root]){
        tree.children[root].forEach((child) => {
          recur(child);
        });
      }
    };

    recur(tree.root);

  }

}