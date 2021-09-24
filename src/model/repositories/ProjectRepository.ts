import { BaseRepository } from "../base/BaseRepository";
import Project from "../entities/Project";

export const MONGO_DATABASE_PROJECTS = 'projects';

export default class ProjectRepository extends BaseRepository<Project> {

}