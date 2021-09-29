import { SERVICE_REPOSITORY_FACTORY } from "../../services";
import ServiceLocator from "../../services/ServiceLocator";
import { BaseRepository } from "../base/BaseRepository";
import Project from "../entities/Project";

export const MONGO_DATABASE_PROJECTS = 'projects';

export default class ProjectRepository extends BaseRepository<Project> {

  public async collectProjectInfo(projectId: string): Promise<{ project: any, artefacts: any, runs: any }> {

    let artefactRepository = await (await ServiceLocator
        .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('artefact');
    
    let runRepository = await (await ServiceLocator
        .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('run');

    let project = await this.findOne(projectId);
    let artefacts = await artefactRepository.find({projectId: (project as any)._id.toString()});
    let runs = [];

    for(let i = 0, len = (artefacts as any).length; i < len; i += 1){

        let _runs = await runRepository.find({ artefactId: artefacts[i]._id.toString() });
        runs = runs.concat(_runs);
    }
    
    return {
        project, artefacts, runs
    }

  }
}