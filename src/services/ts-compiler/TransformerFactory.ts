import AstTsTransformer from "./AstTsTransformer";
import RunTransform from "./RunTransform";
import { transformers } from '../ts-compiler/run-transformers/index'

type transformers = 'logger';
type params = {
  filePath: string
}

export default class TransformerFactory {

  public getTransformer(type: transformers, params: params) {

    if(type === 'logger'){
      let transformer = new RunTransform(params.filePath, transformers);
      return transformer;
    }
    
    return null;
  }

}