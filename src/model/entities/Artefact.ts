

interface IArtParams {
    group: string;
    projectId: string;
}

export default class Artefact {

    private group: string;

    private projectId: string;

    constructor(params: IArtParams){

        this.group = params.group;
        this.projectId = params.projectId;
    }
    
    
}