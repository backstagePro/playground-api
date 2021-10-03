
/**
 * This service is responsible for creating a test server for all runs, 
 */
export default class RunService {


  /**
   * Create a run server file
   */
  public async generateRunServer(projectDisPath: string){

    // test shell service
    // let shell = await ServiceLocator.get<SERVICE_SHELL, SERVICE_SHELL_PARAMS>(SERVICE_SHELL, {command: 'ls'});

    

  }

  /**
   * Start the generated server
   * 
   * @param projectDisPath 
   */
  public async startRunServer(projectDisPath: string){

  }
}