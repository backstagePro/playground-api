
export default class Project {

  /**
   * The path to the project
   */
  private path: string;
  
  constructor( { path }: { path: string } ){

    this.path = path;
  }
}