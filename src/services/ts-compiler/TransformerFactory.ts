import AstTsTransformer from "./AstTsTransformer";
import RunTransform from "./RunTransform";

type transformers = 'logger';
type params = {
  filePath: string
}

export default class TransformerFactory {

  public getTransformer(type: transformers, params: params) {

    if(type === 'logger'){
      let transformer = new RunTransform(params.filePath);
      return transformer;
    }
    
    return null;
  }

}