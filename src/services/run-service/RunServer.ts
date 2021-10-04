import { template } from 'lodash'
import { SERVICE_DIRECTORY, SERVICE_SHELL, SERVICE_SHELL_PARAMS } from '../../services'
import ServiceLocator from '../ServiceLocator'
import path from 'path';

/**
 * This service is responsible for creating a test server for all runs, 
 */
export default class RunService {

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
      id: 'dada',
      runFilePath
    });

    const projectDirectory = await directoryManager.getDirectory(projectDisPath);
    
    await projectDirectory.createFile('start.__play__.ts', script)

    
  }

  /**
   * Start the generated server
   * 
   * @param projectDisPath 
   */
  public async startRunServer(projectDisPath: string){

    let shell = await ServiceLocator
      .get<SERVICE_SHELL, SERVICE_SHELL_PARAMS>(SERVICE_SHELL, {
        command: './node_modules/.bin/ts-node'
      });

    await new Promise((res, rej) => {
      shell.execCommandAsStream([
        path.join(projectDisPath, 'start.__play__.ts')
      ], {}, {
        onStdoutData(data) {
          debugger;

          console.log(data.toString());
        },
        onStderrData(data){
          debugger;

          console.log(data.toString());
        },
        onError(data){
          debugger;
          data;
        },
        onClose(code, signal){
          debugger;

          if(code !== 0){
            return rej();
          }

          res(void(0))
        }
      })
    })

  }
}