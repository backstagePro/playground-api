
export default class RunFilesUtils {

  private readonly PLAY_FILE_POSTFIX = '__play__.ts';

  public getPlaygroundFilePrefix(fileName: string){
    
    return `${fileName}.${this.PLAY_FILE_POSTFIX}`;
  }
}