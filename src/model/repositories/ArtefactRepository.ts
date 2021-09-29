
import { SERVICE_REPOSITORY_FACTORY } from "../../services";
import AbstractArtefact from "../../services/artefacts/artefact-types/AbstractArtefact";
import ServiceLocator from "../../services/ServiceLocator";
import { BaseRepository } from "../base/BaseRepository";
import Artefact from "../entities/Artefact";
import Run from "../entities/Run";

export const MONGO_DATABASE_ARTEFACTS = 'artefacts';

export default class ArtefactRepository extends BaseRepository<Artefact> {

  public async importArtefacts(artefacts: AbstractArtefact[], projectId: string){

    let runRepository = await (await ServiceLocator
        .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('run');
    
    for (let index = 0; index < artefacts.length; index++) {
        const art = artefacts[index];

        debugger;
        
        let info = { projectId, group: art.getGroup(), path: art.getArtefactFilePath() };

        let artefactId = await this.create(new Artefact(info, art.getArtefactInfo()));

        if(art.getRuns()){
            let runs = art.getRuns();

            for(let i = 0, len = runs.length; i < len; i++){
                let _run = runs[i];

                await runRepository.create(new Run({run: _run, artefactId })) 
            }
        }

    }
  }
}