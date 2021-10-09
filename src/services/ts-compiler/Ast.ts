import path from 'path';
import ts from 'typescript';

/**
 * This class creates ast for provided typescript file
 */
export default class Ast {

  protected program: ts.Program;

  protected sourceFile: ts.SourceFile;
  
  protected printer: ts.Printer;
  
  protected filePath: string;

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
   * Return the name of processed file
   */
  public getFileName(){

    const extension = path.extname(this.filePath);
    const file = path.basename(this.filePath, extension);

    return file;
  }
}