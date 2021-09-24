import { SERVICE_ARTEFACT_FACTORY } from "../../services";
import Directory from "../directory/Directory";

/**
 * Finds playground artefacts from given project
 */
export default class ArtefactFinder {

  private readonly ARTEFACTS_PATTERN = '**/*.playground.ts';

  private directory: Directory;

  private artefactFactory: SERVICE_ARTEFACT_FACTORY;

  constructor(directory: Directory, artefactFactory: SERVICE_ARTEFACT_FACTORY){

    this.directory = directory;

    this.artefactFactory = artefactFactory;
  }

  /**
   * Find all artefacts in the system
   */
  public async findAllArtefact(){
    
    // find all artefacts
    let artefactsPaths = await this.directory.findFileByPattern(this.ARTEFACTS_PATTERN);
    let artefactObjects = [];

    for (let index = 0; index < artefactsPaths.length; index++) {
      const path = artefactsPaths[index];

      let object = await this.produceArtefact( path );

      artefactObjects.push(object?.getArtefactInfo());
    }

    return artefactObjects;
  }

  /**
   * Create an artefact from given type
   * 
   * @param artefactPath 
   * @returns 
   */
  private async produceArtefact(artefactPath: string){

    let artefactData = (await this.directory.requreFile(artefactPath)).default;

    return this.artefactFactory.createArtefact(artefactData);

  }
}