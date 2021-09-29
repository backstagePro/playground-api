import { BaseRepository } from "../base/BaseRepository";
import Project from "../entities/Project";

export const MONGO_DATABASE_PROJECTS = 'projects';

export default class ProjectRepository extends BaseRepository<Project> {

    public async findRun(runId: string){

        let projectDoc = await this._collection.findOne({ 'artefacts.functionality.runs.id': runId });

        return new Project(projectDoc as any);

    }
}