import ts from "typescript";
import AbstractRunTransformer, { IDENTIFIER_NODE_TYPE } from "./abstract/AbstractRunTransformer";
import TransformEvent from "./events/TransformEvent";

export default class LogTransformer extends AbstractRunTransformer {

  public nodeTypeTest = (node: ts.Node, ev: TransformEvent) => {
    return ts.isVariableStatement(node) || ts.isExpressionStatement(node);
  };

  public filterFileRegex = /^(?!.*(\.playground)).*$/m;

  public transform(node: ts.Node, ev: TransformEvent) {

    const context = ev.getContext();
    
    const {line, character} = ev.getSourceFile().getLineAndCharacterOfPosition(node.getStart());

    const relFilePath = ev.getRelativeFilePath();

    const generatorId = ev.getGeneratorId();
    let identNode = ev.findFirstChild(node, (_node) => {
      
      if(ts.isIdentifier(_node)){
        return true;
      }
      
      return false;
    });

    if(!identNode){
      throw new Error("Missing identNode for node " + node.getText());
    }
    
    return [
      node, // orignal node  

      context.factory.createExpressionStatement(context.factory.createCallExpression(
        context.factory.createIdentifier(`__show__`),
        undefined,
        [context.factory.createObjectLiteralExpression(
          [
            context.factory.createPropertyAssignment(
              context.factory.createIdentifier("variableName"),
              context.factory.createStringLiteral(identNode.getText().trim())
            ),
            context.factory.createPropertyAssignment(
              context.factory.createIdentifier("id"),
              context.factory.createStringLiteral(generatorId.generateId())
            ),
            context.factory.createPropertyAssignment(
              context.factory.createIdentifier("filePath"),
              context.factory.createStringLiteral(relFilePath)
            ),
            context.factory.createPropertyAssignment(
              context.factory.createIdentifier("line"),
              context.factory.createStringLiteral(line.toString())
            ),
            context.factory.createPropertyAssignment(
              context.factory.createIdentifier("val"),
              context.factory.createIdentifier(identNode.getText().trim())
            )
          ],
          false
        )]
      ))
    ];

  };
}