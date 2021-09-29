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
  private runs: {[id: string]: { name: string, run: any, id: string }};

  constructor( params: IServiceArtefactConf, deps:IDeps){
    super(params, deps);

    this.name = params.name;
    this.group = params.group;
    this.servicePath = params.servicePath;

    this.runs = {};

    params.run.forEach((_run) => {
        let id = this.idGenerator.generateId();
         
        this.runs[id] = {..._run, id };
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