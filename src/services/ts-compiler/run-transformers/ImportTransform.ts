import ts from "typescript";
import path from 'path';
import AbstractRunTransformer, { IDENTIFIER_NODE_TYPE } from "./abstract/AbstractRunTransformer";
import TransformEvent from "./events/TransformEvent";

export default class ImportTransform extends AbstractRunTransformer {

  public nodeTypeTest = (node: ts.Node, ev: TransformEvent) => {

    if(ts.isStringLiteral(node)){

      let parent = ev.findParentOf(node, (_node) => {

        if(ts.isImportDeclaration(_node)){
          return true;
        }

        return false;

      });

      if(parent !== null){
        return true;
      }
    }

    return false;
  };

  public filterFileRegex = /^.*$/m;

  public transform(node: ts.Node, ev: TransformEvent) {

    console.log('[TRANSFORMS] Modify imports for file:', ev.getFileName() )

    const context = ev.getContext();
    const runFileUtils = ev.getRunFilesUtils();

    let importStringPath = node.getText();
    importStringPath = importStringPath.substring(1, importStringPath.length-1);

    const dirName = path.dirname(importStringPath);
    const baseName = path.parse(importStringPath).name;
    
    let newPath
    if(dirName === '.'){
      
      newPath = `./${runFileUtils.getPlaygroundFilePrexixWithoutExt(baseName)}`;
    } else {

      newPath = path.join(dirName, runFileUtils.getPlaygroundFilePrexixWithoutExt(baseName));
    }


    return context.factory.createStringLiteral(
      newPath
    );
  };
}