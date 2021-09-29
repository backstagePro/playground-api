import crypto from 'crypto';
import { IRun } from '../../../model/entities/Run';
import { SERVICE_ID_GENERATOR } from '../../../services';

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

export interface IDeps {
    idGenerator: SERVICE_ID_GENERATOR
}

export default abstract class AbstractArtefact {

  protected group: string;

  protected artefactFilePath: string;

  protected idGenerator: SERVICE_ID_GENERATOR;

  constructor(params: IArtefact, deps: IDeps){
    
    this.artefactFilePath = params.$$artefactFilePath;
    this.group = params.group;
    this.idGenerator = deps.idGenerator;
  }

  /**
   * If artefact has a "runs", return runs, otherwise - return false
   */
  abstract getRuns(): IRun[];

  /**
   * Returns base artefact info
   */
  abstract getArtefactInfo(): any;

  public getArtefactFilePath(){

    return this.artefactFilePath;
  }

  /**
   * Returns artefact group
   * 
   * @returns 
   */
  public getGroup(): string {

    return this.group
  }
}