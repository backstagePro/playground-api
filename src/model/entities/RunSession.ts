
export interface IRunSessionExecTree {
  root: string,
  children: {[filePath: string]: string[]}
}

export interface IRunSessionFileData {
  [filepath: string] : {
    modifiedFile: string,
    filePreview: string
  }
}

export interface IRunSession {
  fileData: IRunSessionFileData;
  executionTree: IRunSessionExecTree;
}

interface IRunSessionParams {
  fileData: any;
  executionTree: any;
  projectPath: string;
}

export default class RunSession {

  private fileData: IRunSessionFileData;

  private projectPath: string;

  private executionTree: IRunSessionExecTree;

  constructor(params: IRunSessionParams){

    this.fileData = params.fileData;
    this.executionTree = params.executionTree;  
    this.projectPath = params.projectPath;
  }

}