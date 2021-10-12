import { template } from 'lodash'
import { SERVICE_DIRECTORY, SERVICE_RUN_FILES_UTILS, SERVICE_SHELL, SERVICE_SHELL_PARAMS } from '../../services'
import ServiceLocator from '../ServiceLocator'
import path from 'path';

/**
 * This service is responsible for creating a test server for all runs, 
 */
export default class RunService {

  private runFilesUtils: SERVICE_RUN_FILES_UTILS;

  constructor(runFilesUtils: SERVICE_RUN_FILES_UTILS){

    this.runFilesUtils = runFilesUtils;
  }

  private getPathToModifiedRun(runPath){

    const dirName = path.dirname(runPath);
    const baseName = path.parse(runPath).name;

    const _pathToModifiedRun = path.join(dirName,this.runFilesUtils.getPlaygroundFilePrexixWithoutExt(baseName));
    return _pathToModifiedRun;
  }

  /**
   * Create a run server file
   */
  public async generateRunServer(projectDisPath: string, runFilePath: string){

    const directoryManager = await ServiceLocator
      .get<SERVICE_DIRECTORY>(SERVICE_DIRECTORY);

    const pathToStartScriptFolder = path.join(__dirname, './run-server-template');
    const directory = await directoryManager.getDirectory(pathToStartScriptFolder);

    const startScriptContent = await directory.readFile('start.__play__.ts');
    const compiled = template(startScriptContent);
    const script = compiled({
      id: '',
      runFilePath: this.getPathToModifiedRun(runFilePath)
    });

    const projectDirectory = await directoryManager.getDirectory(projectDisPath);
    
    await projectDirectory.createFile('start.__play__.ts', script)

    
  }

  /**
   * Start the generated server
   * 
   * @param projectDisPath 
   */
  public async startRunServer(projectDisPath: string) {

    let collectedData = {};

    let shell = await ServiceLocator
      .get<SERVICE_SHELL, SERVICE_SHELL_PARAMS>(SERVICE_SHELL, {
        command: './node_modules/.bin/ts-node'
      });

    return await new Promise((res, rej) => {
      shell.execCommandAsStream([
        path.join(projectDisPath, 'start.__play__.ts')
      ], {}, {
        onStdoutData(data) {

          try {
            const dataString: string = data.toString();
            const strip = dataString.split(/\r?\n/);
  
  
            strip.forEach((line) => {
  
              if((line as string).indexOf('[__$pl_data__]') > -1){
                
                let strip: any = line.replace('[__$pl_data__]', '').trim();
                
                console.log('strip', strip)

                let data = JSON.parse(strip);

                collectedData[data.id] = data;
              }
  
            });
          } catch(e){

            console.log("Error while trying to parse the result:", e);
            throw e;
          }
        },
        onStderrData(data){

          console.log('Error while starting the server', data.toString());
        },
        onError(data){

          console.log('Error while starting the server', data);
        },
        onClose(code, signal){

          if(code !== 0){
            return rej(`Error while starting the server. Program exit with code ` + code);
          }
          
          res(collectedData);
        }
      })
    })

  }
}