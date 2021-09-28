import crypto from 'crypto';
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

  protected id: string;

  protected artefactFilePath: string;

  protected idGenerator: SERVICE_ID_GENERATOR;

  constructor(params: IArtefact, deps: IDeps){
    
    this.artefactFilePath = params.$$artefactFilePath;
    this.group = params.group;
    this.idGenerator = deps.idGenerator;
    this.id = this.idGenerator.generateId();
  }

  abstract getArtefactInfo(): any;

  public getGroup(): string {

    return this.group
  }
}