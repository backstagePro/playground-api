import ts from "typescript";
import AbstractRunTransformer, { IDENTIFIER_NODE_TYPE } from "./abstract/AbstractRunTransformer";
import TransformEvent from "./events/TransformEvent";

export default class RunTransformer extends AbstractRunTransformer {

  public nodeTypeTest = (node: ts.Node) => {
    return ts.isVariableStatement(node) || ts.isExpressionStatement(node);
  };

  public filterFileRegex = /^(?!.*(\.playground\.)).*$/gm;

  public transform(node: ts.Node, ev: TransformEvent) {

    // code here
    debugger;
    
    node.pos;

    return node;
    
  };
}