import AbstractArtefact, { IArtefact } from "./AbstractArtefact";

export const ARTEFACT_SERVICE = 'functionality';

export interface IServiceArtefactConf extends IArtefact {
  name: string;
  servicePath: string
}

export default class ServiceArtefact extends AbstractArtefact {

  private name: string;
  private servicePath: string;

  constructor( params: IServiceArtefactConf){
    super(params);

    this.name = params.name;
    this.group = params.group;
    this.servicePath = params.servicePath;
  }

  public getArtefactInfo(){
    
    return { 
      name: this.name,
      group: this.group,
      servicePath: this.servicePath, 
      artefactFilePath: this.artefactFilePath 
    };
  }

}