
export interface IRun {
    name: string;
    artefactId: string;
}

interface IRunParams {
    run: IRun, 
    artefactId: string;
}

export default class Run {

    private artefactId: string;

    private name: string;

    private id: string;

    constructor(params: IRunParams){

        this.name = params.run.name;
        this.artefactId = params.artefactId;
        
    }
    

}