import crypto from 'crypto';

export interface IArtefact {

  /**
   * The group of the artefact
   */
  group: string;

  /**
   * The path to artefact file in the project
   */
  $$artefactFilePath: string;

}

export default abstract class AbstractArtefact {

  protected group: string;

  protected id: string;

  protected artefactFilePath: string;

  constructor(params: IArtefact){
    this.artefactFilePath = params.$$artefactFilePath;
    this.group = params.group;
    this.id = crypto.randomBytes(20).toString('hex');
  }

  abstract getArtefactInfo(): any;

  public getGroup(): string {

    return this.group
  }
}