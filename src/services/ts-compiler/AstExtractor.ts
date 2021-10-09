import Ast from "./Ast";
import ts from 'typescript';

/**
 * The role of this class is to extract information from the AST of typescript file
 */
export default class AstExtractor extends Ast {


    /**
     * Returns a array of all found imported paths in the file.
     * 
     * So, if you have in yout file:
     * 
     * ```
     * import * as React from 'react'
     * ```
     * 
     * the result will be:
     * 
     * ```
     * [
     *  {
     *      path: 'react'  
     *  }
     * ]
     * ```
     * 
     */
    public getAllImportStatement(): Array<{ path: string }>{
        
      if(!this.sourceFile.statements){
        return [];
      }
  
      let imports = [];
  
      this.sourceFile.statements.forEach((statement) => {
          if(ts.isImportClause(statement) || ts.isImportDeclaration(statement) || ts.isImportEqualsDeclaration(statement)){
  
              let children = statement.getChildren(this.sourceFile);
  
              let data: any = {};
  
              children.forEach((child) => {
  
                  if(child.kind === ts.SyntaxKind.StringLiteral){
                      data.path = child.getText().slice(1, -1);
                  }
              });
  
              imports.push( data );
          }
      });
        
      return imports;
  }
}