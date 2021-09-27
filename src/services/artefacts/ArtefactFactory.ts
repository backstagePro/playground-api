import { IArtefact } from "./artefact-types/AbstractArtefact";
import ServiceArtefact, { ARTEFACT_SERVICE } from "./artefact-types/ServiceArtefact";

export default class ArtefactFactory {
 

  createArtefact( artefactConf: any ){

    if(artefactConf.group === ARTEFACT_SERVICE){
      return new ServiceArtefact(artefactConf);
    }

    throw new Error(`Missing artefact of group : ${artefactConf.group}`);
    return null;
  }
}