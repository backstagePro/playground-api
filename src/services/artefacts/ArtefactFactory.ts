import { IArtefact } from "./artefact-types/AbstractArtefact";
import ServiceArtefact, { ARTEFACT_SERVICE } from "./artefact-types/ServiceArtefact";

export default class ArtefactFactory {
 

  createArtefact( artefactConf: any ){

    if(artefactConf.type === ARTEFACT_SERVICE){
      return new ServiceArtefact(artefactConf);
    }

    return null;
  }
}