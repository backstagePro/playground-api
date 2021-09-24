
export interface IArtefact {
  
  type:string;

}

export default abstract class AbstractArtefact {

  protected type: string;

  constructor(params: IArtefact){
    this.type = params.type;
  }

  abstract getArtefactInfo(): any;

  public getType(): string {
    return this.type
  }
}