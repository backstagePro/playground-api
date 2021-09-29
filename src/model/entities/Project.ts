export interface IProjectParams {
  path: string
  _id?: string
}

export default class Project {

  /**
   * The path to the project
   */
  private path: string;

  private _id: string
  
  constructor( { path, _id} : IProjectParams ){

    this.path = path;
    
    if(_id){
        this._id = _id;
    }
  }
}