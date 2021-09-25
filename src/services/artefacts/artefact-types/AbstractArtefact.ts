
export interface IArtefact {

  /**
   * The type of the artefact
   */
  type:string;

  /**
   * The path to artefact file in the project
   */
  $$artefactFilePath: string;

}

export default abstract class AbstractArtefact {

  protected type: string;

  protected artefactFilePath: string;

  constructor(params: IArtefact){
    this.artefactFilePath = params.$$artefactFilePath;
    this.type = params.type;
  }

  abstract getArtefactInfo(): any;

  public getType(): string {

    return this.type
  }
}