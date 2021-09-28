import { SERVICE_ID_GENERATOR } from "../../services";
import { IArtefact } from "./artefact-types/AbstractArtefact";
import ServiceArtefact, { ARTEFACT_SERVICE } from "./artefact-types/ServiceArtefact";

export default class ArtefactFactory {
    
    private idGenerator: SERVICE_ID_GENERATOR;

    constructor(idGenerator: SERVICE_ID_GENERATOR){

        this.idGenerator = idGenerator;
    }

    createArtefact( artefactConf: any ){

        if(artefactConf.group === ARTEFACT_SERVICE){
            return new ServiceArtefact(artefactConf, {
                idGenerator: this.idGenerator
            });
        }

        throw new Error(`Missing artefact of group : ${artefactConf.group}`);
    }
}