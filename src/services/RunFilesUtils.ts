
export default class RunFilesUtils {

  private readonly PLAY_FILE_POSTFIX_EXT = '.ts';
  private readonly PLAY_FILE_POSTFIX = '__play__';

  public getPlaygroundFilePrefix(fileName: string){
    
    return `${fileName}.${this.PLAY_FILE_POSTFIX}${this.PLAY_FILE_POSTFIX_EXT}`;
  }

  public getPlaygroundFilePrexixWithoutExt(fileName){
    
    return `${fileName}.${this.PLAY_FILE_POSTFIX}`;
  }
}