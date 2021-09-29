import { SERVICE_ARTEFACT_FACTORY } from "../../services";
import Directory from "../directory/Directory";
import AbstractArtefact from "./artefact-types/AbstractArtefact";

/**
 * Finds playground artefacts from given project
 */
export default class ArtefactFinder {
  private readonly ARTEFACTS_PATTERN_SUB_DIR = '**/*.playground.ts'

  private directory: Directory;

  private artefactFactory: SERVICE_ARTEFACT_FACTORY;

  constructor(directory: Directory, artefactFactory: SERVICE_ARTEFACT_FACTORY){

    this.directory = directory;

    this.artefactFactory = artefactFactory;
  }

  /**
   * Find all artefacts in the system
   */
  public async findAllArtefact(): Promise<AbstractArtefact[]> {
    
    // find all artefacts
    // all artefacts inherit AbstractArtefact
    let artefactsPaths = await this.directory.findFileByPattern(
      this.ARTEFACTS_PATTERN_SUB_DIR
    );

    let artefactObjects = [];

    for (let index = 0; index < artefactsPaths.length; index++) {
      const path = artefactsPaths[index];

      // create instance of the artefact
      let artInstance = await this.produceArtefact( path );
      
      artefactObjects.push(artInstance);
    }

    return artefactObjects;
  }

  /**
   * Create an artefact from given group
   * 
   * @param artefactPath 
   * @returns 
   */
  private async produceArtefact(artefactPath: string){

    let artefactData = (await this.directory.requreFile(artefactPath)).default;

    return this.artefactFactory.createArtefact({ ...artefactData, $$artefactFilePath: artefactPath });

  }
}