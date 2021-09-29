
export interface IArtefact {
    id: string;
    name: string;
    group: string;
    runs: any;
}

export interface IProjectParams {
  path: string
  artefacts: { [artefactId: string]: IArtefact[] },
  _id?: string
}

export default class Project {

  /**
   * The path to the project
   */
  private path: string;

  private artefacts: { [artefactGroup: string]: IArtefact[] };

  private _id: string
  
  constructor( { path, artefacts, _id} : IProjectParams ){

    this.path = path;
    this.artefacts = artefacts;

    if(_id){
        this._id = _id;
    }
  }

  /**
   * 
   * Return single artefact by id
   * 
   * @param artefactId 
   */
  public getArtefact(artefactId: string){

    let found = [];

    // @TODO update performance
    
    
  }
}