import ts, { SyntaxKind } from 'typescript';
import TransformEvent from '../events/TransformEvent';

export const IDENTIFIER_NODE_TYPE = 'IDENTIFIER_NODE_TYPE';

export default abstract class AbstractRunTransformer {


  /**
   * Specify what type of ts.Node will be processed by this class 
   */
  abstract nodeTypeTest: Function;

  /**
   * Specify the token from what file name should be processed
   * 
   * The regex is applied to the name of the file 
   */
  abstract filterFileRegex: RegExp;

  /**
   * Function used to process the node
   * 
   * @param node 
   * @param ev 
   */
  abstract transform(node: ts.Node, ev: TransformEvent): ts.Node

  public getFileRegex(){

    return this.filterFileRegex;
  }
}