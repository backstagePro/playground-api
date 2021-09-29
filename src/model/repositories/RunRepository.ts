import AbstractArtefact from "../../services/artefacts/artefact-types/AbstractArtefact";
import { BaseRepository } from "../base/BaseRepository";
import Run, { IRun } from "../entities/Run";

export const MONGO_DATABASE_RUNS = 'runs';

export default class RunRepository extends BaseRepository<Run> {

    public async importRuns(artefacts: {[arId: string]: AbstractArtefact}){

        // let arIds = Object.keys(artefacts);

        // for(let i = 0, len = arIds.length; i < len; i++){

        //     let artefact = artefacts[arIds[i]];

        //     debugger;
        //     let runs = artefact.getRuns();

        //     if(runs){

        //         for(let run in runs){
        //             if(runs.hasOwnProperty(run)){
        //                 await this.create(new Run(runs[run], artefact.getId()))
        //             }
        //         }
        //     }
        // }
    }

    public async findAllRunsForArtefact( artefactIds: string[] ){

        // debugger;

        // let runs = await this._collection.find({ artefactId : { $in: artefactIds }});

        // return runs;
    }

}