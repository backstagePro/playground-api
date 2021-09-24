import AbstractArtefact, { IArtefact } from "./AbstractArtefact";

export const ARTEFACT_SERVICE = 'service';

export interface IServiceArtefactConf extends IArtefact {
  name: string;
  group: string;
  servicePath: string
}

export default class ServiceArtefact extends AbstractArtefact {

  private params: IServiceArtefactConf;

  constructor( params: IServiceArtefactConf){
    super(params);

    this.params = params;
  }

  getArtefactInfo(){

    return this.params;
  }

}