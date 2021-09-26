import AstTsTransformer from "./AstTsTransformer";
import LoggerTransform from "./LoggerTransform";

type transformers = 'logger';
type params = {
  filePath: string
}

export default class TransformerFactory {

  public getTransformer(type: transformers, params: params) {

    if(type === 'logger'){
      return new LoggerTransform(params.filePath);
    }
    
    return null;
  }

}