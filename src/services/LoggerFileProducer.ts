import { IRunSessionFileData } from "../model/entities/RunSession";
import path from 'path';
import ServiceLocator from "./ServiceLocator";
import { SERVICE_DIRECTORY, SERVICE_RUN_FILES_UTILS } from "../services";


export default class LoggerFileProducer {

  private projectPath: string;

  private runFilesUtils: SERVICE_RUN_FILES_UTILS;

  constructor(projectPath: string, runFileUtils: SERVICE_RUN_FILES_UTILS){

    this.projectPath = projectPath;
    this.runFilesUtils = runFileUtils;
  }

  /**
   * Generate all the modified files with logs inside of them
   * 
   * @param fileData 
   */
  public async createModifierFiles( filesData: IRunSessionFileData  ){

    let filePaths = Object.keys(filesData);
    let directoryManager = await ServiceLocator
      .get<SERVICE_DIRECTORY>(SERVICE_DIRECTORY);

    let projectDirectory = await directoryManager
      .getDirectory(this.projectPath);

    for(let i = 0, len = filePaths.length; i < len; i += 1){
      const _fileData = filesData[filePaths[i]];
      const _filePath = filePaths[i];

      const dirName = path.dirname(_filePath);
      const baseName = path.parse(_filePath).name;

      const newPath = path.join( dirName, this.runFilesUtils.getPlaygroundFilePrefix(baseName) );

      debugger;
      await projectDirectory.createFile(newPath, _fileData.modifiedFile);
    }

  }

  /**
   * Clean up all generated playground files
   */
  public cleanUpGeneratedFiles(){

  }
}