import { IRunSessionFileData } from "../model/entities/RunSession";
import path from 'path';
import ServiceLocator from "./ServiceLocator";
import { SERVICE_DIRECTORY } from "../services";


export default class LoggerFileProducer {
  private readonly PLAY_FILE_POSTFIX = '__play__.ts';

  private projectPath: string;

  constructor(projectPath: string){

    this.projectPath = projectPath;
  }

  public getPlaygroundFilePrefix(fileName: string){
    
    return `${fileName}.${this.PLAY_FILE_POSTFIX}`;
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

      const newPath = path.join( dirName, this.getPlaygroundFilePrefix(baseName) );

      await projectDirectory.createFile(newPath, _fileData.modifiedFile);
    }

  }
}