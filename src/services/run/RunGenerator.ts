
import { IArtefact } from "../../model/entities/Artefact";
import { IProject } from "../../model/entities/Project";
import { IRun } from "../../model/entities/Run";
import { SERVICE_EXECUTION_TREE, SERVICE_EXECUTION_TREE_PARAMS, SERVICE_LOGGER_FILE_PRODUCER, SERVICE_LOGGER_FILE_PRODUCER_PARAMS, SERVICE_REPOSITORY_FACTORY, SERVICE_RUN_GENERATOR, SERVICE_RUN_SERVER, SERVICE_SHELL, SERVICE_SHELL_PARAMS, SERVICE_TRANSFORMER_FACTORY } from "../../services";
import path from 'path';
import ServiceLocator from "../ServiceLocator";
import RunSession, { IRunSessionExecTree, IRunSessionFileData } from "../../model/entities/RunSession";

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
   * Creates needed data for each provided file path.
   * 
   * { modifiedField, filePreview }
   * 
   * @param fullPathToRootFile - the path to the root ts file
   */
  public async createFileInfo(
    filePath: string, 
    
    loggerFileProducer: SERVICE_LOGGER_FILE_PRODUCER,

    options: {
      addLogs: boolean
    } = {
      addLogs: true
    }
  ){

    const runTransformer = this.transformerFactory.getTransformer('logger', {
      filePath: filePath
    });

    if(options.addLogs){

      runTransformer.setLogsModify();
    }

    runTransformer.setImportModify((importStringPath) => {
      

      importStringPath = importStringPath.substring(1, importStringPath.length-1);

      const dirName = path.dirname(importStringPath);
      const baseName = path.parse(importStringPath).name;

      if(dirName === '.'){
        return `./${loggerFileProducer.getPlaygroundFilePrefix(baseName)}`;
      }

      return path.join(dirName, loggerFileProducer.getPlaygroundFilePrefix(baseName));
    });

    let modifiedFile = runTransformer.modifyProgram('dada');
    let replacedFile = runTransformer.getReplacedProgram(modifiedFile, 'dada');

    return {
      // will be run on the server
      modifiedFile: modifiedFile,

      // will be displayed in the broweser
      filePreview: replacedFile
    }

  }

  /**
   * Populate the created execution tree with the file data for each file inside
   * 
   * @param tree 
   * @param projectPath 
   * @param loggerFileProducer 
   * @returns 
   */
  public async populateExecutionTree( 
    tree: IRunSessionExecTree, 
    projectPath: string,
    loggerFileProducer: SERVICE_LOGGER_FILE_PRODUCER,
    runFilePath: string
  ){

    let fileData = {};
    let allPaths = [];

    let exTreeService = await ServiceLocator
      .get<SERVICE_EXECUTION_TREE, SERVICE_EXECUTION_TREE_PARAMS>(
        SERVICE_EXECUTION_TREE,
        {
          projectPath
        }
    );

    exTreeService.iterateExecutionTree(tree, (treeNode) => {

      allPaths.push(treeNode);
    });

    let fullFilePathToRunFile = path.join(projectPath, runFilePath);
    fileData[runFilePath] = await this.createFileInfo(
      fullFilePathToRunFile, 
      loggerFileProducer,
      { 
        addLogs: false
      }
    );

    for(let i = 0, len = allPaths.length; i < len; i += 1){
      let absFilePath = path.join(projectPath, allPaths[i]);
      fileData[allPaths[i]] = await this.createFileInfo(absFilePath, loggerFileProducer);
    }

    return fileData;
  }

  /**
   * Save run session data into db
   * 
   * @param fileData 
   * @param executionTree 
   * @param projectPath 
   * @returns 
   */
  private async saveRunSession(
    fileData: IRunSessionFileData, 
    executionTree: IRunSessionExecTree,
    projectPath: string,
    runPath: string
  ){

    let runSessionRepository = await this.repositoryFactory.getRepository('run-session');

    let runSessionId = await runSessionRepository.create(new RunSession({
      fileData, 
      executionTree,
      projectPath,
      runPath
    }));

    return runSessionId;
  }

  public async startRunSession(runId: string) {

    // get entities
    const run: IRun = await this.getRun(runId);
    const artefact: IArtefact = await this.getArtefact(run.artefactId);
    const project: IProject = await this.getProject(artefact.projectId);

    // get full path to run file
    let fullPathToRun = path.join(project.path, artefact.path);

    // get full path to service (functionality) refered in the run 
    let fullPathToService = path.resolve( path.dirname(path.join(project.path, artefact.path)), artefact.servicePath);

    // get the needed services
    const executionTreeService = await ServiceLocator
      .get<SERVICE_EXECUTION_TREE, SERVICE_EXECUTION_TREE_PARAMS>(
        SERVICE_EXECUTION_TREE,
        {
          projectPath: project.path
        }
    );

    const runServer = await ServiceLocator
      .get<SERVICE_RUN_SERVER>(SERVICE_RUN_SERVER);

    const loggerFileProducer = await ServiceLocator
      .get<SERVICE_LOGGER_FILE_PRODUCER, SERVICE_LOGGER_FILE_PRODUCER_PARAMS>(
        SERVICE_LOGGER_FILE_PRODUCER, {
          projectPath: project.path
        }
    );

    // [1] GENERATE EXECUTION TREE
    const executionTree = await executionTreeService.generateExecutionTree( fullPathToService );
    executionTree.root = path.relative(project.path, fullPathToService);

    // [2] CREATE A FILE DATA
    const fileData = await this.populateExecutionTree(executionTree, project.path, loggerFileProducer, artefact.path);

    // [3] SAVE EXTRACTED DATA TO DATABASE
    await this.saveRunSession(fileData, executionTree, project.path, artefact.path);

    // [5] GENERATE MODIFIED FILES
    await loggerFileProducer.createModifierFiles(fileData);

    // [6] GENERATE START SCRIPT
    await runServer.generateRunServer(project.path, fullPathToRun);

    // [7] RUN THE START SCRIPT
    await runServer.startRunServer(project.path);


  }

}