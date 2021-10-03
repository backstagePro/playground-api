
import * as ts from "typescript";
import * as _ from 'lodash';

export default class AstTsTransformer {

  private program: ts.Program;

  private sourceFile: ts.SourceFile;
  
  private printer: ts.Printer;
  
  private filePath: string;

  constructor(  filePath  ){


    this.filePath   = filePath;
    this.program    = this.createProgram();
    this.printer    = this.createPrinter();
    this.sourceFile = this.createSourceFile();
  }

  private createProgram(){

    const options:       ts.CompilerOptions = { allowJs: true, removeComments: false };
    const compilerHost = ts.createCompilerHost(options, /* setParentNodes */ true);
    return ts.createProgram([this.filePath], options, compilerHost);
  }

  private createPrinter(){
    return ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  }

  private createSourceFile(){
    return this.program.getSourceFile(this.filePath);
  }
  
  /**
   * Return the typescript program
   */
  protected getProgram(): ts.Program {

    return this.program;
  }

  /**
   * Return the typescript compiler printer
   */
  protected getPrinter(): ts.Printer {

    return this.printer;
  }

  /**
   * Return the program source file
   */
  protected getSourceFile(): ts.SourceFile {
    
    return this.sourceFile;
  }

  /**
   * 
   * Find a parent node for which the predicate function returns `true`
   * 
   * @param node - current note
   * @param predicate - function to test the parent node
   */
  public findParentOf(node: ts.Node, predicate: (node: ts.Node) => any){

    if(node.parent){
        
        if(predicate(node.parent)){
            return node.parent;
        }

        else {
            return this.findParentOf(node.parent, predicate);
        }

    } else {
        return null;
    }

  }

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

  /**
   * Same as `findChildren()` but will return the first found node.
   * 
   * This function will iterate all children deep in the tree.
   * 
   * @param parent 
   * @param predicate 
   * @returns 
   **/
  public findFirstChild(parent: ts.Node, predicate: (node: ts.Node) => boolean): ts.Node | null {

    let parentChildren = parent.getChildren();

    for(let i = 0, len = parentChildren.length; i < len; i += 1){
      let childNode = parentChildren[i];

      if(predicate(childNode)){
        return childNode;
      }

      let childNodeChildren = childNode.getChildren();

      for(let j = 0, lenJ = childNodeChildren.length; j < lenJ; j += 1){

        let _child = childNodeChildren[j];

        if(predicate(_child)){
          return _child;
        }
        
        let result = this.findFirstChild(_child, predicate);
        if(result !== null){
          return result;
        }
      }
    }

    return null;
  }

  /**
   * For given parent node, find all children for which the `predicate` function returns true
   * 
   * This function will iterate all children deep in the tree.
   * 
   * @param parent 
   * @param predicate 
   */
  public findChildren(parent: ts.Node, predicate: (node: ts.Node) => boolean, result = []){

    parent.getChildren().forEach((child) => {

      if(predicate(parent)){
        result.push(parent);
      }

      if(child.getChildren().length){

        child.getChildren().forEach((_child) => {
          if(predicate(_child)){
            result.push(_child);
          }   

          this.findChildren(_child, predicate, result);
        })
      }
    })

    return result;
  }

  /**
   * 
   * Used to transform the AST tree - adding, replacing, removing nodes.
   * 
   * When wanting to modify the AST in any way you need to traverse the tree - recursively. In more concrete terms 
   * we want to visit each node, and then return either the same, an updated, or a completely new node.
   * 
   * ref: https://github.com/madou/typescript-transformer-handbook#manipulation
   * 
   * @param filterFn - return modified ts.Node
   * @param options - print options 
   * 
   * @returns ts.Node or string of changed code (depend if `printProgram` is set to `true`)
   */
  public trasform(
    filterFn: (node: ts.Node, context: ts.TransformationContext) => any,
    options: { printProgram: boolean } = {
      printProgram: false
    }
   ): ts.Node | string {


    const transformerFactory: ts.TransformerFactory<ts.Node> = (
        context: ts.TransformationContext
    ) => {
      return ( sourceFile ) => {
        function visit(node: ts.Node): ts.Node {
          node = ts.visitEachChild(node, visit, context);

          return filterFn(node, context);
        }

        return ts.visitNode(sourceFile, visit);
      };
    };
    
    const transformationResult = ts.transform(
        this.sourceFile, [transformerFactory]
    );

    if(options.printProgram){
      return this.printer.printNode(ts.EmitHint.Unspecified, transformationResult.transformed[0], this.sourceFile)
    }

    return transformationResult.transformed[0];
  }

  public forEachChild(node: ts.Node, cb: (node: ts.Node, depth: number) => void, depth = 0) {

    cb(node, depth);

    
    depth++;


    node.getChildren().forEach(c=> this.forEachChild(c, cb, depth));
  }

  /**
   * Return the final modified program as string
   * 
   * @param sFile 
   */
  public printProgram(){

    return this.printer.printNode(
        ts.EmitHint.Unspecified,
        this.sourceFile,
        undefined
    );
  }
}