
import { IArtefact } from "../../model/entities/Artefact";
import { IProject } from "../../model/entities/Project";
import { IRun } from "../../model/entities/Run";
import { SERVICE_REPOSITORY_FACTORY, SERVICE_SHELL, SERVICE_SHELL_PARAMS, SERVICE_TRANSFORMER_FACTORY } from "../../services";
import path from 'path';
import ServiceLocator from "../ServiceLocator";

export default class RunGenerator {

  private repositoryFactory: SERVICE_REPOSITORY_FACTORY;

  private transformerFactory: SERVICE_TRANSFORMER_FACTORY;

  constructor( 
    transofrmerFactory: SERVICE_TRANSFORMER_FACTORY,
    repositoryFactory: SERVICE_REPOSITORY_FACTORY,
  ){

    this.transformerFactory = transofrmerFactory;

    this.repositoryFactory = repositoryFactory;
  }

  /**
   * Returns Project entity
   * 
   * @param projectId 
   * @returns 
   */
  private async getProject(projectId: string){

    let projectRepository = await this.repositoryFactory.getRepository('project');

    let project = await projectRepository.findOne(projectId);

    return project;
  }

  /**
   * Returns Artefact entity
   * 
   * @param artefactId 
   * @returns 
   */
  private async getArtefact(artefactId: string){

    let artefactRepository = await this.repositoryFactory.getRepository('artefact');

    let artefact = await artefactRepository.findOne(artefactId);

    return artefact;
  }

  /**
   * Returns Run entity
   * 
   * @param runId 
   * @returns 
   */
  private async getRun(runId: string){
    
    let runRepository = await this.repositoryFactory.getRepository('run');

    let run = await runRepository.findOne(runId);

    return run;
  }

  /**
   * Used to generate the `execution tree` structure
   * 
   * @param fullPathToRootFile -  this is the path to root ts file, 
   * from where the program start
   */
  public async generateExecutionTree(fullPathToRootFile: string, jsonMap = {root: null, children: {}}) : Promise<{
    root: string,
    children: { [filePathString: string]: string[] }
  }> {

    let loggerTransformer = this.transformerFactory.getTransformer('logger', {
      filePath: fullPathToRootFile
    });

    let allImports: {path: string}[] = loggerTransformer.getAllImportStatement();

    for(let i = 0, len = allImports.length; i < len; i += 1){
      let importPath = allImports[i];

      let fullImportPath = path.join(path.dirname(fullPathToRootFile), importPath.path ) + '.ts';

      // initialize
      if( jsonMap.children[fullPathToRootFile] === void(0) ){
        jsonMap.children[fullPathToRootFile] = []
      }

      jsonMap.children[fullPathToRootFile].push(fullImportPath)

      // collect data for children files
      await this.generateExecutionTree(fullImportPath, jsonMap);
    }

    return jsonMap;
  }

  /**
   * Creates needed data for each provided file path
   * 
   * @param fullPathToRootFile - the path to the root ts file
   */
  public async populateFileData(filePath: string){

    let loggerTransformer = this.transformerFactory.getTransformer('logger', {
      filePath: filePath
    });

    let modifiedFile = loggerTransformer.addLogs('dada');

    let replacedFile = loggerTransformer.getReplacedProgram(modifiedFile, 'dada');

    return {
      // will be run on the server
      modifiedFile: modifiedFile,

      // will be displayed in the broweser
      filePreview: replacedFile
    }

    // const data = {
    //   children:[],
    //   filePreview: replacedOutput,
    //   fileWithLogs: modifiedFile
    // }

    // fileMap.push({
    //     [fullPath]: data
    // });

    // let imports = loggerTransformer.getAllImportStatement();

    // for(let i = 0, len = imports.length; i < len; i += 1){

    //   let importedFilePath = path.join(path.dirname(fullPath), imports[i].path) + '.ts';
      
    //   await this.processFile(importedFilePath, data.children);


    // }

  }

  private iterateExecutionTree(tree: { 
    root: string,
    children: { [filePathString: string]: string[] }
  }, cb: (treeNode) => void) {

    
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

  public async populateExecutionTree( tree: { 
    root: string,
    children: { [filePathString: string]: string[] }
  }){

    let fileData = {};
    let allPaths = [];

    this.iterateExecutionTree(tree, (treeNode) => {

      allPaths.push(treeNode);
    });

    for(let i = 0, len = allPaths.length; i < len; i += 1){
      fileData[allPaths[i]] = await this.populateFileData(allPaths[i]);
    }

    return fileData;
  }

  /**
   * Generate run server in the directory of the project
   */
  public async generateRunServer(projectPath: string){

  }

  public async startRunSession(runId: string) {

    const run: IRun = await this.getRun(runId);
    const artefact: IArtefact = await this.getArtefact(run.artefactId);
    const project: IProject = await this.getProject(artefact.projectId);

    let fullPathToRun = path.join(project.path, artefact.path);
    let fullPathToService = path.resolve( path.dirname(path.join(project.path, artefact.path)), artefact.servicePath);

    // [1] GENERATE EXECUTION TREE
    const executionTree = await this.generateExecutionTree(fullPathToService);
    executionTree.root = fullPathToService;

    debugger;

    const fileData = await this.populateExecutionTree(executionTree);

    debugger;

    // const fileMap = [];

    // // clone the files 
    // await this.processFile(fullPathToService, fileMap);

    // return fileMap;
  }

  public async processFile( fullPath: string, fileMap ) {

    
  }
}