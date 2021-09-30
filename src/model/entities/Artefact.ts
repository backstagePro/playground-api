
export interface IArtefact {
    _id : string,
    group : string,
    projectId : string,
    path : string,
    name : string,
    servicePath : string,
    artefactFilePath : string
}

interface IArtParams {
    group: string;
    projectId: string;
    path: string;
}

export default class Artefact {

    private group: string;

    private projectId: string;

    /**
     * Path to artefact
     */
    private path: string;

    constructor(params: IArtParams, customParams: any){

        this.group = params.group;
        this.projectId = params.projectId;
        this.path = params.path;

        Object.keys(customParams).forEach((key) => {
            this[key] = customParams[key];
        })
    }
    
    
}