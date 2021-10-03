
import { IArtefact } from "../../model/entities/Artefact";
import { IProject } from "../../model/entities/Project";
import { IRun } from "../../model/entities/Run";
import { SERVICE_REPOSITORY_FACTORY, SERVICE_SHELL, SERVICE_SHELL_PARAMS, SERVICE_TRANSFORMER_FACTORY } from "../../services";
import path from 'path';
import ServiceLocator from "../ServiceLocator";

export default class RunGenerator {

  private repositoryFactory: SERVICE_REPOSITORY_FACTORY;

  private transofrmerFactory: SERVICE_TRANSFORMER_FACTORY;

  constructor( 
    transofrmerFactory: SERVICE_TRANSFORMER_FACTORY,
    repositoryFactory: SERVICE_REPOSITORY_FACTORY,
  ){

    this.transofrmerFactory = transofrmerFactory;

    this.repositoryFactory = repositoryFactory;
  }

  private async getProject(projectId: string){

    let projectRepository = await this.repositoryFactory.getRepository('project');

    let project = await projectRepository.findOne(projectId);

    return project;
  }

  private async getArtefact(artefactId: string){

    let artefactRepository = await this.repositoryFactory.getRepository('artefact');

    let artefact = await artefactRepository.findOne(artefactId);

    return artefact;
  }

  private async getRun(runId: string){
    
    let runRepository = await this.repositoryFactory.getRepository('run');

    let run = await runRepository.findOne(runId);

    return run;
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

    const fileMap = [];

    // clone the files 
    await this.processFile(fullPathToService, fileMap);

    return fileMap;
  }

  public async processFile( fullPath: string, fileMap ) {

    // get transformer
    const transformerFactory = await ServiceLocator.get<SERVICE_TRANSFORMER_FACTORY>(SERVICE_TRANSFORMER_FACTORY)

    let loggerTransformer = transformerFactory.getTransformer('logger', {filePath: fullPath});

    let modifiedFile = loggerTransformer.addLogs('dada');

    let replacedOutput = loggerTransformer.getReplacedProgram(modifiedFile, 'dada');

    const data = {
      children:[],
      filePreview: replacedOutput,
      fileWithLogs: modifiedFile
    }

    fileMap.push({
        [fullPath]: data
    });

    let imports = loggerTransformer.getAllImportStatement();

    for(let i = 0, len = imports.length; i < len; i += 1){

      let importedFilePath = path.join(path.dirname(fullPath), imports[i].path) + '.ts';
      
      await this.processFile(importedFilePath, data.children);


    }
  }
}