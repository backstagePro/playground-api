import AbstractArtefact, { IArtefact, IDeps } from "./AbstractArtefact";

export const ARTEFACT_SERVICE = 'functionality';

export interface IServiceArtefactConf extends IArtefact {
  name: string;
  servicePath: string;
  run: { name: string, id: string, run: any }[];
}

export default class ServiceArtefact extends AbstractArtefact {

  private name: string;
  private servicePath: string;
  private runs: { name: string, run: any }[];

  constructor( params: IServiceArtefactConf, deps:IDeps){
    super(params, deps);

    this.name = params.name;
    this.group = params.group;
    this.servicePath = params.servicePath;
    this.runs = params.run.map((_run) => {
        return {
            ..._run,
            id: this.idGenerator.generateId()
        }
    });
  }

  public getArtefactInfo(){
    
    return { 
      id: this.id,
      name: this.name,
      group: this.group,
      servicePath: this.servicePath, 
      artefactFilePath: this.artefactFilePath,
      runs: this.runs
    };
  }

}