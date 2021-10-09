import ts from 'typescript';
import AstTsTransformer from '../../AstTsTransformer';
import RunTransform from '../../RunTransform';
import AbstractEvent from './AbstractEvent';

export default class TransformEvent extends AbstractEvent {

  private context: ts.TransformationContext;

  private node: ts.Node;

  constructor({
    context, 
    node
  }:{ 
    context:  ts.TransformationContext, 
    node: ts.Node,
  }){
    super();
    
    this.context = context;
    
    this.node = node;
  }

  public getSourceFile(){
    // return this.transformerInstance.
  }

}