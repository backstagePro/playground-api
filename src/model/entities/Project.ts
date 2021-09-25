
interface IProjectParams {
  path: string
  artefacts: any
}

export default class Project {

  /**
   * The path to the project
   */
  private path: string;

  private artefacts: any;
  
  constructor( { path, artefacts} : IProjectParams ){

    this.path = path;
    this.artefacts = artefacts;
  }
}